// src/components/pages/LandingPage.jsx
import { useEffect, useState } from 'react';
import { Header } from '../layout/Header';

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-700 transform hover:scale-105 opacity-0 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 
            className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Practice Management
            <span className="text-blue-600"> Simplified</span>
          </h1>
          
          <p 
            className={`text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Streamline your practice communication and campaign management with our comprehensive solution.
          </p>
          
          <div 
            className={`transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button 
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<span className="text-3xl">📨</span>}
              title="Campaign Management"
              description="Create and manage communication campaigns effortlessly with our intuitive interface."
              delay={300}
            />
            
            <FeatureCard
              icon={<span className="text-3xl">👥</span>}
              title="Practice Management"
              description="Organize and oversee multiple practices from a single dashboard."
              delay={500}
            />
            
            <FeatureCard
              icon={<span className="text-3xl">📊</span>}
              title="Analytics"
              description="Track campaign performance and engagement with detailed analytics."
              delay={700}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up and set up your practice profile in minutes."
              },
              {
                step: "2",
                title: "Add Users",
                description: "Invite team members and assign appropriate roles."
              },
              {
                step: "3",
                title: "Launch Campaigns",
                description: "Start sending targeted communications to your users."
              }
            ].map((item, index) => (
              <div 
                key={item.step}
                className={`text-center transition-all duration-1000 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Practice Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};