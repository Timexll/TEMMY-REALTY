
"use client";

import { useMemo, useState } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertySearch } from '@/components/PropertySearch';
import { Search, Building2, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function SearchPage() {
  const db = useFirestore();
  const [filters, setFilters] = useState({ query: '', category: 'all', priceRange: 'all' });

  const allPropsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'property_listings');
  }, [db]);

  const { data: properties, isLoading } = useCollection(allPropsRef);

  const filteredListings = useMemo(() => {
    if (!properties) return [];
    let list = [...properties];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(p => 
        (p.title || '').toLowerCase().includes(q) || 
        (p.location || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    
    if (filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }

    if (filters.priceRange !== 'all') {
      list = list.filter(p => {
        const numericPrice = parseInt((p.price || '').replace(/[^0-9]/g, ''));
        
        if (p.type === 'Buy') {
          if (filters.priceRange === '0-500k') return numericPrice < 500000;
          if (filters.priceRange === '500k-1m') return numericPrice >= 500000 && numericPrice <= 1000000;
          if (filters.priceRange === '1m-2m') return numericPrice >= 1000000 && numericPrice <= 2000000;
          if (filters.priceRange === '2m+') return numericPrice > 2000000;
        } else {
          if (filters.priceRange === '0-2k') return numericPrice < 2000;
          if (filters.priceRange === '2k-4k') return numericPrice >= 2000 && numericPrice <= 4000;
          if (filters.priceRange === '4k+') return numericPrice > 4000;
        }
        return true;
      });
    }

    return list;
  }, [properties, filters]);

  return (
    <div className="pb-20">
      <div className="bg-primary pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-bold text-xs tracking-widest uppercase mb-6">
            <Search className="w-4 h-4" />
            Global Property Search
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Find Any Home in America</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Search across all our premium sales and rental listings with advanced filtering options.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertySearch onSearch={setFilters} />

        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-primary">
              {isLoading ? 'Gathering Results...' : `${filteredListings.length} Results Found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map(property => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-primary/20">
              <div className="max-w-md mx-auto space-y-4">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                <h3 className="text-2xl font-bold text-primary">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search keywords to find what you're looking for.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
