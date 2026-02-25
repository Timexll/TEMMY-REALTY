
"use client";

import { useState } from 'react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertySearchProps {
  onSearch: (filters: { query: string; category: string; priceRange: string }) => void;
  type?: 'Buy' | 'Rent';
}

export const PropertySearch = ({ onSearch, type }: PropertySearchProps) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    'Modern Villa',
    'Suburban House',
    'Downtown Apartment',
    'Luxury Condo',
    'Waterfront Property',
    'Studio Flat',
    'Family Rental Home'
  ];

  const handleSearch = () => {
    onSearch({ query, category, priceRange });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border -mt-12 relative z-20 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="w-3 h-3" /> Location / Keyword
          </label>
          <Input
            placeholder="e.g. California, Modern..."
            className="h-12 bg-muted/30 border-none focus-visible:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Home className="w-3 h-3" /> Property Style
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 bg-muted/30 border-none focus:ring-primary">
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-3 h-3" /> Budget
          </label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="h-12 bg-muted/30 border-none focus:ring-primary">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              {type === 'Buy' ? (
                <>
                  <SelectItem value="0-500k">Under $500k</SelectItem>
                  <SelectItem value="500k-1m">$500k - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m+">$2M+</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="0-2k">Under $2,000/mo</SelectItem>
                  <SelectItem value="2k-4k">$2,000 - $4,000/mo</SelectItem>
                  <SelectItem value="4k+">$4,000+/mo</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button className="h-12 font-bold gap-2 text-lg shadow-lg" onClick={handleSearch}>
          <Search className="w-5 h-5" />
          Filter Results
        </Button>
      </div>
    </div>
  );
};
