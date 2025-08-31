import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Home, 
  TrendingUp, 
  Smartphone, 
  Shield, 
  HeadphonesIcon,
  ArrowRight,
  Banknote,
  PiggyBank
} from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: CreditCard,
      title: "Personal Banking",
      description: "Checking, savings, and premium account options with competitive rates and no hidden fees.",
      features: ["Zero monthly fees", "Global ATM access", "Mobile check deposit", "24/7 customer support"]
    },
    {
      icon: Home,
      title: "Home Loans & Mortgages",
      description: "Competitive mortgage rates and personalized home financing solutions for your dream home.",
      features: ["Low interest rates", "Quick pre-approval", "First-time buyer programs", "Refinancing options"]
    },
    {
      icon: TrendingUp,
      title: "Investment Services",
      description: "Comprehensive wealth management and investment advisory services to grow your portfolio.",
      features: ["Portfolio management", "Retirement planning", "Risk assessment", "Market insights"]
    },
    {
      icon: Banknote,
      title: "Business Banking",
      description: "Tailored banking solutions for businesses of all sizes, from startups to enterprises.",
      features: ["Business accounts", "Commercial loans", "Payroll services", "Merchant solutions"]
    },
    {
      icon: PiggyBank,
      title: "Savings & CDs",
      description: "High-yield savings accounts and certificates of deposit to maximize your returns.",
      features: ["Competitive APY", "No minimum balance", "Flexible terms", "FDIC insured"]
    },
    {
      icon: Shield,
      title: "Security & Insurance",
      description: "Comprehensive insurance products and advanced security features to protect what matters.",
      features: ["Identity protection", "Fraud monitoring", "Insurance coverage", "Secure transactions"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Premium Banking Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From everyday banking to complex financial planning, we provide comprehensive 
            solutions tailored to your unique needs and goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="banking-card p-8 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Digital Banking Highlight */}
        <div className="bg-gradient-primary rounded-2xl p-12 text-center text-white animate-scale-in">
          <div className="max-w-4xl mx-auto">
            <Smartphone className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Digital Banking Excellence
            </h3>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Access your accounts anywhere, anytime with our award-winning mobile app. 
              Transfer funds, pay bills, deposit checks, and manage your investments 
              with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="group">
                <Smartphone className="h-5 w-5 mr-2" />
                Download Mobile App
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline-hero" size="lg" className="group">
                <HeadphonesIcon className="h-5 w-5 mr-2" />
                24/7 Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};