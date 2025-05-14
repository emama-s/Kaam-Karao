import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for services
const mockServices = [
  {
    id: "s1",
    title: "Plumbing Services",
    description: "Professional plumbing services including repairs, installations, and maintenance.",
    category: "Home Services",
    price: 600,
    priceType: "hourly",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D",
    status: "active"
  },
  {
    id: "s2",
    title: "Electrical Repairs",
    description: "All types of electrical repairs and installations for residential and commercial properties.",
    category: "Home Services",
    price: 800,
    priceType: "hourly",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D",
    status: "active"
  },
  {
    id: "s3",
    title: "AC Servicing",
    description: "Complete air conditioner service, repair, and installation services.",
    category: "Home Services",
    price: 1200,
    priceType: "fixed",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWlyJTIwY29uZGl0aW9uZXJ8ZW58MHx8MHx8fDA%3D",
    status: "inactive"
  }
];

export default function MyServicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState(mockServices);

  const handleDeleteService = (id: string) => {
    toast({
      title: "Service deleted",
      description: "The service has been successfully deleted.",
    });
    setServices(services.filter(service => service.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const newStatus = service.status === "active" ? "inactive" : "active";
        toast({
          title: `Service ${newStatus}`,
          description: `The service is now ${newStatus}.`,
        });
        return { ...service, status: newStatus };
      }
      return service;
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
          <Button size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" /> Add New Service
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Card key={service.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{service.title}</CardTitle>
                  <Badge variant={service.status === "active" ? "default" : "outline"}>
                    {service.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{service.category} in {service.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-sm">
                  {service.description.length > 100 
                    ? `${service.description.substring(0, 100)}...` 
                    : service.description}
                </div>
                <div className="font-semibold">
                  ₹{service.price} <span className="text-sm font-normal text-muted-foreground">
                    / {service.priceType === "hourly" ? "hour" : "service"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {services.length === 0 && (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">You haven't added any services yet</p>
              <Button variant="link" className="mt-2 gap-2">
                <PlusCircle className="h-4 w-4" /> Add your first service
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}