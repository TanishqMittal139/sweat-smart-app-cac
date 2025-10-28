import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  full_name: string;
  height_cm?: number;
  weight_kg?: number;
  biological_sex?: string;
  activity_level?: string;
  preferred_unit_system?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState({
    height: '',
    biologicalSex: '' as 'male' | 'female' | '',
    unitSystem: 'metric' as 'metric' | 'imperial'
  });
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setProfile(data);
          // Set edit data with height in display units
          const displayHeight = data.height_cm && data.preferred_unit_system === 'imperial' 
            ? Math.round(data.height_cm / 2.54) 
            : data.height_cm;
          
          setEditData({
            height: displayHeight ? String(displayHeight) : '',
            biologicalSex: (data.biological_sex === 'male' || data.biological_sex === 'female') ? data.biological_sex : '',
            unitSystem: (data.preferred_unit_system === 'imperial') ? 'imperial' : 'metric'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        preferred_unit_system: editData.unitSystem
      };
      
      // Convert and validate height
      if (editData.height) {
        const heightValue = parseFloat(editData.height);
        if (editData.unitSystem === 'imperial') {
          // Convert inches to cm
          updateData.height_cm = Math.round(heightValue * 2.54);
        } else {
          updateData.height_cm = Math.round(heightValue);
        }
      }
      
      if (editData.biologicalSex) {
        updateData.biological_sex = editData.biologicalSex;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refetch profile data
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data);
        // Update edit data to reflect new values
        const displayHeight = data.height_cm && data.preferred_unit_system === 'imperial' 
          ? Math.round(data.height_cm / 2.54) 
          : data.height_cm;
        
        setEditData({
          height: displayHeight ? String(displayHeight) : '',
          biologicalSex: (data.biological_sex === 'male' || data.biological_sex === 'female') ? data.biological_sex : '',
          unitSystem: (data.preferred_unit_system === 'imperial') ? 'imperial' : 'metric'
        });
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading if still checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Information */}
          <section>
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-primary" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-medium text-foreground">
                      {profile?.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg font-medium text-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Unit System Toggle */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Unit System</Label>
                  <div className="flex items-center justify-start space-x-4 p-4 bg-muted/50 rounded-2xl">
                    <span className={`text-sm font-medium ${editData.unitSystem === 'metric' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Metric
                    </span>
                    <Switch
                      checked={editData.unitSystem === 'imperial'}
                      onCheckedChange={(checked) => setEditData(prev => ({ 
                        ...prev, 
                        unitSystem: checked ? 'imperial' : 'metric',
                        height: '' // Clear height when switching
                      }))}
                      className="bg-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary"
                    />
                    <span className={`text-sm font-medium ${editData.unitSystem === 'imperial' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Imperial
                    </span>
                  </div>
                </div>

                {/* Biological Sex Toggle */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Biological Sex</Label>
                  <div className="flex items-center justify-start space-x-4 p-4 bg-muted/50 rounded-2xl">
                    <span className={`text-sm font-medium ${editData.biologicalSex === 'female' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Female
                    </span>
                    <Switch
                      checked={editData.biologicalSex === 'male'}
                      onCheckedChange={(checked) => setEditData(prev => ({ 
                        ...prev, 
                        biologicalSex: checked ? 'male' : 'female'
                      }))}
                      className="bg-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary"
                    />
                    <span className={`text-sm font-medium ${editData.biologicalSex === 'male' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Male
                    </span>
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium text-muted-foreground">
                    Height {editData.unitSystem === 'imperial' ? '(inches)' : '(cm)'}
                  </Label>
                  <Input 
                    id="height" 
                    type="number"
                    placeholder={editData.unitSystem === 'metric' ? 'e.g., 170' : 'e.g., 68'}
                    value={editData.height}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setEditData(prev => ({ ...prev, height: value }));
                      }
                    }}
                    className="rounded-xl"
                  />
                  {profile?.height_cm && (
                    <p className="text-sm text-muted-foreground">
                      Current: {profile.preferred_unit_system === 'imperial' 
                        ? `${Math.round(profile.height_cm / 2.54)}"` 
                        : `${profile.height_cm}cm`}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-primary rounded-2xl"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    className="rounded-2xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;