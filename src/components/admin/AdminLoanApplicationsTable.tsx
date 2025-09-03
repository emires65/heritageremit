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
import { Check, X, Search, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LoanApplication {
  id: string;
  user_id: string;
  amount: number;
  loan_type: string;
  purpose: string;
  status: string;
  employment_info: any;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    account_number: string;
  } | null;
}

export function AdminLoanApplicationsTable() {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  const fetchLoanApplications = async () => {
    try {
      const { data: loansData, error: loansError } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Get profiles separately
      const userIds = loansData?.map(l => l.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_number')
        .in('user_id', userIds);

      // Combine data
      const loansWithProfiles = loansData?.map(loan => ({
        ...loan,
        profiles: profilesData?.find(p => p.user_id === loan.user_id) || null
      })) || [];

      setLoanApplications(loansWithProfiles as LoanApplication[]);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loan applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLoanStatus = async (loanId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status })
        .eq('id', loanId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Loan application ${status} successfully.`,
      });
      
      fetchLoanApplications();
    } catch (error) {
      console.error('Error updating loan application:', error);
      toast({
        title: "Error",
        description: "Failed to update loan application status.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = loanApplications.filter(loan =>
    `${loan.profiles?.first_name} ${loan.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.profiles?.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading loan applications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search loans by name, account, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {loan.profiles?.first_name} {loan.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {loan.profiles?.account_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  ${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{loan.loan_type}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {loan.purpose}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      loan.status === 'approved' ? 'default' :
                      loan.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(loan.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Loan Application Details</DialogTitle>
                          <DialogDescription>
                            Application from {loan.profiles?.first_name} {loan.profiles?.last_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium">Loan Amount</h4>
                              <p className="text-lg font-mono">
                                ${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Loan Type</h4>
                              <p>{loan.loan_type}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">Purpose</h4>
                            <p>{loan.purpose}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Employment Information</h4>
                            <pre className="text-sm bg-muted p-2 rounded mt-2">
                              {JSON.stringify(loan.employment_info, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {loan.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateLoanStatus(loan.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateLoanStatus(loan.id, 'rejected')}
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

      {filteredApplications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No loan applications found matching your search.
        </div>
      )}
    </div>
  );
}