import { useState, useEffect } from 'react';
import { Button } from './../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import { useToast } from './../hooks/use-toast';
import { Heart, Shield, Mail, Receipt, Share2, Facebook, Twitter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './../components/Header';
import Footer from './../components/Footer';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recentDonations] = useState([
    { amount: 1200, donor: "Sarah J.", time: "2 min ago" },
    { amount: 600, donor: "Anonymous", time: "5 min ago" },
    { amount: 3000, donor: "Raj P.", time: "8 min ago" }
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const presetAmounts = [600, 1200, 3000, 6000, 12000];

  // Correctly access the environment variable
  // Ensure you have a .env file in your project root with VITE_BACKEND_URL and VITE_RAZORPAY_KEY_ID
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;


  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Define window.Razorpay for TypeScript if it's not globally declared
  declare global {
    interface Window {
      Razorpay: any; // Or a more specific type if you have one
    }
  }

  const handlePaymentSuccess = async (response: any) => {
    // This function will now send verification data to your backend
    try {
      // Corrected typo: import.meta.VITE_BACKEND_URL
      const verifyRes = await fetch(`${BACKEND_URL}/api/v1/payment/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        toast({
          title: "Payment Successful! 🎉",
          description: "Your donation has been successfully processed and verified. Thank M",
        });
        setSelectedAmount(null);
        setCustomAmount('');
      } else {
        toast({
          title: "Payment Verification Failed",
          description: `Your payment was processed, but verification failed: ${verifyData.message}. Please contact support.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error during payment verification:", error);
      toast({
        title: "Verification Error",
        description: `There was an error verifying your payment. Please contact support. Error: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDonate = async () => {
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
      title: "Initiating Payment",
      description: "Redirecting to Razorpay for secure payment processing...",
    });

    try {
      // Step 1: Create an order on your backend
      // Corrected typo: import.meta.VITE_BACKEND_URL
      const res = await fetch(`${BACKEND_URL}/api/v1/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: amount }) // Send amount in Rupees to backend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create order on backend.");
      }

      const orderData = await res.json(); // This 'orderData' contains the Razorpay order details

      // Step 2: Open Razorpay checkout with the order details
      const options = {
        key: RAZORPAY_KEY_ID, // Use the environment variable for Razorpay Key ID
        amount: orderData.amount, // Amount in paise from backend order
        currency: orderData.currency,
        name: "Quizitt.com Education",
        description: "Support interactive learning for children",
        order_id: orderData.id, // The order ID from your backend
        handler: function (response: any) {
          // This handler is called on successful payment from Razorpay
          console.log("Razorpay Payment Response:", response);
          handlePaymentSuccess(response); // Call your verification function
        },
        prefill: {
          name: "John Doe", // Placeholder: In a real app, get this from user
          email: "john@example.com", // Placeholder: In a real app, get this from user
          contact: "9999999999" // Placeholder: In a real app, get this from user
        },
        theme: {
          color: "#6B46C1" // A purple shade to match your theme
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Cancelled",
              description: "You closed the Razorpay payment window.",
              variant: "default"
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Payment Error",
        description: `There was an issue processing your payment: ${error.message}. Please try again.`,
        variant: "destructive"
      });
    }
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
        const textArea = document.createElement("textarea");
        textArea.value = `${text} ${url}`;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast({ title: "Link copied to clipboard!", description: "Share with your friends and family" });
        } catch (err) {
          console.error('Failed to copy: ', err);
          toast({ title: "Failed to copy link", description: "Please copy it manually.", variant: "destructive" });
        }
        document.body.removeChild(textArea);
        break;
      default:
        break;
    }
  };

  const getChildrenCount = (amount: number) => Math.floor(amount / 600);
  const selectedTotal = selectedAmount || parseInt(customAmount) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 font-inter">
      <Header />

      <div className="py-12 md:py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        {/* Background blobs for visual effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-purple-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10 md:mb-16 text-white">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6 md:mb-8 border-white/30 text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm md:text-base"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Make Your Impact</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Choose your contribution amount and help us provide revolutionary education technology to children worldwide
            </p>
          </div>

          {/* Live donation feed */}
          <div className="mb-8 md:mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                Recent Donations
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="bg-white/20 rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                    <span className="font-semibold">₹{donation.amount.toLocaleString()}</span> by {donation.donor} • {donation.time}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl p-4 sm:p-6 md:p-8">
            <CardHeader className="text-center pb-6 sm:pb-8">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" />
                Secure Donation via Razorpay
              </CardTitle>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Your contribution is protected by bank-level security</p>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 md:space-y-10 px-0 sm:px-4 md:px-8 pb-4 sm:pb-6 md:pb-8">
              {/* Preset amounts */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Choose Your Impact Level</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`h-20 sm:h-24 flex flex-col space-y-1 sm:space-y-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedAmount === amount
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl scale-105'
                          : 'hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      <span className="font-bold text-base sm:text-lg">₹{amount.toLocaleString()}</span>
                      <span className="text-xs opacity-80">
                        {getChildrenCount(amount)} child{getChildrenCount(amount) > 1 ? 'ren' : ''}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-3 sm:space-y-4">
                <label htmlFor="custom-amount" className="text-base sm:text-lg font-semibold text-gray-800 block text-center sm:text-left">Or Enter Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-lg">₹</span>
                  <input
                    id="custom-amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base sm:text-lg transition-all duration-300"
                    min="100"
                  />
                </div>
                {(customAmount && parseInt(customAmount) >= 600) && (
                  <Badge className="bg-green-100 text-green-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm block w-fit mx-auto sm:mx-0 mt-2">
                    🎓 This will help {getChildrenCount(parseInt(customAmount))} children get education for a year!
                  </Badge>
                )}
              </div>

              {/* Impact preview */}
              {selectedTotal > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-purple-200">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 text-center">Your Impact Preview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600">₹{selectedTotal.toLocaleString()}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Your Contribution</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{getChildrenCount(selectedTotal)}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Children Helped</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-green-600">365</div>
                      <div className="text-xs sm:text-sm text-gray-600">Days of Learning</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Donate button */}
              <Button
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!selectedAmount && (!customAmount || parseInt(customAmount) < 100)}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Donate Securely with Razorpay
              </Button>

              {/* Social sharing */}
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">Share Our Mission</h3>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Button
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Security badges */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span>Email Receipt</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <span>Tax Benefits (80G)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Donate;