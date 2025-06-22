
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is my donation used?",
      answer: "Your donation directly funds the development and maintenance of Quizitt.com's educational platform, provides free access to students, and supports our team of educators and developers. Every ₹600 gives a child one full year of access to our interactive learning system."
    },
    {
      question: "When will I receive my reward?",
      answer: "Rewards are processed within 2-3 weeks after your donation is confirmed. You'll receive an email with tracking information once your item ships. All rewards are handmade with care and feature exclusive Quizitt.com branding."
    },
    {
      question: "Is Quizitt.com suitable for all age groups?",
      answer: "Yes! Our platform adapts to different learning levels and age groups. We currently serve students from ages 8-18 with content spanning elementary through high school curricula, with plans to expand to younger and older learners."
    },
    {
      question: "How do I track the impact of my donation?",
      answer: "You'll receive quarterly impact reports showing how your contribution has helped students. We also provide access to our donor dashboard where you can see real-time statistics about platform usage and student progress."
    },
    {
      question: "Can I make recurring donations?",
      answer: "Absolutely! You can set up monthly or quarterly recurring donations through our secure payment system. Recurring donors receive special recognition and exclusive updates about our progress."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use Razorpay, India's most trusted payment gateway, which employs bank-level security and encryption. We never store your payment information on our servers, and all transactions are fully secured and compliant with international standards."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about donations, rewards, and our platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader 
                className="cursor-pointer hover:bg-purple-50 transition-colors duration-200 rounded-t-lg"
                onClick={() => toggleFAQ(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                  {faq.question}
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </CardTitle>
              </CardHeader>
              {openIndex === index && (
                <CardContent className="pt-0 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          {/* <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              We're here to help! Contact our support team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@quizitt.com" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Email Support
              </a>
              <a 
                href="#" 
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
              >
                Live Chat
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
