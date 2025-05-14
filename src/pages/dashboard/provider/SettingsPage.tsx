import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Mock settings data
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        newBookings: true,
        bookingReminders: true,
        bookingCancellations: true,
        messages: true,
        reviews: true,
        promotions: false
      },
      push: {
        newBookings: true,
        bookingReminders: true,
        bookingCancellations: true,
        messages: true,
        reviews: false,
        promotions: false
      }
    },
    privacy: {
      showContactInfo: true,
      shareProfileData: false,
      allowReviews: true
    },
    security: {
      twoFactorAuth: false,
      passwordLastChanged: "2023-05-15"
    }
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleNotificationChange = (category: string, type: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category as keyof typeof prev.notifications],
          [type]: checked
        }
      }
    }));

    toast({
      title: "Settings updated",
      description: `${type} notifications ${checked ? "enabled" : "disabled"}.`
    });
  };

  const handlePrivacyChange = (setting: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: checked
      }
    }));

    toast({
      title: "Privacy setting updated",
      description: `${setting} setting ${checked ? "enabled" : "disabled"}.`
    });
  };

  const handleSecurityChange = (setting: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [setting]: checked
      }
    }));

    toast({
      title: "Security setting updated",
      description: `${setting} ${checked ? "enabled" : "disabled"}.`
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password.new !== password.confirm) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.new.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock successful password change
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        passwordLastChanged: new Date().toISOString().split('T')[0]
      }
    }));
    
    setPassword({
      current: "",
      new: "",
      confirm: ""
    });
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
  };

  const handleAccountDeletion = () => {
    // Simulating account deletion
    toast({
      title: "Account deleted",
      description: "Your account has been scheduled for deletion."
    });
    
    // Logout user after account deletion
    setTimeout(() => {
      logout();
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage emails you receive from us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label 
                          htmlFor={`email-${key}`}
                          className="text-base"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {getNotificationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        id={`email-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => handleNotificationChange("email", key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage notifications on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label 
                          htmlFor={`push-${key}`}
                          className="text-base"
                        >
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {getNotificationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        id={`push-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => handleNotificationChange("push", key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage how your information is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label 
                        htmlFor="show-contact-info"
                        className="text-base"
                      >
                        Show Contact Information
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to see your contact information on your profile
                      </p>
                    </div>
                    <Switch
                      id="show-contact-info"
                      checked={settings.privacy.showContactInfo}
                      onCheckedChange={(checked) => handlePrivacyChange("showContactInfo", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label 
                        htmlFor="share-profile-data"
                        className="text-base"
                      >
                        Share Profile Data
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to share your profile data with partner services
                      </p>
                    </div>
                    <Switch
                      id="share-profile-data"
                      checked={settings.privacy.shareProfileData}
                      onCheckedChange={(checked) => handlePrivacyChange("shareProfileData", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label 
                        htmlFor="allow-reviews"
                        className="text-base"
                      >
                        Allow Reviews
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to leave reviews for your services
                      </p>
                    </div>
                    <Switch
                      id="allow-reviews"
                      checked={settings.privacy.allowReviews}
                      onCheckedChange={(checked) => handlePrivacyChange("allowReviews", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label 
                      htmlFor="two-factor-auth"
                      className="text-base"
                    >
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({...password, current: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword({...password, new: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground">Service Provider</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">January 15, 2023</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Account ID</p>
                    <p className="text-sm text-muted-foreground">{user?.id || "USR123456"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{user?.email || "provider@example.com"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Actions that can't be undone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Deleting your account will remove all of your information from our database. This cannot be undone.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAccountDeletion}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Helper function to get notification descriptions
function getNotificationDescription(type: string): string {
  switch(type) {
    case "newBookings": 
      return "Receive notifications when new booking requests come in";
    case "bookingReminders": 
      return "Get reminders about upcoming scheduled bookings";
    case "bookingCancellations": 
      return "Be notified when a customer cancels a booking";
    case "messages": 
      return "Receive notifications for new messages from customers";
    case "reviews": 
      return "Be notified when customers leave reviews for your services";
    case "promotions": 
      return "Receive promotional content and platform updates";
    default:
      return "";
  }
}