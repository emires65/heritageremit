import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in and has admin role
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: hasAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        
        if (hasAdmin) {
          navigate('/admin');
        }
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user has admin role
        const { data: hasAdmin, error: roleError } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'admin'
        });

        if (roleError) throw roleError;

        if (hasAdmin) {
          toast({
            title: "Admin Access Granted",
            description: "Welcome to the admin panel.",
          });
          navigate('/admin');
        } else {
          // User doesn't have admin role
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Admin authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <div className="glass-effect p-4 rounded-xl">
            <Shield className="h-8 w-8 text-accent" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="banking-card backdrop-blur-lg border-white/20">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Secure administrative panel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="banking" className="w-full" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                <span>
                  This is a secure administrative area. Unauthorized access is prohibited.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}