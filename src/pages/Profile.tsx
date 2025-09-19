import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User,
  Ruler,
  Scale,
  Settings,
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    height: '',
    weight: '',
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
          // Set edit data for the dialog
          setEditData({
            height: data.height_cm ? String(data.height_cm) : '',
            weight: data.weight_kg ? String(data.weight_kg) : '',
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
      const updateData: any = {};
      
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
      
      // Convert and validate weight
      if (editData.weight) {
        const weightValue = parseFloat(editData.weight);
        if (editData.unitSystem === 'imperial') {
          // Convert lbs to kg
          updateData.weight_kg = Math.round(weightValue * 0.453592 * 100) / 100;
        } else {
          updateData.weight_kg = Math.round(weightValue * 100) / 100;
        }
      }
      
      if (editData.biologicalSex) {
        updateData.biological_sex = editData.biologicalSex;
      }
      
      updateData.preferred_unit_system = editData.unitSystem;

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
      }

      setIsEditDialogOpen(false);
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
              <CardContent className="space-y-4">
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
                <div className="pt-4">
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

          {/* Physical Information */}
          <section>
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-primary" />
                  <span>Physical Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {profile?.height_cm && (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Ruler className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {profile.preferred_unit_system === 'imperial' 
                          ? `${Math.round(profile.height_cm / 2.54)}"` 
                          : `${profile.height_cm}cm`}
                      </div>
                      <div className="text-sm text-muted-foreground">Height</div>
                    </div>
                  )}
                  
                  {profile?.weight_kg && (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                        <Scale className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {profile.preferred_unit_system === 'imperial' 
                          ? `${Math.round(profile.weight_kg / 0.453592)}lbs` 
                          : `${profile.weight_kg}kg`}
                      </div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                    </div>
                  )}
                  
                  {profile?.biological_sex && (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6 text-accent" />
                      </div>
                      <div className="text-2xl font-bold text-foreground capitalize">
                        {profile.biological_sex}
                      </div>
                      <div className="text-sm text-muted-foreground">Biological Sex</div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-2xl">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Information
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Profile Information</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Unit System Toggle */}
                        <div className="flex items-center justify-center space-x-4 p-4 bg-muted/50 rounded-2xl">
                          <span className={`text-sm font-medium ${editData.unitSystem === 'metric' ? 'text-primary' : 'text-muted-foreground'}`}>
                            Metric
                          </span>
                          <Switch
                            checked={editData.unitSystem === 'imperial'}
                            onCheckedChange={(checked) => setEditData(prev => ({ 
                              ...prev, 
                              unitSystem: checked ? 'imperial' : 'metric',
                              height: '', // Clear values when switching
                              weight: ''
                            }))}
                            className="bg-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary"
                          />
                          <span className={`text-sm font-medium ${editData.unitSystem === 'imperial' ? 'text-primary' : 'text-muted-foreground'}`}>
                            Imperial
                          </span>
                        </div>

                        {/* Biological Sex Toggle */}
                        <div className="space-y-3">
                          <Label>Biological Sex</Label>
                          <div className="flex items-center justify-center space-x-4 p-4 bg-muted/50 rounded-2xl">
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

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-height">Height</Label>
                            <Input 
                              id="edit-height" 
                              type="number"
                              placeholder={editData.unitSystem === 'metric' ? '170 cm' : '68 in'}
                              value={editData.height}
                              onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                              className="rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-weight">Weight</Label>
                            <Input 
                              id="edit-weight" 
                              type="number"
                              placeholder={editData.unitSystem === 'metric' ? '70 kg' : '154 lbs'}
                              value={editData.weight}
                              onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                              className="rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditDialogOpen(false)}
                            className="flex-1 rounded-2xl"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="flex-1 bg-gradient-primary rounded-2xl"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;