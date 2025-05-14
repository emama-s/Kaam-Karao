import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { serviceApi } from "@/services/api";
import { ArrowLeft, Loader2, ImagePlus } from "lucide-react";

// Service categories
const SERVICE_CATEGORIES = [
  "Home Services",
  "Repair & Maintenance",
  "Cleaning",
  "Electrician",
  "Plumbing",
  "Painting",
  "Carpentry",
  "Education",
  "Beauty & Wellness",
  "Pet Care",
  "Other"
];

export default function AddServicePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "hourly",
    location: "",
    image: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" });
      return;
    }
    
    if (!formData.category) {
      toast({ title: "Error", description: "Category is required", variant: "destructive" });
      return;
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast({ title: "Error", description: "Please enter a valid price", variant: "destructive" });
      return;
    }
    
    if (!formData.location.trim()) {
      toast({ title: "Error", description: "Location is required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object to handle file upload
      const serviceFormData = new FormData();
      serviceFormData.append("title", formData.title);
      serviceFormData.append("description", formData.description);
      serviceFormData.append("category", formData.category);
      serviceFormData.append("price", formData.price);
      serviceFormData.append("priceType", formData.priceType);
      serviceFormData.append("location", formData.location);
      
      if (formData.image) {
        serviceFormData.append("image", formData.image);
      }

      await serviceApi.createService(serviceFormData);
      
      toast({
        title: "Service created",
        description: "Your service has been created successfully",
      });
      
      navigate("/dashboard/services");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard/services")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
            <p className="text-muted-foreground">Create a new service to offer to customers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Professional Plumbing Service"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleChange} 
                    placeholder="e.g. 500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceType">Price Type *</Label>
                  <Select 
                    value={formData.priceType} 
                    onValueChange={(value) => handleSelectChange("priceType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Service Image</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {formData.image ? "Change Image" : "Upload Image"}
                    </Button>
                    <Input 
                      id="image" 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4 h-32 w-32 overflow-hidden rounded border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={5}
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Describe your service in detail"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/services")}
                  className="mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Service"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}