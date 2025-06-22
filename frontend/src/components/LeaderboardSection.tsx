import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define a type for your payment data from MongoDB
interface PaymentData {
  _id: { "$oid": string };
  razorpayOrderId: string;
  amount: number; // Amount is in the smallest currency unit (e.g., paise for INR)
  currency: string;
  status: string;
  donorName: string; // New field from your provided data
  createdAt: { "$date": string };
  updatedAt: { "$date": string };
  // contact?: string; // These might still exist in your DB but are not needed for donor identification in this scenario
  // email?: string;   // if donorName is always present and sufficient.
  method?: string; // Make optional as it might not be consistently used for leaderboards
  razorpayPaymentId?: string; // Make optional
  razorpaySignature?: string; // Make optional
}

// Define a type for a donor on the leaderboard
interface LeaderboardDonor {
  name: string;
  amount: number; // Amount in Rupees for display
  rank: number;
  avatar: string;
  recent: boolean;
}

const LeaderboardSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('leaderboard');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/payment/payments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch payments.");
        }
        const data: PaymentData[] = await response.json();

        const processedDonations = processPaymentsForLeaderboard(data, timeFilter);
        setLeaderboardData(processedDonations);

      } catch (err: any) {
        console.error("Error fetching leaderboard data:", err);
        setError(err.message || "Failed to load leaderboard. Please try again later.");
        toast({
          title: "Leaderboard Error",
          description: err.message || "Could not load donation leaderboard.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeFilter, BACKEND_URL, toast]);

  // Helper function to process payments into leaderboard format
  const processPaymentsForLeaderboard = (payments: PaymentData[], filter: 'week' | 'month' | 'all'): LeaderboardDonor[] => {
    const now = new Date();
    let filteredPayments = payments;

    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7); // Calculate date for one week ago
      filteredPayments = payments.filter(payment => new Date(payment.createdAt.$date) >= oneWeekAgo);
    } else if (filter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1); // Calculate date for one month ago
      filteredPayments = payments.filter(payment => new Date(payment.createdAt.$date) >= oneMonthAgo);
    }

    // Aggregate donations by donorName
    const donorMap = new Map<string, { totalAmount: number, name: string, lastDonationTime: Date }>();

    filteredPayments.forEach(payment => {
      const amountInRupees = payment.amount / 100; // Convert paise to Rupees
      const donorName = payment.donorName || "Anonymous Donor"; // Use donorName directly, fallback to "Anonymous Donor"

      if (donorMap.has(donorName)) {
        const existing = donorMap.get(donorName)!;
        existing.totalAmount += amountInRupees;
        existing.lastDonationTime = new Date(Math.max(existing.lastDonationTime.getTime(), new Date(payment.createdAt.$date).getTime()));
        donorMap.set(donorName, existing);
      } else {
        donorMap.set(donorName, {
          totalAmount: amountInRupees,
          name: donorName,
          lastDonationTime: new Date(payment.createdAt.$date)
        });
      }
    });

    const sortedDonors = Array.from(donorMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5); // Get top 5 donors

    // Map to LeaderboardDonor format
    const leaderboardEntries: LeaderboardDonor[] = sortedDonors.map((donor, index) => {
      const isRecent = (now.getTime() - donor.lastDonationTime.getTime()) < (24 * 60 * 60 * 1000); // within last 24 hours
      return {
        name: donor.name === "Anonymous" ? "Anonymous Donor" : donor.name,
        amount: donor.totalAmount,
        rank: index + 1,
        // Generate avatar based on donor.name (using name directly for seed)
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(donor.name)}&radius=50`,
        recent: isRecent
      };
    });

    return leaderboardEntries;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />;
    return <span className="text-base sm:text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
    return "bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 border-purple-200";
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'week': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'month': return <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getChildrenCount = (amount: number) => Math.floor(amount / 600); // Assuming 600 is the cost per child per year

  return (
    <section id="leaderboard" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden font-inter">
      {/* Parallax background elements for visual appeal */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Title and description */}
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Our Amazing Supporters</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Celebrating the incredible individuals who are making Quizitt.com's educational revolution possible
          </p>
        </div>

        {/* Filter Buttons for Week, Month, All Time */}
        <div className={`flex justify-center mb-8 sm:mb-10 md:mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 shadow-lg border border-purple-100">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {(['week', 'month', 'all'] as const).map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  variant={timeFilter === filter ? "default" : "ghost"}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                    timeFilter === filter
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {getFilterIcon(filter)}
                  {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Card */}
        <Card className={`bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              Top Contributors
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {timeFilter === 'week' ? 'Weekly' : timeFilter === 'month' ? 'Monthly' : 'All Time'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-8 pb-4 sm:pb-8">
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">Loading amazing supporters...</p>
                <div className="spinner mt-4"></div> {/* Add a CSS spinner if you have one */}
              </div>
            )}
            {error && (
              <div className="text-center py-8 text-red-600">
                <p className="text-lg">{error}</p>
                <p className="text-sm">Please try refreshing the page.</p>
              </div>
            )}
            {!loading && !error && leaderboardData.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg">No donations found for this period yet.</p>
                <p className="text-md">Be the first to make an impact!</p>
              </div>
            )}
            {!loading && !error && leaderboardData.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {leaderboardData.map((donor, index) => (
                  <div
                    key={`${donor.name}-${index}`}
                    className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      donor.rank <= 3
                        ? getRankColor(donor.rank)
                        : 'bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto mb-3 sm:mb-0">
                      {/* Rank Icon */}
                      <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        {getRankIcon(donor.rank)}
                      </div>
                      {/* Donor Avatar and Info */}
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={donor.avatar}
                            alt={donor.name}
                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white shadow-lg"
                            onError={(e) => {
                              // Fallback to a generic initial avatar if the DiceBear API fails or URL is bad
                              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(donor.name)}&radius=50`;
                            }}
                          />
                          {donor.recent && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-1.5 border-white animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-base sm:text-lg text-gray-800 flex items-center gap-1.5">
                            {donor.name}
                            {donor.recent && (
                              <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">Recent</Badge>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Will Empower {getChildrenCount(donor.amount)} children with education
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Donation Amount and Supporter Type */}
                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <div className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{donor.amount.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {donor.rank === 1 ? '🏆 Champion' : donor.rank === 2 ? '🥈 Hero' : donor.rank === 3 ? '🥉 Star' : 'Supporter'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Call to Action at the bottom of the leaderboard */}
            <div className="mt-8 sm:mt-12 text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">🌟 Join Our Community of Change-Makers!</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">
                Every contribution, no matter the size, makes a real difference in a child's educational journey.
              </p>
             
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LeaderboardSection;