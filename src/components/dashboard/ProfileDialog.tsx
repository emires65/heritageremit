import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, MapPin, Calendar, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

export function ProfileDialog({ open, onOpenChange, profile, onProfileUpdate }: ProfileDialogProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    date_of_birth: profile?.date_of_birth || ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', profile.user_id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      setEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      date_of_birth: profile?.date_of_birth || ''
    });
    setEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Summary */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="text-base">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-mono text-sm">{profile?.user_id?.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="text-sm capitalize">{profile?.role || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Balance</p>
                  <p className="text-sm font-semibold">
                    ${(profile?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Personal Information */}
          <Card className="banking-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Personal Information</CardTitle>
              {!editing ? (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading} variant="banking">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  {editing ? (
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.first_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  {editing ? (
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.last_name || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {editing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street, City, State, ZIP"
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.address || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                {editing ? (
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {profile?.date_of_birth 
                        ? new Date(profile.date_of_birth).toLocaleDateString() 
                        : 'Not set'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Transaction PIN</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.pin_hash ? 'Set up' : 'Not set up'}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Change PIN
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}