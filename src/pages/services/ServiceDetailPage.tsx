
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useService } from "@/context/ServiceContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { BookingForm } from "@/components/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getServiceById } = useService();
  const [service, setService] = useState(id ? getServiceById(id) : undefined);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");
  
  useEffect(() => {
    if (id) {
      const serviceData = getServiceById(id);
      if (serviceData) {
        setService(serviceData);
      }
    }
  }, [id, getServiceById]);

  if (!service) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="mb-6">The service you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-6">
              {/* Service Images */}
              <div className="relative rounded-lg overflow-hidden h-80 bg-muted">
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Title and Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{service.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{service.rating}</span>
                        <span className="ml-1 text-muted-foreground">
                          ({service.reviewCount} reviews)
                        </span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.location}
                      </div>
                    </div>
                  </div>
                  <Badge className="text-lg py-1.5">₹{service.price}/hr</Badge>
                </div>
              </div>

              {/* Tabs for Description and Reviews */}
              <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-lg">{service.description}</p>
                    <h3 className="text-xl font-semibold mt-6 mb-3">Service Details</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Professional and experienced service provider</li>
                      <li>All necessary tools and equipment provided</li>
                      <li>Satisfaction guaranteed or money back</li>
                      <li>Available for emergency services</li>
                      <li>Fully insured and licensed</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-6">
                  <div className="space-y-6">
                    {service.reviewCount > 0 ? (
                      <>
                        <div className="space-y-4">
                          <Card className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
                                <AvatarFallback>RK</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Rahul Kumar</p>
                                    <div className="flex items-center mt-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">2 weeks ago</span>
                                </div>
                                <p className="mt-2">
                                  Excellent service! The provider was punctual, professional, and did a great job. Would definitely hire again.
                                </p>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
                                <AvatarFallback>SP</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Sanya Patel</p>
                                    <div className="flex items-center mt-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <Star className="h-4 w-4 text-gray-300" />
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">1 month ago</span>
                                </div>
                                <p className="mt-2">
                                  Good service overall. Arrived on time and completed the job efficiently. Only minor issue was some cleanup that had to be done afterward.
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>
                        <div className="text-center">
                          <Button variant="outline">Load More Reviews</Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No reviews for this service yet
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Provider Info */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">About the Provider</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.providerAvatar} />
                    <AvatarFallback>{getInitials(service.providerName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-lg">{service.providerName}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">{service.rating} Rating</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Member since January 2023
                    </p>
                  </div>
                </div>
                <p className="mt-4">
                  Professional service provider with over 5 years of experience. Dedicated to providing high-quality service and customer satisfaction.
                </p>
                <div className="mt-4">
                  <Button variant="outline">View Profile</Button>
                  <Button variant="secondary" className="ml-3">Contact</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:sticky md:top-20 h-fit">
            <BookingForm service={service} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ServiceDetailPage;
