
"use client";

import { useState } from 'react';
import { PROPERTIES } from '@/app/lib/mock-data';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertySearch } from '@/components/PropertySearch';
import { Key } from 'lucide-react';

export default function RentPage() {
  const [listings, setListings] = useState(PROPERTIES.filter(p => p.type === 'Rent'));

  const handleSearch = (filters: { query: string; category: string; priceRange: string }) => {
    let filtered = PROPERTIES.filter(p => p.type === 'Rent');
    
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(p => {
        const numericPrice = parseInt(p.price.replace(/[^0-9]/g, ''));
        if (filters.priceRange === '0-2k') return numericPrice < 2000;
        if (filters.priceRange === '2k-4k') return numericPrice >= 2000 && numericPrice <= 4000;
        if (filters.priceRange === '4k+') return numericPrice > 4000;
        return true;
      });
    }

    setListings(filtered);
  };

  return (
    <div className="pb-20">
      <div className="bg-secondary pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-primary text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-primary font-bold text-xs tracking-widest uppercase mb-6">
            <Key className="w-4 h-4" />
            Quality Living Simplified
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Premium American Rentals</h1>
          <p className="text-primary/70 max-w-2xl mx-auto">Modern apartments, luxury condos, and cozy studios available for short and long-term rentals with 24/7 management support.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertySearch onSearch={handleSearch} type="Rent" />

        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-primary">{listings.length} Available Rentals</h2>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-secondary/40">
              <div className="max-w-md mx-auto space-y-4">
                <Key className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                <h3 className="text-2xl font-bold text-primary">No rentals found</h3>
                <p className="text-muted-foreground">We couldn't find any rentals matching your current filters. Try adjusting your search criteria or contact our rental assistance team.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
