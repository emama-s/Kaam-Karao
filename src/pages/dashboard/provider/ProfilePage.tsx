import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Extended mock data for the provider profile
  const [profile, setProfile] = useState({
    name: user?.name || "Mary Provider",
    email: user?.email || "provider@example.com",
    phone: "+91 9876543210",
    address: "123 Service Street, Mumbai, Maharashtra",
    bio: "I am a professional service provider with over 10 years of experience. Specializing in electrical repairs and installations for residential and commercial properties.",
    profileImage: user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    businessName: "ElectroPro Services",
    businessCategory: "Electrical Services",
    location: "Mumbai",
    serviceArea: ["Mumbai", "Thane", "Navi Mumbai"],
    experience: "10 years",
    qualifications: ["Certified Electrician", "Safety Compliance Certificate"],
    languages: ["English", "Hindi", "Marathi"],
    workingHours: {
      monday: { start: "09:00", end: "18:00", isWorking: true },
      tuesday: { start: "09:00", end: "18:00", isWorking: true },
      wednesday: { start: "09:00", end: "18:00", isWorking: true },
      thursday: { start: "09:00", end: "18:00", isWorking: true },
      friday: { start: "09:00", end: "18:00", isWorking: true },
      saturday: { start: "10:00", end: "15:00", isWorking: true },
      sunday: { start: "00:00", end: "00:00", isWorking: false },
    },
    bankDetails: {
      accountName: "Mary Provider",
      accountNumber: "XXXX-XXXX-1234",
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal and business information
            </p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="business">Business Details</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          </TabsList>
          
          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>This is how customers will recognize you</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profileImage} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline">Upload New Photo</Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={isEditing ? formData.name : profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={isEditing ? formData.email : profile.email}
                      onChange={handleInputChange}
                      disabled={true} // Email is usually not editable
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={isEditing ? formData.phone : profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={isEditing ? formData.address : profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={isEditing ? formData.bio : profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Business Details Tab */}
          <TabsContent value="business" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Tell customers about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={isEditing ? formData.businessName : profile.businessName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Business Category</Label>
                    <Input
                      id="businessCategory"
                      name="businessCategory"
                      value={isEditing ? formData.businessCategory : profile.businessCategory}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={isEditing ? formData.location : profile.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={isEditing ? formData.experience : profile.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Service Areas</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.serviceArea.map((area) => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" className="h-7">+ Add</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Qualifications & Certifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.qualifications.map((qualification) => (
                      <Badge key={qualification} variant="outline">{qualification}</Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" className="h-7">+ Add</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language) => (
                      <Badge key={language} variant="outline">{language}</Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" className="h-7">+ Add</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Set your availability for bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(profile.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b">
                      <div className="font-medium capitalize">{day}</div>
                      <div className="flex items-center gap-4">
                        {hours.isWorking ? (
                          <div className="text-sm">
                            {hours.start} - {hours.end}
                          </div>
                        ) : (
                          <Badge variant="outline">Not Available</Badge>
                        )}
                        {isEditing && (
                          <Button variant="ghost" size="sm">Edit</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings Tab */}
          <TabsContent value="payment" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>Update your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      value={profile.bankDetails.accountName}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={profile.bankDetails.accountNumber}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={profile.bankDetails.bankName}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={profile.bankDetails.ifscCode}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure. Account details are only used for processing payments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}