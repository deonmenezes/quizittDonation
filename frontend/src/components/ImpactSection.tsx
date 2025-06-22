
import { useState, useEffect } from 'react';
import { BookOpen, Users, Zap, Heart } from 'lucide-react';

const ImpactSection = () => {
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

    const element = document.getElementById('impact-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const impacts = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Gamified education that adapts to each student's pace through personalized quizzes and maximum engagement",
      stat: "95%",
      statLabel: "Engagement Rate",
      color: "purple"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect students globally through collaborative learning and shared knowledge sharing",
      stat: "50+",
      statLabel: "Countries Reached",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Real-time assessment and personalized recommendations help students learn more effectively",
      stat: "3x",
      statLabel: "Faster Learning",
      color: "green"
    },
    {
      icon: Heart,
      title: "Accessible Education",
      description: "Breaking down barriers to quality education, making learning resources available to all children",
      stat: "Free",
      statLabel: "For All Students",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "from-purple-500 to-purple-600 bg-purple-100",
      blue: "from-blue-500 to-blue-600 bg-blue-100", 
      green: "from-green-500 to-green-600 bg-green-100",
      orange: "from-orange-500 to-orange-600 bg-orange-100"
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="impact" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div id="impact-section" className="container mx-auto max-w-6xl relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Your Support Creates Real Impact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every contribution powers our mission to revolutionize education through technology, creating lasting change in how children learn and grow around the world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div 
              key={index}
              className={`group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${getColorClasses(impact.color).split(' ')[0]} ${getColorClasses(impact.color).split(' ')[1]} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                <impact.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{impact.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{impact.description}</p>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {impact.stat}
                </div>
                <div className="text-sm text-gray-500 font-medium">{impact.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white text-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold mb-6">₹600 = Revolutionary Learning Experience</h3>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Your donation of just ₹600 provides a child with access to cutting-edge educational technology, 
            personalized learning paths, interactive assessments, and a supportive learning community for an 
            entire year. That's transformative education for less than ₹2 per day.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold mb-2">365</div>
              <div className="text-lg opacity-80">Days of Learning</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-80">Platform Access</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-lg opacity-80">Learning Opportunities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
