
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';

const QuizittSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('quizitt-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Quizzes",
      description: "Engaging quiz formats that adapt to each student's learning pace and style",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Students can learn together through group challenges and peer-to-peer support",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time analytics help teachers and parents monitor student development",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Gamified learning with badges and rewards to motivate continuous improvement",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="quizitt-section" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Quizitt.com?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge technology with proven educational methods to create 
            an engaging, personalized learning experience that helps every child reach their potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-10 text-white text-center transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold mb-6">₹600 = One Year of Enhanced Learning</h3>
          <p className="text-xl opacity-90 leading-relaxed max-w-4xl mx-auto">
            Your donation doesn't just fund education—it revolutionizes it. For just ₹600, you provide a child 
            with access to our complete interactive learning platform, personalized tutoring, and progress tracking 
            for an entire year. That's less than ₹2 per day to transform a child's educational journey forever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuizittSection;
