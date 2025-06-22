import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the CTA only if the scroll position is more than 500px and not dismissed
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > 500 && !isDismissed;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDonateClick = () => {
    navigate('/donate');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Support Quizitt.com - Revolutionary Educational Platform',
        text: 'Help us make quality education accessible to every child through interactive learning technology!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!isVisible) return null; // Hide the CTA if not visible

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 p-4 max-w-sm mx-auto">
        <button
          onClick={() => setIsDismissed(true)} // Close the popup when the cross is clicked
          className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="text-center mb-4">
          <div className="text-sm font-semibold text-gray-800 mb-1">Make a Difference Today!</div>
          <div className="text-xs text-gray-600">Just ₹600 = 1 year of education</div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleDonateClick}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate Now
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="px-4 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
