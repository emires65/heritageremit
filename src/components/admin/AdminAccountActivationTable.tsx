import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserCheck, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InactiveUser {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  account_number: string;
  created_at: string;
}

export function AdminAccountActivationTable() {
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_status', 'inactive')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInactiveUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch inactive users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activateUserAccount = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('activate_user_account', {
        target_user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Account Activated",
        description: "User account has been successfully activated.",
      });

      // Refresh the list
      fetchInactiveUsers();
    } catch (error: any) {
      toast({
        title: "Activation Error",
        description: error.message || "Failed to activate user account.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = inactiveUsers.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading inactive users...</div>;
  }

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5" />
          <span>Account Activation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inactive users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                  </div>
                </TableCell>
                <TableCell>{user.account_number}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Activate Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Activate User Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to activate the account for {user.first_name} {user.last_name}? 
                          This will allow them to access all banking features.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => activateUserAccount(user.user_id)}
                        >
                          Activate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No inactive users found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}