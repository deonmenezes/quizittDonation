import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is available for error handling

interface ProgressSectionProps {
  goal: number; // Goal will still be passed as a prop from parent
}

const ProgressSection = ({ goal }: ProgressSectionProps) => {
  const [totalRaised, setTotalRaised] = useState(0); // Managed internally now
  const [donorCount, setDonorCount] = useState(0);   // Managed internally now
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Access backend URL

  const percentage = (totalRaised / goal) * 100;
  const childrenHelped = Math.floor(totalRaised / 600); // Calculate children helped based on fetched amount

  // Fetch data on component mount
  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/payment/campaign-progress`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch campaign progress.");
        }
        const data = await response.json();
        setTotalRaised(data.totalRaised);
        setDonorCount(data.donorCount);
      } catch (err: any) {
        console.error("Error fetching campaign progress data:", err);
        setError(err.message || "Failed to load campaign progress. Please try again later.");
        toast({
          title: "Progress Error",
          description: err.message || "Could not load campaign progress.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [BACKEND_URL, toast]); // Re-fetch if backend URL changes (though usually static)

  // Animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !error) { // Only animate if visible and data loaded without error
          setIsVisible(true);
          const duration = 2000;
          const steps = 60;
          const increment = totalRaised / steps;
          let current = 0;

          // Clear any existing timer to prevent multiple animations on re-render
          let animationTimer: NodeJS.Timeout;

          const startAnimation = () => {
            animationTimer = setInterval(() => {
              current += increment;
              if (current >= totalRaised) {
                current = totalRaised;
                clearInterval(animationTimer);
              }
              setAnimatedAmount(Math.floor(current));
            }, duration / steps);
          };

          startAnimation(); // Start animation when component is visible and data is ready

          return () => clearInterval(animationTimer); // Cleanup on unmount or re-trigger
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('progress-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, [totalRaised, loading, error]); // Re-run animation effect when totalRaised changes or loading/error states update


  return (
    <section id="progress-section" className="py-16 px-4 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl">
        <div className={`bg-white rounded-3xl shadow-2xl p-10 border border-purple-100 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Campaign Progress</h2>
            <p className="text-xl text-gray-600">Every contribution powers the future of education</p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Loading campaign data...</p>
              <div className="spinner mt-4"></div> {/* Add a CSS spinner if you have one */}
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg">{error}</p>
              <p className="text-sm">Please check your network or try again later.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              <div className="relative">
                <Progress
                  value={percentage}
                  className="h-8 bg-gray-100 rounded-full overflow-hidden shadow-inner"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ₹{animatedAmount.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-medium">Raised</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
                </div>
                <div className="space-y-3 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{goal.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-medium">Goal</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"></div>
                </div>
                <div className="space-y-3 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {donorCount}
                  </div>
                  <div className="text-gray-600 font-medium">Supporters</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-gray-800 mb-3">{childrenHelped} Children</div>
                <div className="text-lg text-gray-600">we be accessing FREE enhanced education through Quizitt.com!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;