
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <section id="campaign" className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-semibold shadow-lg animate-pulse">
              🎓 Educational Technology Campaign
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Revolutionizing Learning with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"> Quizitt.com</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Join us in building the future of education through interactive quizzes and personalized learning. 
              Help us make quality education accessible to every child, powered by innovative technology that 
              adapts to each student's unique learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={handleDonateClick}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-4 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Explore Platform
              </Button>
            </div>
          </div>
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=600&fit=crop&crop=face"
                alt="Student learning with Quizitt"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-600 font-medium">Students Empowered</div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 shadow-xl transform hover:rotate-12 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">A+</div>
                <div className="text-xs text-white font-medium">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
