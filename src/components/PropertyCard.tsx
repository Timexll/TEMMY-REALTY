
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Move, MapPin, Tag } from 'lucide-react';
import { Property } from '@/app/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            data-ai-hint="property house"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={property.type === 'Buy' ? 'default' : 'secondary'} className="font-bold">
              {property.type.toUpperCase()}
            </Badge>
            {property.featured && (
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-none font-bold text-primary">
                FEATURED
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg font-bold shadow-lg">
            {property.price}
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
            <MapPin className="w-3 h-3" />
            {property.location}
          </div>
          <h3 className="font-headline font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {property.description}
          </p>
        </CardContent>
        <CardFooter className="px-5 py-4 border-t bg-muted/20 flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-primary" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-primary" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          </div>
          {property.sqft && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Move className="w-4 h-4" />
              <span>{property.sqft} sqft</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
