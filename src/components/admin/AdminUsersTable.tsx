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
import { Eye, UserCheck, UserX, Search } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  balance: number;
  phone: string;
  account_number: string;
  role: string;
  created_at: string;
}

export function AdminUsersTable() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = async (userId: string, newBalance: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User balance updated successfully.",
      });
      
      fetchProfiles();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: "Error",
        description: "Failed to update user balance.",
        variant: "destructive",
      });
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, account number, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.first_name} {profile.last_name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {profile.account_number || 'N/A'}
                </TableCell>
                <TableCell>{profile.phone || 'N/A'}</TableCell>
                <TableCell className="font-mono">
                  ${(profile.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role || 'user'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newBalance = prompt('Enter new balance:', profile.balance?.toString() || '0');
                        if (newBalance && !isNaN(Number(newBalance))) {
                          updateUserBalance(profile.user_id, Number(newBalance));
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your search.
        </div>
      )}
    </div>
  );
}