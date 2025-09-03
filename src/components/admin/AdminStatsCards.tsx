import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";

export function AdminStatsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total balance
        const { data: profiles } = await supabase
          .from('profiles')
          .select('balance');
        
        const totalBalance = profiles?.reduce((sum, profile) => sum + (profile.balance || 0), 0) || 0;

        // Get pending deposits
        const { count: pendingDepositsCount } = await supabase
          .from('deposits')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get pending withdrawals
        const { count: pendingWithdrawalsCount } = await supabase
          .from('withdrawals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          totalUsers: userCount || 0,
          totalBalance,
          pendingDeposits: pendingDepositsCount || 0,
          pendingWithdrawals: pendingWithdrawalsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Balance",
      value: `$${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "System-wide balance",
    },
    {
      title: "Pending Deposits",
      value: stats.pendingDeposits.toLocaleString(),
      icon: TrendingUp,
      description: "Awaiting approval",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals.toLocaleString(),
      icon: CreditCard,
      description: "Awaiting approval",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}