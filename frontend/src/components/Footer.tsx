
import { BookOpen, Users, TrendingUp, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Quizitt.com</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Revolutionizing education through interactive technology, making quality learning accessible to every child worldwide.
            </p>
            {/* <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">f</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">t</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">i</div>
              </a>
            </div> */}
          </div>
{/*           
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Platform</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-300 hover:underline">Interactive Quizzes</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 hover:underline">Progress Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 hover:underline">Teacher Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 hover:underline">Student Analytics</a></li>
            </ul>
          </div> */}
          
          {/* <div className="space-y-4">
            <h3 className="text-xl font-semibold">Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#campaign" className="hover:text-white transition-colors duration-300 hover:underline">Campaign</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors duration-300 hover:underline">Our Impact</a></li>
              <li><a href="#rewards" className="hover:text-white transition-colors duration-300 hover:underline">Rewards</a></li>
              <li><a href="#leaderboard" className="hover:text-white transition-colors duration-300 hover:underline">Supporters</a></li>
            </ul>
          </div> */}
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact</h3>
            <div className="text-gray-300 space-y-3">
              <p className="flex items-center gap-2">
                <span>📧</span> quizittindia@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> +91 81047 96542
              </p>
              <p className="flex items-center gap-2">
                <span>📍</span> Vidya Vihar, India
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
            <div className="flex items-center space-x-2 text-purple-400">
              <TrendingUp className="w-5 h-5" />
              <span>1000+ Students Empowered</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <Users className="w-5 h-5" />
              <span>243 Active Supporters</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Heart className="w-5 h-5" />
              <span>₹145,000 Raised</span>
            </div>
          </div>
          <div className="text-center">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
