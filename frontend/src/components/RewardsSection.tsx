
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RewardsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('rewards-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const rewards = [
    {
      amount: 600,
      title: "Quizitt Premium Cap",
      description: "Show your support with our exclusive branded cap featuring the Quizitt logo and inspirational education quotes.",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop",
      popular: true,
      features: ["Premium cotton blend", "Adjustable strap", "Embroidered Quizitt logo", "Limited edition design"]
    },
    {
      amount: 3000,
      title: "Quizitt Champion T-Shirt",
      description: "Premium quality t-shirt celebrating your contribution to educational innovation, made with sustainable materials.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      popular: false,
      features: ["Organic cotton", "Unisex design", "Screen-printed Quizitt graphics", "Available in multiple sizes"]
    }
  ];

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <section id="rewards" className="py-20 px-4 bg-gradient-to-br from-white to-purple-50 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div id="rewards-section" className="container mx-auto max-w-6xl relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Appreciation Rewards</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Show your support and receive these exclusive tokens of appreciation for your contribution to educational innovation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {rewards.map((reward, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-105 border-0 bg-white/90 backdrop-blur-sm ${
                reward.popular ? 'ring-2 ring-purple-400 shadow-purple-100' : ''
              } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              {reward.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 z-20">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              )}
              
              <CardHeader className="pb-0">
                <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={reward.image} 
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Gift className="w-6 h-6 text-purple-600" />
                  {reward.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed">{reward.description}</p>
                
                <div className="space-y-3">
                  {/* <h4 className="font-semibold text-gray-800">What's Included:</h4>
                  <ul className="space-y-2">
                    {reward.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul> */}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ₹{reward.amount.toLocaleString()}
                  </div>
                  <Button 
                    onClick={handleDonateClick}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Donate & Claim
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🎯 Reward Progress Tracker</h3>
            <p className="text-gray-600">
              Track your progress towards earning rewards and see how your contribution directly impacts children's education!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
