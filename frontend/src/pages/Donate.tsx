import { useState, useRef } from 'react';
import { Button } from './../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import { useToast } from './../hooks/use-toast';
import {
  Heart,
  ShieldCheck,
  Facebook,
  Twitter,
  Share2,
  ReceiptText,
  Banknote,
  QrCode,
  Copy,
  CheckCircle,
  Info,
} from 'lucide-react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import qr from '../../public/qr.jpg'; // Ensure this path is correct based on your project structure

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [isCopied, setIsCopied] = useState<{ [key: string]: boolean }>({});

  const { toast } = useToast();

  const presetAmounts = [600, 1200, 3000, 6000, 12000];

  const bankDetails = {
    beneficiaryName: "DEON MENEZES",
    bankName: "HDFC Bank",
    branchNameAddress: "PRUDENTIAL BUILDING GROUND FLOOR, MUMBAI- 400076, MAHARASHTRA",
    accountNo: "50100566764509",
    micrCode: "400240039",
    ifscCode: "HDFC0000239",
  };

  const qrCodeImage = qr;

  const bankDetailsRef = useRef<HTMLDivElement>(null);

  const handleShare = (platform: string) => {
    const text = "Help us revolutionize education with Quizitt.com! Every ₹600 gives a child one year of interactive learning. You can donate directly to our bank account or via UPI.";
    const url = window.location.href;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy-all':
        let allDetailsText = `${text} ${url}\n\n`;
        allDetailsText += "--- Bank Transfer Details ---\n";
        allDetailsText += `Beneficiary Name: ${bankDetails.beneficiaryName}\n`;
        allDetailsText += `Bank Name: ${bankDetails.bankName}\n`;
        allDetailsText += `Account No: ${bankDetails.accountNo}\n`;
        allDetailsText += `IFSC Code: ${bankDetails.ifscCode}\n`;
        allDetailsText += `Branch: ${bankDetails.branchNameAddress}\n`;
        allDetailsText += `MICR Code: ${bankDetails.micrCode}\n`;

        navigator.clipboard.writeText(allDetailsText)
          .then(() => {
            toast({ title: "All donation details copied!", description: "Share with your friends and family." });
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
            toast({ title: "Failed to copy details", description: "Please copy it manually.", variant: "destructive" });
          });
        break;
      default:
        break;
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(prev => ({ ...prev, [key]: true }));
        toast({ title: "Copied!", description: `"${key.replace('-', ' ')}" copied to clipboard.` });
        setTimeout(() => setIsCopied(prev => ({ ...prev, [key]: false })), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({ title: "Failed to copy", description: "Please copy it manually.", variant: "destructive" });
      });
  };

  const getChildrenCount = (amount: number) => Math.floor(amount / 600);
  const selectedTotal = selectedAmount || parseInt(customAmount) || 0;

  const handleSimulateDonation = () => {
    if (!donorName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Thank You for Your Intention! 🙏",
      description: "Please use the provided bank details or QR code to complete your donation. Your generosity is appreciated!",
      action: <Button variant="secondary" onClick={() => window.open('https://quizitt.com/', '_blank')} className="animate-pulse">See Our Impact</Button>,
    });
    setSelectedAmount(null);
    setCustomAmount('');
    setDonorName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter text-gray-800 flex flex-col">
      <Header />

      <main className="flex-1 relative py-8 md:py-12 px-4 overflow-y-auto">
        {/* Modern Background Gradient & Shapes - Adjusted for smaller screens */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 right-10 w-64 h-64 sm:w-72 sm:h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700 leading-tight">
              Empower Learning. Change Lives.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed opacity-90">
              Your contribution fuels our mission to provide high-quality, accessible education to every child.
            </p>
          </div>

          <Card className="bg-white rounded-3xl shadow-3xl border border-gray-100 overflow-hidden">
            <CardHeader className="p-5 sm:p-7 border-b border-gray-100">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Banknote className="w-7 h-7 text-green-600 sm:w-8 sm:h-8" />
                Complete Your Donation
              </CardTitle>
              <p className="text-base text-gray-600 mt-1 sm:mt-2">Choose your preferred method below to make a secure contribution.</p>
            </CardHeader>

            <CardContent className="p-5 sm:p-7 space-y-6">
              {/* Amount Selection & Donor Name */}
              <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-inner">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Your Contribution
                </h3>
                <div className="space-y-3">
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`h-18 sm:h-22 flex flex-col items-center justify-center space-y-0.5 transition-all duration-300 ease-in-out border-2 rounded-xl text-center text-sm sm:text-base
                          ${selectedAmount === amount
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg border-transparent transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <span className="font-bold text-base sm:text-lg">₹{amount.toLocaleString()}</span>
                        <span className="text-xs opacity-90">
                          {getChildrenCount(amount)} child{getChildrenCount(amount) > 1 ? 'ren' : ''}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="relative mt-3">
                    <label htmlFor="custom-amount" className="sr-only">Custom Amount</label>
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-lg">₹</span>
                    <input
                      id="custom-amount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="Or enter custom amount"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base transition-all duration-300 shadow-sm bg-white"
                      min="100"
                    />
                    {(customAmount && parseInt(customAmount) >= 600) && (
                      <Badge className="absolute top-1 right-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs animate-fade-in-up">
                        🎓 Helps {getChildrenCount(parseInt(customAmount))} children!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Donor Name */}
              <div className="bg-purple-50 rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-inner">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  Your Details (Optional)
                </h3>
                <div>
                  <label htmlFor="donor-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name (for recognition)</label>
                  <input
                    id="donor-name"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-base transition-all duration-300 shadow-sm bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Your name helps us acknowledge your generous support.</p>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('upi')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base sm:text-lg transition-colors duration-200 ease-in-out
                      ${activeTab === 'upi'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <QrCode className="inline-block w-5 h-5 mr-1.5 -mt-1 sm:w-6 sm:h-6 sm:mr-2" />
                    UPI / QR Code
                  </button>
                  <button
                    onClick={() => setActiveTab('bank')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base sm:text-lg transition-colors duration-200 ease-in-out
                      ${activeTab === 'bank'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Banknote className="inline-block w-5 h-5 mr-1.5 -mt-1 sm:w-6 sm:h-6 sm:mr-2" />
                    Bank Transfer
                  </button>
                </nav>
              </div>

              {/* UPI / QR Code Section */}
              {activeTab === 'upi' && (
                <div className="space-y-5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 sm:p-7 border border-teal-100 shadow-lg animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-bold text-teal-800 flex items-center justify-center gap-3">
                    <QrCode className="w-6 h-6 text-teal-600 sm:w-7 sm:h-7" />
                    Scan to Pay with UPI
                  </h3>
                  <div className="flex justify-center items-center p-3 bg-white rounded-xl shadow-md border border-gray-200">
                    <img src={qrCodeImage} alt="UPI QR Code" className="w-48 h-48 sm:w-60 sm:h-60 object-contain" />
                  </div>
                  <p className="text-center text-sm text-gray-700 mt-3">
                    Open any UPI app (Google Pay, PhonePe, Paytm, etc.) and scan this QR code to complete your donation instantly.
                  </p>
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => {
                        copyToClipboard("8104796542@pthdfc", "UPI ID");
                      }}
                      variant="outline"
                      className="text-teal-700 border-teal-300 hover:bg-teal-100 hover:border-teal-500 transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      {isCopied['UPI ID'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      {isCopied['UPI ID'] ? 'Copied UPI ID!' : 'Copy UPI ID (Optional)'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Bank Details Section */}
              {activeTab === 'bank' && (
                <div className="space-y-5 bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-5 sm:p-7 border border-rose-100 shadow-lg animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-bold text-rose-800 flex items-center justify-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-rose-600 sm:w-7 sm:h-7" />
                    Direct Bank Transfer
                  </h3>
                  <div ref={bankDetailsRef} className="space-y-3 text-sm sm:text-base text-gray-700 font-medium">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span>Beneficiary Name:</span>
                      <span className="font-semibold text-gray-900 text-right flex-1 ml-2">{bankDetails.beneficiaryName}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.beneficiaryName, "Beneficiary Name")}>
                        {isCopied['Beneficiary Name'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span>Bank Name:</span>
                      <span className="font-semibold text-gray-900 text-right flex-1 ml-2">{bankDetails.bankName}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.bankName, "Bank Name")}>
                        {isCopied['Bank Name'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span>Account Number:</span>
                      <span className="font-semibold text-gray-900 text-right flex-1 ml-2">{bankDetails.accountNo}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.accountNo, "Account Number")}>
                        {isCopied['Account Number'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span>IFSC Code:</span>
                      <span className="font-semibold text-gray-900 text-right flex-1 ml-2">{bankDetails.ifscCode}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.ifscCode, "IFSC Code")}>
                        {isCopied['IFSC Code'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span>MICR Code:</span>
                      <span className="font-semibold text-gray-900 text-right flex-1 ml-2">{bankDetails.micrCode}</span>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.micrCode, "MICR Code")}>
                        {isCopied['MICR Code'] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-600 mt-3">
                    Please use the above details to transfer your desired amount from your bank account.
                  </p>
                </div>
              )}

              {/* Impact preview */}
              {selectedTotal > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 sm:p-7 border border-indigo-200 shadow-md animate-fade-in-up">
                  <h3 className="font-bold text-xl sm:text-2xl text-indigo-800 mb-3 text-center">Your Contribution's Impact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">₹{selectedTotal.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Your Generous Donation</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{getChildrenCount(selectedTotal)}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Children Empowered (for a year)</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-green-600">365</div>
                      <div className="text-xs text-gray-600 mt-0.5">Days of Transformative Learning</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Call to Action */}
              <Button
                onClick={handleSimulateDonation}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3.5 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                disabled={!donorName.trim()}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                I've Completed My Donation!
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400 sm:w-4 sm:h-4" />
                Clicking this helps us track support. Please ensure your transfer is complete.
              </p>

              {/* Social sharing */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 text-center">Spread the Word. Multiply the Impact.</h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    Share on Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    Share on Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('copy-all')}
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Copy All Details
                  </Button>
                </div>
              </div>

              {/* Security & Trust Badges */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 text-center space-y-3 border border-gray-100 shadow-sm">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700">Our Commitment to Transparency</h3>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
                    <span>Verified & Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ReceiptText className="w-4 h-4 text-purple-600 sm:w-5 sm:h-5" />
                    <span>80G Tax Exemption Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src="WhatsApp Image 2025-06-22 at 19.06.12_3979d24b.jpg" alt="Trusted Partner Logo" className="h-5 w-auto sm:h-6" />
                    <span>Trusted by Partners</span>
                  </div>
                </div>
                <p className="text-xxs text-gray-500 mt-3">
                  Quizitt is a registered non-profit organization dedicated to transparent and impactful use of your donations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;