import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "News & Updates", href: "/news" },
    { name: "Investor Relations", href: "/investors" },
  ];

  const services = [
    { name: "Personal Banking", href: "/personal" },
    { name: "Business Banking", href: "/business" },
    { name: "Loans & Mortgages", href: "/loans" },
    { name: "Investment Services", href: "/investments" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/contact" },
    { name: "ATM Locations", href: "/locations" },
    { name: "Security Center", href: "/security" },
  ];

  const legal = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">H</span>
              </div>
              <span className="text-2xl font-bold text-white">Heritage Bank</span>
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              Trusted for over 135 years, Heritage Bank continues to set the standard 
              for premium banking services, combining traditional values with innovative 
              financial solutions.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex space-x-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-white/80">+1 (815) 600-8181</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-white/80">support@heritageremit.site</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-white/80">100 Broadway, Cincinnati, OH 45202, United States</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-white/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href}
                    className="text-white/80 hover:text-accent transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-white/80 hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className="border-t border-white/10 bg-primary-hover">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="text-white hover:text-accent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <a 
                href="https://wa.me/18004374824" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/80 hover:text-accent transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
              <a 
                href="https://t.me/heritagebank" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/80 hover:text-accent transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-white/80 text-sm">
              © {currentYear} Heritage Bank. All Rights Reserved. Member FDIC. Equal Housing Lender.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  className="text-white/60 hover:text-accent text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};