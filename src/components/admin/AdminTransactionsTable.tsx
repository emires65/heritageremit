import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { EditTransactionDateDialog } from "./EditTransactionDateDialog";

interface Transaction {
  id: string;
  account_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  status: string;
  reference_number: string;
  recipient_name?: string;
  recipient_account?: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    account_number: string;
  } | null;
}

export function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDateDialog, setEditDateDialog] = useState<{
    open: boolean;
    transactionId: string;
    currentDate: string;
  }>({
    open: false,
    transactionId: "",
    currentDate: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Get all unique account_ids and fetch profiles
      const accountIds = [...new Set(transactionsData?.map(t => t.account_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_number')
        .in('user_id', accountIds);

      // Combine data
      const transactionsWithProfiles = transactionsData?.map(transaction => ({
        ...transaction,
        profiles: profilesData?.find(p => p.user_id === transaction.account_id) || null
      })) || [];

      setTransactions(transactionsWithProfiles as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${transaction.profiles?.first_name} ${transaction.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.profiles?.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions by reference, name, account, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.reference_number}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {transaction.profiles?.account_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.transaction_type === 'credit' ? 'default' : 'secondary'}>
                    {transaction.transaction_type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  <span className={transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.transaction_type === 'credit' ? '+' : '-'}
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      transaction.status === 'completed' ? 'default' :
                      transaction.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDateDialog({
                      open: true,
                      transactionId: transaction.id,
                      currentDate: transaction.created_at,
                    })}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found matching your search.
        </div>
      )}

      <EditTransactionDateDialog
        open={editDateDialog.open}
        onOpenChange={(open) => setEditDateDialog(prev => ({ ...prev, open }))}
        transactionId={editDateDialog.transactionId}
        transactionType="transactions"
        currentDate={editDateDialog.currentDate}
        onDateUpdated={fetchTransactions}
      />
    </div>
  );
}