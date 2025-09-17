import { useState, useEffect, useCallback, useRef } from "react";
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
import { DollarSign, Search, Ban, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

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
  account_status: string;
  created_at: string;
}

interface AdminUsersTableV2Props {
  refreshTrigger?: string | number;
}

export function AdminUsersTableV2({ refreshTrigger }: AdminUsersTableV2Props = {}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const lastFetchTime = useRef<number>(0);
  const mounted = useRef(true);

  // Force complete refresh when refresh trigger changes
  useEffect(() => {
    console.log('AdminUsersTableV2: Refresh trigger changed:', refreshTrigger);
    if (refreshTrigger) {
      mounted.current = true;
      setRetryCount(0);
      setFetchError(null);
      fetchProfiles(true);
    }
  }, [refreshTrigger]);

  // Initial fetch on mount
  useEffect(() => {
    mounted.current = true;
    fetchProfiles(true);
    
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchProfiles = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous fetches
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current < 1000) {
      console.log('Skipping fetch - too recent');
      return;
    }
    lastFetchTime.current = now;

    if (!mounted.current) {
      console.log('Component unmounted, skipping fetch');
      return;
    }

    setLoading(true);
    setFetchError(null);
    
    const fetchId = Math.random().toString(36).substr(2, 9);
    console.log(`Starting fetch ${fetchId} at ${new Date().toISOString()}`);
    
    try {
      // Add cache busting and force fresh query
      const { data, error } = await supabase
        .rpc('admin_get_all_profiles');

      if (!mounted.current) {
        console.log(`Fetch ${fetchId} completed but component unmounted`);
        return;
      }

      if (error) {
        console.error(`Fetch ${fetchId} - Supabase RPC error:`, error);
        setFetchError(`Database error: ${error.message}`);
        throw error;
      }
      
      // Validate data structure
      if (!Array.isArray(data)) {
        console.error(`Fetch ${fetchId} - Invalid data format:`, data);
        setFetchError('Invalid data format received from server');
        throw new Error('Invalid data format');
      }
      
      console.log(`Fetch ${fetchId} - Success: ${data?.length || 0} users loaded`);
      setProfiles(data || []);
      setRetryCount(0);
      
      // Success notification only for manual refreshes
      if (forceRefresh && data && data.length > 0) {
        toast({
          title: "Users Loaded Successfully",
          description: `Loaded ${data.length} users from database.`,
        });
      }
      
    } catch (error) {
      if (!mounted.current) return;
      
      console.error(`Fetch ${fetchId} - Critical error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setFetchError(errorMessage);
      
      setRetryCount(prev => prev + 1);
      
      toast({
        title: "Failed to Load Users",
        description: "Could not fetch user list from database. Please try again.",
        variant: "destructive",
      });
      
      setProfiles([]);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [toast]);

  const handleManualRefresh = useCallback(() => {
    console.log('Manual refresh triggered by user');
    setRetryCount(0);
    fetchProfiles(true);
  }, [fetchProfiles]);

  const fundUserAccount = async (userId: string, amount: number) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('fund_user_account', {
        target_user_id: userId,
        amount: amount
      });

      if (error) throw error;

      toast({
        title: "Account Funded",
        description: `Successfully added $${amount.toFixed(2)} to user account.`,
      });
      
      // Refresh the list after funding
      await fetchProfiles(true);
    } catch (error) {
      console.error('Error funding account:', error);
      toast({
        title: "Funding Failed",
        description: "Could not fund user account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('toggle_user_status', {
        target_user_id: userId,
        new_status: newStatus
      });

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully.`,
      });
      
      // Refresh the list after status change
      await fetchProfiles(true);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Status Update Failed",
        description: "Could not update user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase().includes(searchLower) ||
      (profile.account_number || '').toLowerCase().includes(searchLower) ||
      (profile.phone || '').toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (loading && profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <div className="text-lg font-medium">Loading Users...</div>
        <div className="text-sm text-muted-foreground mt-1">
          Fetching user list from database
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, account number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {profiles.length} users total
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {fetchError && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Failed to Load Users</span>
              </div>
              <p className="text-sm text-destructive/80 mt-1">{fetchError}</p>
              {retryCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Retry attempts: {retryCount}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={loading}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {filteredProfiles.map((profile) => (
          <div key={`${profile.id}-${profile.user_id}`} className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">
                  {profile.first_name || 'N/A'} {profile.last_name || 'N/A'}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {profile.account_number || 'No Account Number'}
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
                <p className="font-medium">{profile.phone || 'Not provided'}</p>
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
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={profile.account_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {profile.account_status || 'inactive'}
                </Badge>
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
                disabled={loading}
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
                disabled={loading}
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
                <TableHead className="min-w-[80px]">Account Status</TableHead>
                <TableHead className="min-w-[60px]">Role</TableHead>
                <TableHead className="min-w-[90px]">Created</TableHead>
                <TableHead className="min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={`${profile.id}-${profile.user_id}`}>
                  <TableCell className="font-medium">
                    {profile.first_name || 'N/A'} {profile.last_name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {profile.account_number || 'No Account Number'}
                  </TableCell>
                  <TableCell>{profile.phone || 'Not provided'}</TableCell>
                  <TableCell className="font-mono">
                    ${(profile.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.status === 'blocked' ? 'destructive' : 'default'}>
                      {profile.status === 'blocked' ? 'Blocked' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.account_status === 'active' ? 'default' : 'secondary'}>
                      {profile.account_status || 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                      {profile.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
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
                        disabled={loading}
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
                        disabled={loading}
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

      {/* Empty State */}
      {filteredProfiles.length === 0 && !loading && !fetchError && (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-muted-foreground">
            {profiles.length === 0 ? 
              'No users found in database' : 
              'No users match your search criteria'}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {profiles.length === 0 ? 
              'Users will appear here when they register accounts.' :
              'Try adjusting your search terms.'}
          </p>
          {profiles.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              className="mt-4"
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Check Again
            </Button>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && profiles.length > 0 && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <div className="text-sm font-medium">Updating users...</div>
          </div>
        </div>
      )}
    </div>
  );
}