import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Download, 
  History, 
  Settings, 
  User as UserIcon, 
  LogOut,
  CreditCard,
  Shield,
  ArrowRight
} from "lucide-react";
import { AtmCard } from "@/components/dashboard/AtmCard";
import { WithdrawMoneyDialog } from "@/components/dashboard/WithdrawMoneyDialog";
import { ReceiveMoneyDialog } from "@/components/dashboard/ReceiveMoneyDialog";
import { TransactionHistoryDialog } from "@/components/dashboard/TransactionHistoryDialog";
import { ProfileDialog } from "@/components/dashboard/ProfileDialog";
import { PinSetupDialog } from "@/components/dashboard/PinSetupDialog";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [pinSetupOpen, setPinSetupOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to refresh user profile and balance
  const refreshProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);
      
      // Get user profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(profileData);
        // Check if user needs to set up PIN
        if (!(profileData as any).pin_hash) {
          setPinSetupOpen(true);
        }
      }
      
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      icon: Send,
      title: "Withdraw Money",
      subtitle: "Transfer funds locally or internationally",
      onClick: () => setWithdrawDialogOpen(true),
      variant: "primary" as const,
    },
    {
      icon: Download,
      title: "Receive Money",
      subtitle: "View account details for incoming transfers",
      onClick: () => setReceiveDialogOpen(true),
      variant: "secondary" as const,
    },
    {
      icon: History,
      title: "Transaction History",
      subtitle: "View all your transactions",
      onClick: () => setHistoryDialogOpen(true),
      variant: "secondary" as const,
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "Manage your account preferences",
      onClick: () => {},
      variant: "secondary" as const,
    },
    {
      icon: UserIcon,
      title: "Profile",
      subtitle: "Update your personal information",
      onClick: () => setProfileDialogOpen(true),
      variant: "secondary" as const,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
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
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Heritage Bank</h1>
              <p className="text-white/70 text-sm">Premium Banking</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-white/70 text-sm">Account Holder</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.first_name}!
          </h2>
          <p className="text-white/70">Manage your banking with confidence and security.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Account Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  ${(profile?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-muted-foreground">Available Balance</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <Card
                  key={index}
                  className={`banking-card hover-lift cursor-pointer ${
                    item.variant === 'primary' ? 'border-accent/30' : ''
                  }`}
                  onClick={item.onClick}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        item.variant === 'primary' 
                          ? 'bg-gradient-gold' 
                          : 'bg-primary/10'
                      }`}>
                        <item.icon className={`h-6 w-6 ${
                          item.variant === 'primary' ? 'text-white' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        {item.variant === 'primary' && (
                          <ArrowRight className="h-4 w-4 text-accent mt-2" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* ATM Card */}
            <AtmCard 
              holderName={`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()}
              userId={user?.id || ''}
            />

            {/* Security Notice */}
            <Card className="banking-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-success mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Account Secured</h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is protected with advanced security measures and encrypted transactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <WithdrawMoneyDialog 
        open={withdrawDialogOpen} 
        onOpenChange={setWithdrawDialogOpen}
        userBalance={profile?.balance || 0}
        userId={user?.id || ''}
        onTransactionComplete={refreshProfile}
      />
      
      <ReceiveMoneyDialog 
        open={receiveDialogOpen} 
        onOpenChange={setReceiveDialogOpen}
        profile={profile}
      />
      
      <TransactionHistoryDialog 
        open={historyDialogOpen} 
        onOpenChange={setHistoryDialogOpen}
        userId={user?.id || ''}
        userProfile={profile}
      />
      
      <ProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
        profile={profile}
        onProfileUpdate={setProfile}
      />

      <PinSetupDialog
        open={pinSetupOpen}
        onOpenChange={setPinSetupOpen}
        userId={user?.id || ''}
        onPinSet={() => setPinSetupOpen(false)}
      />
    </div>
  );
}