
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
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

    const element = document.getElementById('testimonials-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Primary School Teacher",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
      content: "Quizitt.com has transformed how my students engage with learning. The interactive quizzes make even the most challenging topics fun and accessible.",
      rating: 5,
      donation: "₹3,000"
    },
    {
      name: "Rajesh Patel",
      role: "Parent & Supporter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "I donated because I believe in the vision. My daughter's grades improved significantly after using Quizitt. It's worth every rupee!",
      rating: 5,
      donation: "₹1,200"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Education Researcher",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "The adaptive learning technology in Quizitt is groundbreaking. It addresses individual learning needs in ways traditional methods cannot.",
      rating: 5,
      donation: "₹5,000"
    }
  ];

  return (
    <section id="testimonials-section" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">What Our Supporters Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from educators, parents, and supporters who have experienced the impact of Quizitt.com firsthand
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover: shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-200" />
                  <p className="text-gray-700 leading-relaxed pl-6 italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Donated</div>
                    <div className="font-bold text-purple-600">{testimonial.donation}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
