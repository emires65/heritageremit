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
import { DollarSign, UserCheck, UserX, Search, Ban, CheckCircle, AlertCircle } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  balance: number;
  phone: string;
  account_number: string;
  role: string;
  status: string;
  created_at: string;
}

interface AdminUsersTableProps {
  refreshKey?: string | number;
}

export function AdminUsersTable({ refreshKey }: AdminUsersTableProps = {}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  // Force refresh when admin logs in or refreshKey changes
  useEffect(() => {
    console.log('AdminUsersTable: Triggering fresh fetch, refreshKey:', refreshKey);
    fetchProfiles();
  }, [refreshKey]);

  // Also fetch on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setFetchError(null);
    
    try {
      console.log('Fetching ALL profiles with timestamp:', Date.now()); // Debug log with timestamp
      
      // Call the RPC function to get all profiles (bypasses RLS)
      const { data, error } = await supabase
        .rpc('admin_get_all_profiles');

      if (error) {
        console.error('Supabase RPC error:', error); // Debug log
        setFetchError(`Database error: ${error.message}`);
        throw error;
      }
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        setFetchError('Invalid data format received from server');
        throw new Error('Invalid data format');
      }
      
      console.log('Successfully fetched profiles:', data?.length || 0, 'users at', new Date().toISOString()); // Debug log
      setProfiles(data || []);
      
      // Show success toast on successful fetch if we have users
      if (data && data.length > 0) {
        toast({
          title: "Users Loaded",
          description: `Successfully loaded ${data.length} users.`,
        });
      }
      
    } catch (error) {
      console.error('Critical error fetching profiles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setFetchError(errorMessage);
      
      toast({
        title: "Error Loading Users",
        description: "Failed to fetch user profiles. Please try refreshing the page.",
        variant: "destructive",
      });
      
      // Set empty array to show "no users found" message
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fundUserAccount = async (userId: string, amount: number) => {
    try {
      const { error } = await supabase.rpc('fund_user_account', {
        target_user_id: userId,
        amount: amount
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Account funded with $${amount.toFixed(2)} successfully.`,
      });
      
      fetchProfiles();
    } catch (error) {
      console.error('Error funding account:', error);
      toast({
        title: "Error",
        description: "Failed to fund user account.",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase.rpc('toggle_user_status', {
        target_user_id: userId,
        new_status: newStatus
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully.`,
      });
      
      fetchProfiles();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, account number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('Manual refresh triggered');
            fetchProfiles();
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Error Display */}
      {fetchError && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Failed to load users</span>
          </div>
          <p className="text-sm text-destructive/80 mt-1">{fetchError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfiles}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {profile.account_number || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant={profile.status === 'blocked' ? 'destructive' : 'default'} className="text-xs">
                  {profile.status === 'blocked' ? 'Blocked' : 'Active'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{profile.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Balance:</span>
                <p className="font-mono font-medium">
                  ${(profile.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {profile.role || 'user'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="text-xs">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const amount = prompt('Enter amount to fund account:');
                  if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                    fundUserAccount(profile.user_id, Number(amount));
                  }
                }}
                className="flex-1"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Fund
              </Button>
              <Button
                variant={profile.status === 'blocked' ? 'default' : 'destructive'}
                size="sm"
                onClick={() => {
                  const newStatus = profile.status === 'blocked' ? 'active' : 'blocked';
                  const action = newStatus === 'blocked' ? 'block' : 'unblock';
                  if (confirm(`Are you sure you want to ${action} this user?`)) {
                    toggleUserStatus(profile.user_id, newStatus);
                  }
                }}
                className="flex-1"
              >
                {profile.status === 'blocked' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Unblock
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-1" />
                    Block
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Name</TableHead>
                <TableHead className="min-w-[130px]">Account Number</TableHead>
                <TableHead className="min-w-[120px]">Phone</TableHead>
                <TableHead className="min-w-[100px]">Balance</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="min-w-[60px]">Role</TableHead>
                <TableHead className="min-w-[90px]">Created</TableHead>
                <TableHead className="min-w-[140px]">Actions</TableHead>
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
                    <Badge variant={profile.status === 'blocked' ? 'destructive' : 'default'}>
                      {profile.status === 'blocked' ? 'Blocked' : 'Active'}
                    </Badge>
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
                          const amount = prompt('Enter amount to fund account:');
                          if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                            fundUserAccount(profile.user_id, Number(amount));
                          }
                        }}
                        title="Fund Account"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={profile.status === 'blocked' ? 'default' : 'destructive'}
                        size="sm"
                        onClick={() => {
                          const newStatus = profile.status === 'blocked' ? 'active' : 'blocked';
                          const action = newStatus === 'blocked' ? 'block' : 'unblock';
                          if (confirm(`Are you sure you want to ${action} this user?`)) {
                            toggleUserStatus(profile.user_id, newStatus);
                          }
                        }}
                        title={profile.status === 'blocked' ? 'Unblock User' : 'Block User'}
                      >
                        {profile.status === 'blocked' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredProfiles.length === 0 && !loading && !fetchError && (
        <div className="text-center py-8 text-muted-foreground">
          {profiles.length === 0 ? 
            'No users found in the database. Users will appear here after they register.' : 
            'No users found matching your search criteria.'}
        </div>
      )}

      {filteredProfiles.length === 0 && !loading && fetchError && (
        <div className="text-center py-8 text-muted-foreground">
          Unable to load users due to an error. Please check the error message above and try again.
        </div>
      )}
    </div>
  );
}