import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminManualTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  account_number: string;
}

export function AdminManualTransactionDialog({ open, onOpenChange }: AdminManualTransactionDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("credit");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_number')
        .eq('account_status', 'active')
        .order('first_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !amount || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const transactionAmount = parseFloat(amount);
    if (transactionAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.rpc('add_manual_transaction', {
        target_user_id: selectedUserId,
        transaction_amount: transactionAmount,
        transaction_description: description,
        transaction_type: transactionType
      });

      if (error) throw error;

      toast({
        title: "Transaction Added",
        description: `${transactionType === 'credit' ? 'Credit' : 'Debit'} transaction of $${transactionAmount.toFixed(2)} has been added to the user's account.`,
      });

      // Reset form
      setSelectedUserId("");
      setAmount("");
      setDescription("");
      setTransactionType("credit");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Transaction Error",
        description: error.message || "Failed to add transaction.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(user => user.user_id === selectedUserId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user">Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name} - {user.account_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit (Add Money)</SelectItem>
                <SelectItem value="debit">Debit (Deduct Money)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description..."
              required
            />
          </div>

          {selectedUser && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Transaction Summary</h4>
              <p className="text-sm text-muted-foreground">
                {transactionType === 'credit' ? 'Adding' : 'Deducting'} ${amount || '0.00'} 
                {transactionType === 'credit' ? ' to' : ' from'} {selectedUser.first_name} {selectedUser.last_name}'s account
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="banking"
              className="flex-1"
            >
              {loading ? "Processing..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}