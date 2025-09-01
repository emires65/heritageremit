import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Shield, 
  Target, 
  ArrowRight,
  DollarSign,
  Calendar,
  Trophy
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import investmentChartsImg from "@/assets/investment-charts.jpg";

const Investments = () => {
  const investmentOptions = [
    {
      icon: TrendingUp,
      title: "Stock Market Insights",
      description: "Access real-time market data, expert analysis, and personalized stock recommendations to make informed investment decisions.",
      features: ["Real-time market data", "Expert analysis", "Stock screeners", "Portfolio tracking"]
    },
    {
      icon: PieChart,
      title: "Diversified Portfolios",
      description: "Invest in professionally managed portfolios with stocks, bonds, and mutual funds tailored to your risk tolerance.",
      features: ["Balanced portfolios", "Risk assessment", "Auto-rebalancing", "Performance tracking"]
    },
    {
      icon: Shield,
      title: "Secure Investment Options",
      description: "Choose from government bonds, corporate bonds, and FDIC-insured investment products for guaranteed returns.",
      features: ["Government bonds", "Corporate bonds", "FDIC protection", "Guaranteed returns"]
    },
    {
      icon: Target,
      title: "Financial Freedom Planning",
      description: "Create personalized investment strategies designed to help you achieve long-term financial independence.",
      features: ["Goal setting", "Retirement planning", "Tax optimization", "Wealth building"]
    }
  ];

  const investmentTypes = [
    {
      name: "Conservative Portfolio",
      risk: "Low Risk",
      return: "4-6% Annual Return",
      description: "Bonds and stable investments",
      icon: Shield
    },
    {
      name: "Balanced Portfolio", 
      risk: "Medium Risk",
      return: "6-10% Annual Return",
      description: "Mix of stocks and bonds",
      icon: BarChart3
    },
    {
      name: "Growth Portfolio",
      risk: "High Risk",
      return: "10-15% Annual Return", 
      description: "Aggressive stock investments",
      icon: TrendingUp
    },
    {
      name: "Premium Portfolio",
      risk: "Very High Risk",
      return: "15%+ Annual Return",
      description: "High-growth opportunities",
      icon: Trophy
    }
  ];

  const timeHorizons = [
    {
      period: "Short-term (1-3 years)",
      strategy: "Liquid investments with capital preservation",
      options: ["Money market funds", "Short-term CDs", "Treasury bills"]
    },
    {
      period: "Medium-term (3-10 years)", 
      strategy: "Balanced growth with moderate risk",
      options: ["Balanced mutual funds", "Corporate bonds", "Dividend stocks"]
    },
    {
      period: "Long-term (10+ years)",
      strategy: "Maximum growth potential for wealth building", 
      options: ["Growth stocks", "Index funds", "Real estate investment"]
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
                Investment Opportunities
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Build wealth and secure your financial future with our comprehensive 
                investment solutions. From conservative bonds to aggressive growth portfolios.
              </p>
              <Link to="/auth?mode=signup">
                <Button variant="secondary" size="xl" className="group">
                  Start Investing Today
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="animate-scale-in">
              <img 
                src={investmentChartsImg} 
                alt="Investment charts and financial analysis"
                className="rounded-xl shadow-premium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Options */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Investment Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you're a beginner investor or an experienced trader, we have 
              investment products that match your goals and risk tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {investmentOptions.map((option, index) => (
              <Card 
                key={option.title}
                className="banking-card p-8 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {option.description}
                    </p>
                    <ul className="space-y-2">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Types */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Choose Your Investment Strategy
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select from our range of professionally managed portfolios designed 
              for different risk appetites and return expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {investmentTypes.map((type, index) => (
              <Card 
                key={type.name}
                className="banking-card p-6 text-center hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-accent">{type.risk}</div>
                  <div className="text-sm font-bold text-primary">{type.return}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time Horizons */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Investment Time Horizons
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your investment timeline determines your strategy. Choose the approach 
              that matches your financial goals and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeHorizons.map((horizon, index) => (
              <Card 
                key={horizon.period}
                className="banking-card p-8 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-6">
                  <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {horizon.period}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {horizon.strategy}
                  </p>
                </div>
                <ul className="space-y-2">
                  {horizon.options.map((option) => (
                    <li key={option} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                      {option}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-scale-in">
            <DollarSign className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Building Your Wealth Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Take the first step towards financial freedom with our expert investment guidance 
              and comprehensive portfolio management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="secondary" size="xl" className="group">
                  Open Investment Account
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-hero" size="lg">
                  Speak to an Advisor
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

export default Investments;