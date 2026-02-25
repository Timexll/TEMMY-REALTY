
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Bed, Bath, Move, MapPin, CheckCircle2, Phone, Mail, MessageCircle, Share2, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  
  const propertyRef = useMemoFirebase(() => {
    if (!db || typeof id !== 'string') return null;
    return doc(db, 'property_listings', id);
  }, [db, id]);

  const { data: property, isLoading } = useDoc(propertyRef);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="bg-muted/30 p-6 rounded-full">
          <MapPin className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-2xl font-bold text-primary">Property not found</h1>
        <p className="text-muted-foreground">This listing may have been removed or is currently unavailable.</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={property.imageUrl || `https://picsum.photos/seed/${property.id}/1200/800`}
                alt={property.title}
                fill
                className="object-cover"
                data-ai-hint="property detail"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge variant={property.type === 'Buy' ? 'default' : 'secondary'} className="h-8 px-4 font-bold text-sm">
                  {property.type === 'Buy' ? 'FOR SALE' : 'FOR RENT'}
                </Badge>
                {property.featured && (
                  <Badge className="h-8 px-4 font-bold text-sm bg-cyan-500 text-white border-none">
                    PREMIUM
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-muted-foreground font-medium">
                    <MapPin className="w-4 h-4" /> {property.location}
                  </div>
                  <h1 className="text-4xl font-headline font-bold text-primary">{property.title}</h1>
                  <Badge variant="outline" className="border-primary text-primary font-bold">
                    {property.category}
                  </Badge>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {property.type === 'Buy' ? 'Listing Price' : 'Monthly Rent'}
                  </div>
                  <div className="text-3xl font-headline font-bold text-primary">{property.price}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y py-8">
                <div className="text-center space-y-1">
                  <div className="flex justify-center"><Bed className="w-6 h-6 text-primary" /></div>
                  <div className="font-bold text-lg">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground uppercase">Bedrooms</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="flex justify-center"><Bath className="w-6 h-6 text-primary" /></div>
                  <div className="font-bold text-lg">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground uppercase">Bathrooms</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="flex justify-center"><Move className="w-6 h-6 text-primary" /></div>
                  <div className="font-bold text-lg">{property.sqft || '--'}</div>
                  <div className="text-xs text-muted-foreground uppercase">Square Feet</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold text-primary">Property Description</h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline font-bold text-primary">Key Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-none shadow-2xl overflow-hidden rounded-3xl">
              <div className="bg-primary p-8 text-white text-center">
                <h3 className="font-headline font-bold text-2xl mb-2">Interested?</h3>
                <p className="text-white/70 text-sm">Schedule an inspection with our professional agents today.</p>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Button className="w-full h-14 font-bold text-lg gap-3 bg-primary" onClick={() => window.open('tel:+12532999533')}>
                    <Phone className="w-5 h-5" /> Call Agent
                  </Button>
                  <Button variant="secondary" className="w-full h-14 font-bold text-lg gap-3" onClick={() => window.open('https://wa.me/12532999533')}>
                    <MessageCircle className="w-5 h-5" /> WhatsApp Us
                  </Button>
                  <Button variant="outline" className="w-full h-14 font-bold text-lg gap-3" onClick={() => window.open('mailto:Jordankatie767@gmail.com')}>
                    <Mail className="w-5 h-5" /> Email Inquiry
                  </Button>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="https://picsum.photos/seed/agent/100/100"
                        alt="Agent"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">Temmy Realty Agent</div>
                      <div className="text-xs text-muted-foreground">Certified Professional</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic text-center">
                    "We guarantee 24/7 support for all our rental properties and professional financing guidance for buyers."
                  </p>
                </div>
                
                <div className="flex justify-center gap-4 pt-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border"><Heart className="w-5 h-5 text-red-500" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border"><Share2 className="w-5 h-5" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
