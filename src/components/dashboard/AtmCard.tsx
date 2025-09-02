import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wifi } from "lucide-react";

interface AtmCardProps {
  holderName: string;
  userId: string;
}

export function AtmCard({ holderName, userId }: AtmCardProps) {
  // Generate a unique card number based on user ID
  const generateCardNumber = (id: string) => {
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const num = Math.abs(hash).toString().padStart(12, '0').slice(0, 12);
    return `4532 ${num.slice(0, 4)} ${num.slice(4, 8)} ${num.slice(8, 12)}`;
  };

  const cardNumber = generateCardNumber(userId);
  const expiryMonth = ((parseInt(userId.slice(-2), 16) % 12) + 1).toString().padStart(2, '0');
  const expiryYear = (new Date().getFullYear() + 5).toString().slice(-2);

  return (
    <Card className="relative overflow-hidden border-0 shadow-premium">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary-light"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
      
      <CardContent className="relative p-6 text-white">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm">H</span>
            </div>
            <span className="text-sm font-medium opacity-90">Heritage Bank</span>
          </div>
          <Wifi className="h-5 w-5 opacity-70" />
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <p className="text-lg font-mono tracking-widest opacity-90">
            {cardNumber}
          </p>
        </div>

        {/* Card Details */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-70 mb-1">CARD HOLDER</p>
            <p className="font-medium text-sm uppercase">
              {holderName || 'Heritage Customer'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70 mb-1">EXPIRES</p>
            <p className="font-mono text-sm">{expiryMonth}/{expiryYear}</p>
          </div>
        </div>

        {/* Mastercard Logo Placeholder */}
        <div className="absolute bottom-6 right-6 flex items-center space-x-1">
          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="w-6 h-6 bg-accent/60 rounded-full -ml-3"></div>
        </div>

        {/* Chip */}
        <div className="absolute top-20 left-6 w-10 h-8 bg-gradient-gold rounded-md opacity-80"></div>
      </CardContent>
    </Card>
  );
}