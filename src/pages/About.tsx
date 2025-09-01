import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Award, Users, Globe, Smartphone, Clock } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import heritageBuildingImg from "@/assets/heritage-building.jpg";
import professionalBankersImg from "@/assets/professional-bankers.jpg";

const About = () => {
  const achievements = [
    {
      icon: Shield,
      title: "100% Secure Transactions",
      description: "Bank-grade security with advanced encryption protecting every transaction and personal data."
    },
    {
      icon: Award,
      title: "Decades of Excellence",
      description: "Over 50 years of heritage and excellence in providing trusted financial services globally."
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      description: "Committed to delivering exceptional customer service with 24/7 support and personalized solutions."
    },
    {
      icon: Globe,
      title: "Global Banking Platform",
      description: "Trusted by millions worldwide with presence in over 50 countries and growing international network."
    },
    {
      icon: Smartphone,
      title: "Digital Innovation",
      description: "Leading innovation in digital banking with cutting-edge mobile apps and online banking solutions."
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Round-the-clock banking services ensuring you can access your accounts anytime, anywhere."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About Heritage Bank
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Your trusted partner in financial excellence for over five decades. 
                We combine traditional banking values with modern innovation to serve 
                customers across the globe.
              </p>
              <Button variant="secondary" size="lg" className="group">
                Discover Our Heritage
              </Button>
            </div>
            <div className="animate-scale-in">
              <img 
                src={heritageBuildingImg} 
                alt="Heritage Bank headquarters building"
                className="rounded-xl shadow-premium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              What Makes Us Special
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We pride ourselves on delivering exceptional banking experiences 
              through innovation, security, and unwavering commitment to our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card 
                key={achievement.title}
                className="banking-card p-8 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-scale-in">
              <img 
                src={professionalBankersImg} 
                alt="Professional Heritage Bank team"
                className="rounded-xl shadow-elegant w-full"
              />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Our Heritage Story
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Founded in 1970, Heritage Bank has grown from a small community 
                  financial institution to a globally recognized banking platform 
                  serving millions of customers worldwide.
                </p>
                <p>
                  Our commitment to excellence, innovation, and customer satisfaction 
                  has remained constant throughout our journey. We continuously invest 
                  in cutting-edge technology while maintaining the personal touch that 
                  has defined our service for decades.
                </p>
                <p>
                  Today, Heritage Bank stands as a symbol of trust and reliability 
                  in the financial industry, offering comprehensive banking solutions 
                  that help individuals and businesses achieve their financial goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;