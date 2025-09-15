import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Smartphone } from "lucide-react";
import heritageBankBuilding from "@/assets/heritage-bank-building.jpg";
import peopleInBank from "@/assets/people-in-bank.jpg";
import mobileBankingUsers from "@/assets/mobile-banking-users.jpg";

export const HeritageShowcase = () => {
  const showcaseItems = [
    {
      image: heritageBankBuilding,
      title: "Our Heritage Legacy",
      description: "Heritage Bank stands as a symbol of trust and excellence, serving communities with premium banking services for generations.",
      icon: Building,
      delay: "0ms"
    },
    {
      image: peopleInBank,
      title: "Personal Service Excellence",
      description: "Experience personalized banking with our dedicated staff, ensuring every transaction is handled with care and professionalism.",
      icon: Users,
      delay: "200ms"
    },
    {
      image: mobileBankingUsers,
      title: "Digital Banking Innovation",
      description: "Access your Heritage Bank account anywhere, anytime with our cutting-edge mobile app designed for modern banking needs.",
      icon: Smartphone,
      delay: "400ms"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Experience <span className="gold-text">Heritage Banking</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover why millions trust Heritage Bank for their financial journey. 
            From our impressive branches to innovative digital solutions.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <Card 
              key={item.title}
              className="banking-card overflow-hidden hover-lift group"
              style={{ animationDelay: item.delay }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="glass-effect p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Ready to Join the Heritage Family?
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your premium banking experience today with Heritage Bank's comprehensive financial solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth?mode=signup" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Open Account Today
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};