import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TransactionReceiptDialog } from "./TransactionReceiptDialog";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userProfile: any;
}

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
}

export function TransactionHistoryDialog({ open, onOpenChange, userId, userProfile }: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      fetchTransactions();
    }
  }, [open, userId]);

  // Set up real-time subscriptions for transaction updates
  useEffect(() => {
    if (!open || !userId) return;

    // Subscribe to deposits changes
    const depositsChannel = supabase
      .channel('deposits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deposits',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    // Subscribe to withdrawals changes
    const withdrawalsChannel = supabase
      .channel('withdrawals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawals',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    // Subscribe to transactions changes
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `account_id=eq.${userId}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(depositsChannel);
      supabase.removeChannel(withdrawalsChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [open, userId]);

  const fetchTransactions = async () => {
    setLoading(true);
    
    try {
      // Fetch deposits
      const { data: deposits, error: depositsError } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (depositsError) throw depositsError;

      // Fetch withdrawals
      const { data: withdrawals, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;

      // Fetch user transactions (transfers and manual admin transactions)
      const { data: userTransactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', userId)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Combine and format transactions
      const allTransactions: Transaction[] = [
        // Deposits
        ...(deposits || []).map(d => ({
          ...d,
          type: 'deposit' as const,
          description: `Deposit via ${d.method || 'Bank Transfer'}`
        })),
        // Withdrawals  
        ...(withdrawals || []).map(w => ({
          ...w,
          type: 'withdrawal' as const,
          description: `${(w.account_details as any)?.transferType === 'international' ? 'International' : 'Local'} Transfer to ${(w.account_details as any)?.recipientName || 'Recipient'}`,
          recipient_name: (w.account_details as any)?.recipientName
        })),
        // User transactions (transfers and admin transactions)
        ...(userTransactions || []).map(t => ({
          ...t,
          type: 'transfer' as const,
          description: t.description,
          recipient_name: t.recipient_name
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTransactions(allTransactions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load transaction history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'completed' || status === 'approved' 
      ? 'default' 
      : status === 'pending' 
        ? 'secondary' 
        : 'destructive';
    
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filterTransactions = (type?: string) => {
    if (!type || type === 'all') return transactions;
    return transactions.filter(t => t.type === type);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReceiptDialogOpen(true);
  };

  const renderTransaction = (transaction: Transaction) => {
    const isCredit = transaction.type === 'deposit';
    
    return (
      <Card 
        key={transaction.id} 
        className="banking-card hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleTransactionClick(transaction)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isCredit ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {isCredit ? (
                  <ArrowDownLeft className="h-4 w-4 text-success" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-destructive" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm">
                    {transaction.description || `${transaction.type} Transaction`}
                  </h4>
                  {getStatusIcon(transaction.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
                {transaction.reference_number && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ref: {transaction.reference_number}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right flex items-center space-x-3">
              <div>
                <div className={`font-semibold ${isCredit ? 'text-success' : 'text-destructive'}`}>
                  {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
                <div className="mt-1">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposit">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            <TabsTrigger value="transfer">Transfers</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading transactions...</div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-3 max-h-96 overflow-y-auto">
                {filterTransactions('all').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  filterTransactions('all').map(renderTransaction)
                )}
              </TabsContent>

              <TabsContent value="deposit" className="space-y-3 max-h-96 overflow-y-auto">
                {filterTransactions('deposit').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No deposit transactions found</p>
                  </div>
                ) : (
                  filterTransactions('deposit').map(renderTransaction)
                )}
              </TabsContent>

              <TabsContent value="withdrawal" className="space-y-3 max-h-96 overflow-y-auto">
                {filterTransactions('withdrawal').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No withdrawal transactions found</p>
                  </div>
                ) : (
                  filterTransactions('withdrawal').map(renderTransaction)
                )}
              </TabsContent>

              <TabsContent value="transfer" className="space-y-3 max-h-96 overflow-y-auto">
                {filterTransactions('transfer').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transfer transactions found</p>
                  </div>
                ) : (
                  filterTransactions('transfer').map(renderTransaction)
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Receipt Dialog */}
        <TransactionReceiptDialog
          open={receiptDialogOpen}
          onOpenChange={setReceiptDialogOpen}
          transaction={selectedTransaction}
          userProfile={userProfile}
        />
      </DialogContent>
    </Dialog>
  );
}