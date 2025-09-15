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
import { Check, X, Search, Eye, Calendar } from "lucide-react";
import { EditTransactionDateDialog } from "./EditTransactionDateDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  reference_number: string;
  account_details: any;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    account_number: string;
  } | null;
}

export function AdminWithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
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
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;

      // Get profiles separately
      const userIds = withdrawalsData?.map(w => w.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_number')
        .in('user_id', userIds);

      // Combine data
      const withdrawalsWithProfiles = withdrawalsData?.map(withdrawal => ({
        ...withdrawal,
        profiles: profilesData?.find(p => p.user_id === withdrawal.user_id) || null
      })) || [];

      setWithdrawals(withdrawalsWithProfiles as Withdrawal[]);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawals.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWithdrawalStatus = async (withdrawalId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status,
          approved_at: new Date().toISOString(),
        })
        .eq('id', withdrawalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Withdrawal ${status} successfully.`,
      });
      
      fetchWithdrawals();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status.",
        variant: "destructive",
      });
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal =>
    withdrawal.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${withdrawal.profiles?.first_name} ${withdrawal.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.profiles?.account_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading withdrawals...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search withdrawals by reference, name, or account..."
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
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWithdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-mono text-sm">
                  {withdrawal.reference_number}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {withdrawal.profiles?.first_name} {withdrawal.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {withdrawal.profiles?.account_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  ${withdrawal.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{withdrawal.method || 'N/A'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      withdrawal.status === 'approved' ? 'default' :
                      withdrawal.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {withdrawal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(withdrawal.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDateDialog({
                        open: true,
                        transactionId: withdrawal.id,
                        currentDate: withdrawal.created_at,
                      })}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Withdrawal Details</DialogTitle>
                          <DialogDescription>
                            Reference: {withdrawal.reference_number}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Account Details</h4>
                            <pre className="text-sm bg-muted p-2 rounded mt-2">
                              {JSON.stringify(withdrawal.account_details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {withdrawal.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateWithdrawalStatus(withdrawal.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateWithdrawalStatus(withdrawal.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredWithdrawals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No withdrawals found matching your search.
        </div>
      )}

      <EditTransactionDateDialog
        open={editDateDialog.open}
        onOpenChange={(open) => setEditDateDialog(prev => ({ ...prev, open }))}
        transactionId={editDateDialog.transactionId}
        transactionType="withdrawals"
        currentDate={editDateDialog.currentDate}
        onDateUpdated={fetchWithdrawals}
      />
    </div>
  );
}