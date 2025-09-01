import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  FileText,
  Users
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import loanAssistanceImg from "@/assets/loan-assistance.jpg";

const Loans = () => {
  const loanFeatures = [
    {
      icon: DollarSign,
      title: "Flexible Loan Packages",
      description: "Customized loan solutions ranging from $1,000 to $500,000 with competitive interest rates tailored to your financial situation."
    },
    {
      icon: Shield,
      title: "No Collateral Required",
      description: "Get approved without putting your assets at risk. Our unsecured loans are based on your creditworthiness and income verification."
    },
    {
      icon: Clock,
      title: "Unlimited Repayment Time",
      description: "Choose your repayment schedule from 12 months to 30 years. Enjoy the flexibility to pay at your own pace without penalties."
    },
    {
      icon: CheckCircle,
      title: "No Client Harassment",
      description: "We respect your privacy and dignity. Our professional collection practices ensure stress-free loan management throughout your term."
    },
    {
      icon: Users,
      title: "Bad Credit Welcome",
      description: "Even with poor credit history, you can still qualify. We focus on your current ability to repay rather than past mistakes."
    },
    {
      icon: FileText,
      title: "Quick Approval Process",
      description: "Get pre-approved in minutes and receive funds within 24 hours. Minimal paperwork and streamlined digital application process."
    }
  ];

  const loanTypes = [
    {
      name: "Personal Loans",
      rate: "From 5.99% APR",
      amount: "$1,000 - $50,000",
      term: "12 - 84 months"
    },
    {
      name: "Home Mortgages", 
      rate: "From 3.25% APR",
      amount: "$50,000 - $2M",
      term: "15 - 30 years"
    },
    {
      name: "Business Loans",
      rate: "From 4.99% APR", 
      amount: "$5,000 - $500K",
      term: "6 months - 10 years"
    },
    {
      name: "Auto Financing",
      rate: "From 2.99% APR",
      amount: "$5,000 - $100K", 
      term: "24 - 84 months"
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
                Loans & Credit Solutions
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Flexible financing options designed to help you achieve your dreams. 
                From personal loans to mortgages, we have solutions for every need.
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="xl" className="group">
                  Contact Us Now to Get a Loan
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="animate-scale-in">
              <img 
                src={loanAssistanceImg} 
                alt="Happy customers receiving loan assistance"
                className="rounded-xl shadow-premium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Loan Features */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Why Choose Our Loans?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe everyone deserves access to fair and flexible financing. 
              Our loan products are designed with your financial well-being in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loanFeatures.map((feature, index) => (
              <Card 
                key={feature.title}
                className="banking-card p-8 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Loan Products & Rates
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Competitive rates and flexible terms across all our loan products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loanTypes.map((loan, index) => (
              <Card 
                key={loan.name}
                className="banking-card p-6 text-center hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-primary mb-4">{loan.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-semibold text-accent">{loan.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span className="font-semibold">{loan.term}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="banking-card p-8 max-w-2xl mx-auto">
              <Calculator className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                Loan Calculator
              </h3>
              <p className="text-muted-foreground mb-6">
                Calculate your monthly payments and find the perfect loan amount for your budget.
              </p>
              <Button variant="banking" size="lg" className="group">
                Calculate Payments
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Loan Approved?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our loan specialists are standing by to help you find the perfect financing solution. 
              Get pre-approved in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="xl" className="group">
                  Contact Us Now to Get a Loan
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="outline-hero" size="lg">
                  Apply Online
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

export default Loans;