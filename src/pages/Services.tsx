import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HeadphonesIcon, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  CreditCard, 
  DollarSign,
  Clock,
  Globe,
  Lock,
  ArrowRight
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: HeadphonesIcon,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance from our dedicated support team. Get help whenever you need it, day or night.",
      features: ["Live chat support", "Phone assistance", "Email support", "Video consultations"]
    },
    {
      icon: Shield,
      title: "Fast & Secure Transactions",
      description: "Lightning-fast transfers with bank-grade security. Your money moves safely and quickly worldwide.",
      features: ["Instant transfers", "Encrypted transactions", "Real-time notifications", "Fraud protection"]
    },
    {
      icon: Smartphone,
      title: "Online Banking Access",
      description: "Access your accounts anywhere, anytime with our award-winning mobile and web platforms.",
      features: ["Mobile banking app", "Web portal", "Biometric login", "Offline capability"]
    },
    {
      icon: TrendingUp,
      title: "Savings & Investment Opportunities",
      description: "Grow your wealth with our diverse range of savings accounts and investment products.",
      features: ["High-yield savings", "Investment portfolios", "Retirement planning", "Financial advice"]
    },
    {
      icon: CreditCard,
      title: "Loan & Credit Facilities",
      description: "Flexible financing solutions for all your needs, from personal loans to business credit.",
      features: ["Personal loans", "Business credit", "Mortgages", "Credit cards"]
    },
    {
      icon: DollarSign,
      title: "No Hidden Charges",
      description: "Transparent pricing with no surprises. What you see is what you pay, with competitive rates.",
      features: ["Transparent fees", "Competitive rates", "No surprise charges", "Fee calculator"]
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Instant Account Opening",
      description: "Open your account in minutes with our streamlined digital process."
    },
    {
      icon: Globe,
      title: "International Banking",
      description: "Global reach with local expertise in over 50 countries worldwide."
    },
    {
      icon: Lock,
      title: "Advanced Security",
      description: "Multi-layer security with biometric authentication and real-time monitoring."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Banking Services
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive banking solutions designed to meet all your financial needs. 
              From everyday banking to complex investment strategies.
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="secondary" size="lg" className="group">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Our Core Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need for modern banking, delivered with excellence and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card 
                key={service.title}
                className="banking-card p-8 hover-lift h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full group mt-auto">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Why Choose Heritage Bank?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={feature.title}
                className="banking-card p-8 text-center hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Premium Banking?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join millions of satisfied customers who trust Heritage Bank for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="secondary" size="lg" className="group">
                  Open Account Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-hero" size="lg">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;