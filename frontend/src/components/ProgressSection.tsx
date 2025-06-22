
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface ProgressSectionProps {
  totalRaised: number;
  goal: number;
  donorCount: number;
}

const ProgressSection = ({ totalRaised, goal, donorCount }: ProgressSectionProps) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const percentage = (totalRaised / goal) * 100;
  const childrenHelped = Math.floor(totalRaised / 600);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const duration = 2000;
          const steps = 60;
          const increment = totalRaised / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= totalRaised) {
              current = totalRaised;
              clearInterval(timer);
            }
            setAnimatedAmount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('progress-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [totalRaised]);

  return (
    <section id="progress-section" className="py-16 px-4 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl">
        <div className={`bg-white rounded-3xl shadow-2xl p-10 border border-purple-100 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Campaign Progress</h2>
            <p className="text-xl text-gray-600">Every contribution powers the future of education</p>
          </div>
          
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
              <div className="text-lg text-gray-600">already accessing enhanced education through Quizitt.com!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;
