import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReceiveMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export function ReceiveMoneyDialog({ open, onOpenChange, profile }: ReceiveMoneyDialogProps) {
  const { toast } = useToast();

  const accountDetails = {
    accountName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
    accountNumber: profile?.account_number || 'HB1234567890',
    bankName: 'Heritage Bank',
    routingNumber: 'HB001234',
    swiftCode: 'HERITGEUS33',
    bankAddress: '123 Heritage Plaza, Financial District, NY 10001'
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    });
  };

  const copyAllDetails = () => {
    const details = `
Account Name: ${accountDetails.accountName}
Account Number: ${accountDetails.accountNumber}
Bank Name: ${accountDetails.bankName}
Routing Number: ${accountDetails.routingNumber}
SWIFT Code: ${accountDetails.swiftCode}
Bank Address: ${accountDetails.bankAddress}
    `.trim();

    copyToClipboard(details, "All account details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Receive Money</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Share Your Account Details</h3>
            <p className="text-muted-foreground">
              Share these details with anyone who wants to send you money
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Domestic Transfer Details */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-base">For Domestic Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Name</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">{accountDetails.accountName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.accountName, "Account name")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">{accountDetails.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.accountNumber, "Account number")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Routing Number</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">{accountDetails.routingNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.routingNumber, "Routing number")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">{accountDetails.bankName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.bankName, "Bank name")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Transfer Details */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="text-base">For International Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SWIFT Code</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="font-mono text-sm">{accountDetails.swiftCode}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.swiftCode, "SWIFT code")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bank Address</label>
                  <div className="flex items-center justify-between mt-1 p-2 bg-muted/50 rounded">
                    <span className="text-sm">{accountDetails.bankAddress}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(accountDetails.bankAddress, "Bank address")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    For international transfers, also provide the account number and account name from the domestic section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={copyAllDetails} className="flex-1" variant="banking">
              <Copy className="h-4 w-4 mr-2" />
              Copy All Details
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-accent/10 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Security Notice</h4>
            <p className="text-xs text-muted-foreground">
              Only share these details with trusted parties. Heritage Bank will never ask for your account details via email or phone. 
              Always verify the identity of anyone requesting your account information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}