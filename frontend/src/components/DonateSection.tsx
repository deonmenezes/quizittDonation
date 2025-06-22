
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Heart, Shield, Mail, Receipt, Share2, Facebook, Twitter } from 'lucide-react';

interface DonateSectionProps {
  onDonate: (newTotal: number) => void;
  currentAmount: number;
}

const DonateSection = ({ onDonate, currentAmount }: DonateSectionProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [recentDonations] = useState([
    { amount: 1200, donor: "Sarah J.", time: "2 min ago" },
    { amount: 600, donor: "Anonymous", time: "5 min ago" },
    { amount: 3000, donor: "Raj P.", time: "8 min ago" }
  ]);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const presetAmounts = [600, 1200, 3000, 6000, 12000];

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid donation amount (minimum ₹100)",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Redirecting to Payment",
      description: "You will be redirected to Razorpay for secure payment processing",
    });

    setTimeout(() => {
      onDonate(currentAmount + amount);
      toast({
        title: "Thank You! 🎉",
        description: `Your donation of ₹${amount.toLocaleString()} has been received successfully!`,
      });
      setSelectedAmount(null);
      setCustomAmount('');
    }, 2000);
  };

  const handleShare = (platform: string) => {
    const text = "Help us revolutionize education with Quizitt.com! Every ₹600 gives a child one year of interactive learning.";
    const url = window.location.href;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        toast({ title: "Link copied to clipboard!", description: "Share with your friends and family" });
        break;
    }
  };

  const getChildrenCount = (amount: number) => Math.floor(amount / 600);
  const selectedTotal = selectedAmount || parseInt(customAmount) || 0;

  return (
    <section 
      id="donate" 
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className={`text-center mb-16 text-white transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Make Your Impact</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Choose your contribution amount and help us provide revolutionary education technology to children worldwide
          </p>
        </div>

        {/* Live donation feed */}
        <div className={`mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              Recent Donations
            </h3>
            <div className="flex flex-wrap gap-4">
              {recentDonations.map((donation, index) => (
                <div key={index} className="bg-white/20 rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold">₹{donation.amount.toLocaleString()}</span> by {donation.donor} • {donation.time}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className={`bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              Secure Donation via Razorpay
            </CardTitle>
            <p className="text-gray-600 mt-2">Your contribution is protected by bank-level security</p>
          </CardHeader>
          
          <CardContent className="space-y-10 px-8 pb-8">
            {/* Preset amounts */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Choose Your Impact Level</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`h-24 flex flex-col space-y-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedAmount === amount 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl scale-105' 
                        : 'hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400'
                    }`}
                  >
                    <span className="font-bold text-lg">₹{amount.toLocaleString()}</span>
                    <span className="text-xs opacity-80">
                      {getChildrenCount(amount)} child{getChildrenCount(amount) > 1 ? 'ren' : ''}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter custom amount"
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300"
                  min="100"
                />
              </div>
              {(customAmount && parseInt(customAmount) >= 600) && (
                <Badge className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🎓 This will help {getChildrenCount(parseInt(customAmount))} children get education for a year!
                </Badge>
              )}
            </div>

            {/* Impact preview */}
            {selectedTotal > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Your Impact Preview</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-600">₹{selectedTotal.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Your Contribution</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{getChildrenCount(selectedTotal)}</div>
                    <div className="text-sm text-gray-600">Children Helped</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">365</div>
                    <div className="text-sm text-gray-600">Days of Learning</div>
                  </div>
                </div>
              </div>
            )}

            {/* Donate button */}
            <Button 
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!selectedAmount && !customAmount}
            >
              <Heart className="w-6 h-6 mr-3" />
              Donate Securely with Razorpay
            </Button>

            {/* Social sharing */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Share Our Mission</h3>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('copy')}
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Security badges */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Email Receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <span>Tax Benefits (80G)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DonateSection;
