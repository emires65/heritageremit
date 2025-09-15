import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditTransactionDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  transactionType: 'transactions' | 'deposits' | 'withdrawals';
  currentDate: string;
  onDateUpdated?: () => void;
}

export function EditTransactionDateDialog({
  open,
  onOpenChange,
  transactionId,
  transactionType,
  currentDate,
  onDateUpdated
}: EditTransactionDateDialogProps) {
  const [newDate, setNewDate] = useState(currentDate.split('T')[0]); // Format for date input
  const [newTime, setNewTime] = useState(
    new Date(currentDate).toLocaleTimeString('en-GB', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateDate = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please provide both date and time.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const combinedDateTime = new Date(`${newDate}T${newTime}:00`).toISOString();
      
      const { error } = await supabase.rpc('update_transaction_date', {
        table_name: transactionType,
        transaction_id: transactionId,
        new_date: combinedDateTime
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction date updated successfully.",
      });

      onOpenChange(false);
      onDateUpdated?.();
    } catch (error) {
      console.error('Error updating transaction date:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction date.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction Date</DialogTitle>
          <DialogDescription>
            Update the date and time for this transaction. This action will be logged.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Current: {new Date(currentDate).toLocaleString()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateDate} 
            disabled={loading}
            variant="banking"
          >
            {loading ? "Updating..." : "Update Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}