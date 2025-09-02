import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PinSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onPinSet: () => void;
}

export function PinSetupDialog({ open, onOpenChange, userId, onPinSet }: PinSetupDialogProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PIN Mismatch",
        description: "PINs do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must contain only numbers.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Hash the PIN (in a real app, this should be done server-side)
      const hashedPin = btoa(pin); // Simple encoding for demo
      
      const { error } = await supabase
        .from('profiles')
        .update({ pin_hash: hashedPin })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "PIN Set Successfully",
        description: "Your security PIN has been set. You can now perform secure transactions.",
      });

      onPinSet();
      onOpenChange(false);
      setPin('');
      setConfirmPin('');
    } catch (error: any) {
      toast({
        title: "PIN Setup Error",
        description: error.message || "Failed to set PIN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (value: string, field: 'pin' | 'confirmPin') => {
    // Only allow digits and limit to 4 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    
    if (field === 'pin') {
      setPin(numericValue);
    } else {
      setConfirmPin(numericValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-accent" />
            <span>Set Up Security PIN</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Security First</h4>
                <p className="text-sm text-muted-foreground">
                  Your 4-digit PIN will be required for all money transfers and sensitive operations. 
                  Choose a PIN that's memorable but secure.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pin">Create 4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value, 'pin')}
                placeholder="••••"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, 'confirmPin')}
                placeholder="••••"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground text-center">
                Never share your PIN with anyone. Heritage Bank will never ask for your PIN via email or phone.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              variant="banking"
              disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
            >
              {loading ? "Setting PIN..." : "Set Security PIN"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}