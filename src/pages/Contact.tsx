import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  HeadphonesIcon,
  ArrowRight
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate form submission
    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our banking specialists",
      details: ["+1 (800) 123-BANK", "Available 24/7"],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support", 
      description: "Send us a message and we'll respond quickly",
      details: ["support@heritagebank.com", "Response within 2 hours"],
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our chat agents", 
      details: ["Available 24/7", "Average response: 30 seconds"],
      action: "Start Chat"
    },
    {
      icon: MapPin,
      title: "Branch Locations",
      description: "Visit us at one of our 500+ locations",
      details: ["Find nearest branch", "Schedule appointment"],
      action: "Find Branch"
    }
  ];

  const supportTopics = [
    "Account Opening & Setup",
    "Online Banking Issues", 
    "Loan Applications",
    "Investment Consulting",
    "Card Services",
    "International Transfers",
    "Mobile App Support",
    "Security & Fraud Report"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <HeadphonesIcon className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact & Support
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're here to help 24/7. Get in touch with our expert support team 
              for personalized assistance with all your banking needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              How Can We Help You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose your preferred way to connect with our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card 
                key={method.title}
                className="banking-card p-6 text-center hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <div className="space-y-1 mb-4">
                  {method.details.map((detail) => (
                    <div key={detail} className="text-sm font-semibold text-accent">
                      {detail}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  {method.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Topics */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="animate-fade-in">
              <Card className="banking-card p-8">
                <div className="flex items-center mb-6">
                  <Send className="h-6 w-6 text-accent mr-3" />
                  <h2 className="text-2xl font-bold text-primary">Send Us a Message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg" variant="banking">
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Card>
            </div>

            {/* Support Topics & Business Hours */}
            <div className="space-y-8 animate-fade-in">
              
              {/* Support Topics */}
              <Card className="banking-card p-8">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                  <MessageCircle className="h-6 w-6 text-accent mr-3" />
                  Popular Support Topics
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {supportTopics.map((topic) => (
                    <div 
                      key={topic}
                      className="flex items-center p-3 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors group"
                    >
                      <ArrowRight className="h-4 w-4 text-accent mr-3 group-hover:translate-x-1 transition-transform" />
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Business Hours */}
              <Card className="banking-card p-8">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                  <Clock className="h-6 w-6 text-accent mr-3" />
                  Support Hours
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone Support</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Live Chat</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email Support</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Branch Hours</span>
                    <span className="font-semibold text-primary">Mon-Fri 9AM-6PM</span>
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="banking-card p-8 bg-gradient-primary text-white">
                <h3 className="text-xl font-bold mb-4">Emergency Banking Support</h3>
                <p className="text-white/90 mb-4">
                  For urgent banking issues like lost cards, suspicious activity, or account lockouts:
                </p>
                <Button variant="secondary" size="lg" className="w-full group">
                  Emergency Hotline: 1-800-URGENT-1
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;