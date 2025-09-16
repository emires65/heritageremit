import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  LogOut,
  Shield,
  DollarSign,
  UserCheck,
  FileText
} from "lucide-react";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminDepositsTable } from "@/components/admin/AdminDepositsTable";
import { AdminWithdrawalsTable } from "@/components/admin/AdminWithdrawalsTable";
import { AdminLoanApplicationsTable } from "@/components/admin/AdminLoanApplicationsTable";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";

import { AdminTransactionsTable } from "@/components/admin/AdminTransactionsTable";
import { AdminAccountActivationTable } from "@/components/admin/AdminAccountActivationTable";
import { AdminManualTransactionDialog } from "@/components/admin/AdminManualTransactionDialog";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [manualTransactionOpen, setManualTransactionOpen] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      navigate('/admin/auth');
      return;
    }
    
    try {
      const sessionData = JSON.parse(adminSession);
      
      // Check if session is authenticated and not expired
      if (!sessionData.authenticated) {
        localStorage.removeItem('admin_session');
        navigate('/admin/auth');
        return;
      }
      
      // Check if session has expired (if expires field exists)
      if (sessionData.expires && Date.now() > sessionData.expires) {
        localStorage.removeItem('admin_session');
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please login again.",
          variant: "destructive",
        });
        navigate('/admin/auth');
        return;
      }
      
    } catch (error) {
      // If parsing fails, assume old format or invalid session
      localStorage.removeItem('admin_session');
      navigate('/admin/auth');
      return;
    }
    
    setLoading(false);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Shield className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Heritage Bank Admin</h1>
              <p className="text-white/70 text-sm">Administrative Panel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">Administrator</p>
              <p className="text-white/70 text-sm">System Access</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-white/70">Manage users, transactions, and system operations.</p>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards />

        {/* Management Tabs */}
        <Card className="banking-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>System Management</span>
              </div>
              <Button
                onClick={() => setManualTransactionOpen(true)}
                variant="banking"
                size="sm"
              >
                Add Manual Transaction
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activation" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-1">
                <TabsTrigger value="activation" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Activation</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <FileText className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Transactions</span>
                </TabsTrigger>
                <TabsTrigger value="deposits" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Deposits</span>
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Withdrawals</span>
                </TabsTrigger>
                <TabsTrigger value="loans" className="flex items-center justify-center space-x-1 text-xs md:text-sm px-2 py-2">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Loans</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activation" className="mt-6">
                <AdminAccountActivationTable />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <AdminUsersTable />
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <AdminTransactionsTable />
              </TabsContent>

              <TabsContent value="deposits" className="mt-6">
                <AdminDepositsTable />
              </TabsContent>

              <TabsContent value="withdrawals" className="mt-6">
                <AdminWithdrawalsTable />
              </TabsContent>

              <TabsContent value="loans" className="mt-6">
                <AdminLoanApplicationsTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AdminManualTransactionDialog
          open={manualTransactionOpen}
          onOpenChange={setManualTransactionOpen}
          onTransactionAdded={() => {
            // Force refresh of all admin tables
            window.location.reload();
          }}
        />
      </main>
    </div>
  );
}