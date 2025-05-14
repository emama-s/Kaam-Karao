import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { serviceApi, Service } from "@/services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyServicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  // Fetch services when component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceApi.getMyServices();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load services");
      toast({
        title: "Error",
        description: err.message || "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setIsDeleting(true);
    try {
      await serviceApi.deleteService(serviceToDelete);
      setServices(services.filter(service => service._id !== serviceToDelete));
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setServiceToDelete(null);
    }
  };

  const toggleServiceStatus = async (id: string) => {
    setIsTogglingStatus(id);
    try {
      const updatedService = await serviceApi.toggleServiceStatus(id);
      setServices(services.map(service => 
        service._id === id ? updatedService : service
      ));
      toast({
        title: `Service ${updatedService.status}`,
        description: `The service is now ${updatedService.status}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to toggle service status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingStatus(null);
    }
  };

  // Show loading state
  if (loading && services.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error && services.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button onClick={fetchServices} variant="outline" className="mt-4">
              Try again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => navigate("/dashboard/services/add")}>
            <PlusCircle className="h-4 w-4" /> Add New Service
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Card key={service._id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={service.image.startsWith('http') ? service.image : `http://localhost:5000${service.image}`} 
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2" 
                  onClick={() => navigate(`/dashboard/services/edit/${service._id}`)}
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleServiceStatus(service._id)}
                    disabled={isTogglingStatus === service._id}
                  >
                    {isTogglingStatus === service._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setServiceToDelete(service._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {services.length === 0 && !loading && (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">You haven't added any services yet</p>
              <Button 
                variant="link" 
                className="mt-2 gap-2"
                onClick={() => navigate("/dashboard/services/add")}
              >
                <PlusCircle className="h-4 w-4" /> Add your first service
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}