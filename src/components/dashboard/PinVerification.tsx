import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PinVerificationProps {
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function PinVerification({ userId, onVerified, onCancel, loading }: PinVerificationProps) {
  const [pin, setPin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN.",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);

    try {
      // Get user's stored PIN hash
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('pin_hash')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Verify PIN (in a real app, this should be done server-side with proper hashing)
      const hashedInput = btoa(pin);
      
      if (hashedInput === profile.pin_hash) {
        toast({
          title: "PIN Verified",
          description: "Processing your transaction...",
        });
        onVerified();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          toast({
            title: "Too Many Attempts",
            description: "PIN verification failed. Please try again later.",
            variant: "destructive",
          });
          onCancel();
        } else {
          toast({
            title: "Incorrect PIN",
            description: `Invalid PIN. ${3 - newAttempts} attempts remaining.`,
            variant: "destructive",
          });
        }
        setPin('');
      }
    } catch (error: any) {
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify PIN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow digits and limit to 4 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPin(numericValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleVerify();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Enter your 4-digit PIN to authorize this transaction
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="verifyPin" className="sr-only">Enter PIN</Label>
          <Input
            id="verifyPin"
            type="password"
            value={pin}
            onChange={(e) => handlePinChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="••••"
            maxLength={4}
            className="text-center text-3xl tracking-[1rem] py-6"
            autoFocus
          />
        </div>

        {attempts > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                Incorrect PIN. {3 - attempts} attempts remaining.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={verifying || loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={pin.length !== 4 || verifying || loading || attempts >= 3}
            variant="banking"
          >
            {verifying || loading ? "Verifying..." : "Verify PIN"}
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Forgot your PIN? Contact customer support at 1-800-HERITAGE
        </p>
      </div>
    </div>
  );
}