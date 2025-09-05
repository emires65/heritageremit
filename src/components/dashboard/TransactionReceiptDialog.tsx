import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Share2, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: string;
  created_at: string;
  description?: string;
  reference_number?: string;
  method?: string;
  recipient_name?: string;
  account_details?: any;
}

interface TransactionReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  userProfile: any;
}

export function TransactionReceiptDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  userProfile 
}: TransactionReceiptDialogProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('transaction-receipt');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`heritage-bank-receipt-${transaction.reference_number}.pdf`);
      
      toast({
        title: "Receipt Downloaded",
        description: "Transaction receipt has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF receipt.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Heritage Bank Transaction Receipt',
          text: `Transaction Receipt - ${transaction.reference_number}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Receipt link copied to clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Receipt link copied to clipboard.",
      });
    }
  };

  const isCredit = transaction.type === 'deposit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div id="transaction-receipt" className="bg-white p-8 space-y-6">
          {/* Heritage Bank Header with Watermark */}
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="text-8xl font-bold text-primary">HERITAGE</div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">H</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Heritage Remit Bank</h1>
                  <p className="text-sm text-muted-foreground">Banking Excellence Since 1885</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          </div>

          {/* Transaction Status */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold capitalize">{transaction.status}</span>
            </div>
          </div>

          {/* Transaction Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Type</p>
                  <p className="font-semibold capitalize">{transaction.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className={`text-2xl font-bold ${isCredit ? 'text-success' : 'text-primary'}`}>
                    {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reference Number</p>
                  <p className="font-mono text-sm">{transaction.reference_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="text-sm">{formatDate(transaction.created_at)}</p>
                </div>
              </div>

              {transaction.recipient_name && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-semibold">{transaction.recipient_name}</p>
                  </div>
                </>
              )}

              {transaction.method && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p className="font-semibold">{transaction.method}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{transaction.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Holder Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Account Holder Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Holder</p>
                  <p className="font-semibold">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono text-sm">{userProfile?.account_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>100 Broadway, Cincinnati, OH 45202, United States</p>
            <p>Phone: +1 (815) 600-8181 | Email: support@heritageremitbank.shop</p>
            <p>Member FDIC. Equal Housing Lender.</p>
            <p className="font-semibold">This is an official transaction receipt from Heritage Remit Bank</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4 border-t">
          <Button 
            onClick={generatePDF} 
            disabled={isGeneratingPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
          </Button>
          <Button variant="outline" onClick={shareReceipt}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}