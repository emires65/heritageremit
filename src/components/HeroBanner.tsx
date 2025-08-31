import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Globe, Smartphone } from "lucide-react";
import bankingHero from "@/assets/banking-hero.jpg";

export const HeroBanner = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bankingHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="glass-effect p-4 rounded-xl">
          <Shield className="h-8 w-8 text-accent" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="glass-effect p-4 rounded-xl">
          <TrendingUp className="h-8 w-8 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="glass-effect p-4 rounded-xl">
          <Globe className="h-8 w-8 text-accent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Logo and Brand */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              Heritage
              <span className="gold-text"> Bank</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
              Banking Excellence Since 1885
            </p>
          </div>

          {/* Hero Text */}
          <div className="mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your Financial Future
              <br />
              <span className="gold-text">Starts Here</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience premium banking with cutting-edge technology, personalized service, 
              and the trust of generations. Your wealth, secured and growing.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in">
            <Button variant="hero" size="lg" className="group">
              Open an Account
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline-hero" size="lg" className="group">
              Login to Online Banking
              <Smartphone className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Key Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
            <div className="glass-effect p-6 rounded-xl hover-lift">
              <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-white/70 text-sm">Advanced encryption and fraud protection</p>
            </div>
            <div className="glass-effect p-6 rounded-xl hover-lift">
              <TrendingUp className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Investment Growth</h3>
              <p className="text-white/70 text-sm">Portfolio management and wealth building</p>
            </div>
            <div className="glass-effect p-6 rounded-xl hover-lift">
              <Globe className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Global Banking</h3>
              <p className="text-white/70 text-sm">International transfers and currency exchange</p>
            </div>
            <div className="glass-effect p-6 rounded-xl hover-lift">
              <Smartphone className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">24/7 Digital Access</h3>
              <p className="text-white/70 text-sm">Mobile banking and instant notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};