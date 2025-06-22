import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling mobile menu

  const handleDonateClick = () => {
    navigate('/donate');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Function to toggle mobile menu

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-white" />
            </Link>
            <Link to="/">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300">
                  Quizitt.com
                </h1>
                <p className="text-sm text-gray-600">Interactive Learning Platform</p>
              </div>
            </Link>
          </div>

          {/* Hamburger Icon for small screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('campaign')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Campaign
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Impact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('rewards')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Rewards
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('leaderboard')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Supporters
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <Button
              onClick={handleDonateClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Donate Now
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-blue-100 p-4">
          <nav className="flex flex-col items-start space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('campaign')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Campaign
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Impact
            </button>
            <button 
              onClick={() => scrollToSection('rewards')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Rewards
            </button>
            <button 
              onClick={() => scrollToSection('leaderboard')}
              className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group"
            >
              Supporters
            </button>
            <Button
              onClick={handleDonateClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Donate Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
