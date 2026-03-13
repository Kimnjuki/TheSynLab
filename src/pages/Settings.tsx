import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { VerifiedBadge } from "@/components/auth/VerifiedBadge";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { 
  User, 
  Camera, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Loader2,
  Save,
  Mail,
  Globe,
  MapPin
} from "lucide-react";

interface ProfileData {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  notification_preferences: {
    email_marketing: boolean;
    email_updates: boolean;
    email_reviews: boolean;
  };
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isVerified } = useEmailVerification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      // Load from localStorage for offline/demo mode
      const storedProfile = localStorage.getItem(`profile_${user.id}`);
      
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        // Default profile
        const defaultProfile: ProfileData = {
          id: user.id,
          display_name: user.name || null,
          email: user.email || null,
          avatar_url: null,
          bio: null,
          website: null,
          location: null,
          notification_preferences: {
            email_marketing: false,
            email_updates: true,
            email_reviews: true,
          },
        };
        setProfile(defaultProfile);
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    
    try {
      // Convert to base64 for localStorage storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile((prev) => prev ? { ...prev, avatar_url: base64String } : null);
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated",
        });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !user) return;
    
    setSaving(true);
    
    try {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
      
      toast({
        title: "Profile saved",
        description: "Your changes have been saved",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save failed",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    setExporting(true);
    
    try {
      const exportData = {
        exported_at: new Date().toISOString(),
        profile: profile,
        reviews: JSON.parse(localStorage.getItem(`reviews_${user.id}`) || "[]"),
        favorites: JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]"),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "Contact support",
      description: "Please contact support to delete your account",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and public information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-border">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleAvatarClick}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Profile Photo</p>
                    <p className="text-sm text-muted-foreground">
                      Click to upload. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input value={user?.email || ""} disabled className="bg-muted" />
                    {isVerified && <VerifiedBadge />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile?.display_name || ""}
                    onChange={(e) => setProfile((prev) => prev ? { ...prev, display_name: e.target.value } : null)}
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile?.bio || ""}
                    onChange={(e) => setProfile((prev) => prev ? { ...prev, bio: e.target.value } : null)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile?.website || ""}
                    onChange={(e) => setProfile((prev) => prev ? { ...prev, website: e.target.value } : null)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profile?.location || ""}
                    onChange={(e) => setProfile((prev) => prev ? { ...prev, location: e.target.value } : null)}
                    placeholder="City, Country"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
            
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Choose what emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and improvements
                    </p>
                  </div>
                  <Switch
                    checked={profile?.notification_preferences?.email_updates ?? true}
                    onCheckedChange={(checked) => 
                      setProfile((prev) => prev ? {
                        ...prev,
                        notification_preferences: {
                          ...prev.notification_preferences,
                          email_updates: checked,
                        },
                      } : null)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Review Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone responds to your reviews
                    </p>
                  </div>
                  <Switch
                    checked={profile?.notification_preferences?.email_reviews ?? true}
                    onCheckedChange={(checked) => 
                      setProfile((prev) => prev ? {
                        ...prev,
                        notification_preferences: {
                          ...prev.notification_preferences,
                          email_reviews: checked,
                        },
                      } : null)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional offers and newsletter
                    </p>
                  </div>
                  <Switch
                    checked={profile?.notification_preferences?.email_marketing ?? false}
                    onCheckedChange={(checked) => 
                      setProfile((prev) => prev ? {
                        ...prev,
                        notification_preferences: {
                          ...prev.notification_preferences,
                          email_marketing: checked,
                        },
                      } : null)
                    }
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Your Data
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    disabled={exporting}
                  >
                    {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Export"}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>
                  Manage your current session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
