
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { Service } from "@/context/ServiceContext";
import { useState } from "react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [favorited, setFavorited] = useState(false);
  
  const {
    id,
    title,
    description,
    price,
    providerName,
    providerAvatar,
    rating,
    reviewCount,
    location,
    images
  } = service;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/services/${id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={images[0]} 
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleFavorite}
            className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart 
              className={favorited ? "fill-destructive text-destructive" : "text-muted-foreground"} 
              size={18} 
            />
          </Button>
        </div>
        
        <CardHeader className="px-4 py-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline" className="text-primary">₹{price}/hr</Badge>
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({reviewCount} reviews)</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 py-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={providerAvatar} />
              <AvatarFallback>{getInitials(providerName)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{providerName}</span>
          </div>
          <div className="text-xs text-muted-foreground">{location}</div>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default ServiceCard;
