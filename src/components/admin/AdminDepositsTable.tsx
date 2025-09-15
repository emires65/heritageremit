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
import { Check, X, Search, Calendar } from "lucide-react";
import { EditTransactionDateDialog } from "./EditTransactionDateDialog";

interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  reference_number: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    account_number: string;
  } | null;
}

export function AdminDepositsTable() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
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
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const { data: depositsData, error: depositsError } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (depositsError) throw depositsError;

      // Get profiles separately
      const userIds = depositsData?.map(d => d.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_number')
        .in('user_id', userIds);

      // Combine data
      const depositsWithProfiles = depositsData?.map(deposit => ({
        ...deposit,
        profiles: profilesData?.find(p => p.user_id === deposit.user_id) || null
      })) || [];

      setDeposits(depositsWithProfiles as Deposit[]);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deposits.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, status: 'approved' | 'rejected', amount?: number, userId?: string) => {
    try {
      const { error } = await supabase
        .from('deposits')
        .update({ 
          status,
          approved_at: new Date().toISOString(),
        })
        .eq('id', depositId);

      if (error) throw error;

      // If approved, update user balance
      if (status === 'approved' && amount && userId) {
        await supabase.rpc('update_user_balance', {
          user_id_param: userId,
          amount_param: amount,
          operation: 'add'
        });
      }

      toast({
        title: "Success",
        description: `Deposit ${status} successfully.`,
      });
      
      fetchDeposits();
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast({
        title: "Error",
        description: "Failed to update deposit status.",
        variant: "destructive",
      });
    }
  };

  const filteredDeposits = deposits.filter(deposit =>
    deposit.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${deposit.profiles?.first_name} ${deposit.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.profiles?.account_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading deposits...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search deposits by reference, name, or account..."
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
            {filteredDeposits.map((deposit) => (
              <TableRow key={deposit.id}>
                <TableCell className="font-mono text-sm">
                  {deposit.reference_number}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {deposit.profiles?.first_name} {deposit.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {deposit.profiles?.account_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  ${deposit.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{deposit.method || 'N/A'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      deposit.status === 'approved' ? 'default' :
                      deposit.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {deposit.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(deposit.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDateDialog({
                        open: true,
                        transactionId: deposit.id,
                        currentDate: deposit.created_at,
                      })}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    
                    {deposit.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDepositStatus(deposit.id, 'approved', deposit.amount, deposit.user_id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDepositStatus(deposit.id, 'rejected')}
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

      {filteredDeposits.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No deposits found matching your search.
        </div>
      )}

      <EditTransactionDateDialog
        open={editDateDialog.open}
        onOpenChange={(open) => setEditDateDialog(prev => ({ ...prev, open }))}
        transactionId={editDateDialog.transactionId}
        transactionType="deposits"
        currentDate={editDateDialog.currentDate}
        onDateUpdated={fetchDeposits}
      />
    </div>
  );
}