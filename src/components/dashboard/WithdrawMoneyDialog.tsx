import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building, Globe, Shield, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PinVerification } from "./PinVerification";

interface WithdrawMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userBalance: number;
  userId: string;
  onTransactionComplete?: () => void;
}

type TransferType = 'local' | 'international' | null;

export function WithdrawMoneyDialog({ open, onOpenChange, userBalance, userId, onTransactionComplete }: WithdrawMoneyDialogProps) {
  const [step, setStep] = useState<'select' | 'form' | 'pin'>('select');
  const [transferType, setTransferType] = useState<TransferType>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [userStatus, setUserStatus] = useState<string>('active');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      checkUserStatus();
    }
  }, [open, userId]);

  const checkUserStatus = async () => {
    setCheckingStatus(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserStatus(data?.status || 'active');
    } catch (error) {
      console.error('Error checking user status:', error);
      setUserStatus('active'); // Default to active on error
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setTransferType(null);
    setFormData({});
  };

  const handleTransferTypeSelect = (type: TransferType) => {
    setTransferType(type);
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    
    form.forEach((value, key) => {
      data[key] = value;
    });

    const amount = parseFloat(data.amount);
    if (amount > userBalance) {
      toast({
        title: "Insufficient Funds",
        description: "The withdrawal amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    setFormData({ ...data, amount, transferType });
    setStep('pin');
  };

  const handlePinVerified = async () => {
    setLoading(true);
    
    try {
      // Update user balance immediately
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_id_param: userId,
        amount_param: formData.amount,
        operation: 'subtract'
      });

      if (balanceError) throw balanceError;

      // Create completed transaction record
      const referenceNumber = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: userId, // Using userId as placeholder since we're using profiles table
          transaction_type: 'debit',
          amount: formData.amount,
          description: `${transferType === 'local' ? 'Local' : 'International'} transfer to ${formData.recipientName}`,
          reference_number: referenceNumber,
          recipient_account: formData.accountNumber || formData.iban,
          recipient_name: formData.recipientName,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Transfer Completed Successfully!",
        description: `Your ${transferType} transfer of $${formData.amount.toFixed(2)} has been completed instantly.`,
      });

      // Call onTransactionComplete callback if provided
      if (onTransactionComplete) {
        onTransactionComplete();
      }

      onOpenChange(false);
      handleReset();
    } catch (error: any) {
      toast({
        title: "Transfer Error",
        description: error.message || "Failed to complete transfer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSelectType = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Choose Transfer Type</h3>
        <p className="text-muted-foreground">Select how you want to send money</p>
      </div>

      <div className="grid gap-4">
        <Card 
          className="banking-card cursor-pointer hover-lift"
          onClick={() => handleTransferTypeSelect('local')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Local Transfer</h4>
                <p className="text-sm text-muted-foreground">
                  Transfer to banks within your country
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="banking-card cursor-pointer hover-lift"
          onClick={() => handleTransferTypeSelect('international')}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">International Transfer</h4>
                <p className="text-sm text-muted-foreground">
                  Send money worldwide via SWIFT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLocalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="text-lg font-semibold">Local Transfer</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="recipientName">Recipient Full Name</Label>
          <Input
            id="recipientName"
            name="recipientName"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="bankName">Recipient Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            placeholder="First National Bank"
            required
          />
        </div>

        <div>
          <Label htmlFor="accountNumber">Recipient Account Number</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            placeholder="1234567890"
            required
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount to Transfer ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={userBalance}
            placeholder="0.00"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Available: ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description / Narration</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Payment for services..."
            required
          />
        </div>

        <Button type="submit" className="w-full" variant="banking">
          Continue to PIN Verification
        </Button>
      </div>
    </form>
  );

  const renderInternationalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="text-lg font-semibold">International Transfer</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="recipientName">Recipient Full Name</Label>
          <Input
            id="recipientName"
            name="recipientName"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="bankName">Recipient Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            placeholder="Deutsche Bank AG"
            required
          />
        </div>

        <div>
          <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
          <Input
            id="swiftCode"
            name="swiftCode"
            placeholder="DEUTDEFF"
            required
          />
        </div>

        <div>
          <Label htmlFor="iban">IBAN or Account Number</Label>
          <Input
            id="iban"
            name="iban"
            placeholder="DE89370400440532013000"
            required
          />
        </div>

        <div>
          <Label htmlFor="country">Recipient Country</Label>
          <Select name="country" required>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount to Transfer ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={userBalance}
            placeholder="0.00"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Available: ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <Label htmlFor="purpose">Transfer Purpose / Narration</Label>
          <Select name="purpose" required>
            <SelectTrigger>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family_support">Family Support</SelectItem>
              <SelectItem value="business_payment">Business Payment</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="gift">Gift</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" variant="banking">
          Continue to PIN Verification
        </Button>
      </div>
    </form>
  );

  const renderPinVerification = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep('form')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Shield className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold">Verify Your PIN</h3>
      </div>

      <div className="bg-accent/10 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-2">Transfer Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="capitalize">{transferType} Transfer</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">${formData.amount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Recipient:</span>
            <span>{formData.recipientName}</span>
          </div>
        </div>
      </div>

      <PinVerification 
        userId={userId}
        onVerified={handlePinVerified}
        onCancel={() => setStep('form')}
        loading={loading}
      />
    </div>
  );

  const renderBlockedUser = () => (
    <div className="space-y-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-destructive/10 rounded-full">
          <Ban className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-destructive mb-2">Account Restricted</h3>
          <p className="text-muted-foreground text-sm">
            Your account has been temporarily restricted from making transfers. 
            Please contact customer support for assistance.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
        </DialogHeader>

        {checkingStatus && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Checking account status...</p>
          </div>
        )}

        {!checkingStatus && userStatus === 'blocked' && renderBlockedUser()}
        
        {!checkingStatus && userStatus === 'active' && (
          <>
            {step === 'select' && renderSelectType()}
            {step === 'form' && transferType === 'local' && renderLocalForm()}
            {step === 'form' && transferType === 'international' && renderInternationalForm()}
            {step === 'pin' && renderPinVerification()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}