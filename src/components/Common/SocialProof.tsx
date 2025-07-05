import React from 'react';
import { Star, Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const SocialProof: React.FC = () => {
  const stats = [
    { icon: Users, value: '500,000+', label: 'Happy Readers', color: 'text-blue-600' },
    { icon: BookOpen, value: '2.5M+', label: 'Books Recommended', color: 'text-green-600' },
    { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-yellow-600' },
    { icon: Award, value: '97%', label: 'Match Success Rate', color: 'text-purple-600' }
  ];

  const testimonials = [
    {
      text: "Found my new favorite author in under a minute! The AI really understands my taste.",
      author: "Sarah M.",
      rating: 5,
      books: "12 books read"
    },
    {
      text: "Better than any human recommendation I've ever received. Absolutely brilliant.",
      author: "David K.",
      rating: 5,
      books: "28 books read"
    },
    {
      text: "I was skeptical at first, but every single recommendation has been perfect.",
      author: "Emma L.",
      rating: 5,
      books: "15 books read"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Readers Worldwide
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join the community that's revolutionizing book discovery
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.books}</div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Media Mentions */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">As featured in:</p>
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="font-bold text-lg">TechCrunch</div>
            <div className="font-bold text-lg">Wired</div>
            <div className="font-bold text-lg">The Verge</div>
            <div className="font-bold text-lg">BookRiot</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;