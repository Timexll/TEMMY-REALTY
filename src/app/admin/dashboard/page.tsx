
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, LogOut, LayoutDashboard, Building2, DollarSign, MapPin, Maximize, Bed, Bath, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PROPERTIES as INITIAL_PROPERTIES } from '@/app/lib/mock-data';
import { Property, PropertyType } from '@/app/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { generatePropertyDescription } from '@/ai/flows/ai-property-description-generation';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);

  // Protection effect
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully signed out.",
      });
      router.push('/admin/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  const filteredProperties = useMemo(() => {
    const list = Array.isArray(properties) ? properties : [];
    return list.filter(p => 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [properties, searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setProperties(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Listing Deleted",
        description: "The property has been successfully removed from the system.",
      });
    }
  };

  const handleAiGenerate = async () => {
    if (!editingProperty?.title || !editingProperty?.location) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter at least a title and location for AI generation.",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await generatePropertyDescription({
        propertyType: editingProperty.category || editingProperty.type || 'Residential',
        location: editingProperty.location,
        bedrooms: editingProperty.bedrooms || 0,
        bathrooms: editingProperty.bathrooms || 0,
        price: editingProperty.price || 'Contact for price',
        amenities: editingProperty.amenities || ['Modern features'],
        descriptionHighlights: editingProperty.title
      });

      setEditingProperty(prev => ({ ...prev, description: result.description }));
      toast({
        title: "Description Generated",
        description: "AI Listing Assistant has updated the description field.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "The listing assistant is currently busy. Please try manual entry.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!editingProperty?.title || !editingProperty?.price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title and price are required fields.",
      });
      return;
    }

    if (editingProperty?.id) {
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? { ...p, ...editingProperty } as Property : p));
    } else {
      const newProperty = {
        ...editingProperty,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/800`,
        amenities: editingProperty.amenities || [],
      } as Property;
      setProperties(prev => [...prev, newProperty]);
    }
    setIsDialogOpen(false);
    setEditingProperty(null);
    toast({
      title: "Property Saved",
      description: editingProperty?.id ? "The listing has been updated." : "New property added successfully.",
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
            <LayoutDashboard className="w-4 h-4" /> Secure Admin Dashboard
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">Manage Listings</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProperty({ type: 'Buy', amenities: [], bedrooms: 1, bathrooms: 1 })} className="h-12 px-6 font-bold gap-2 shadow-xl shadow-primary/10">
              <Plus className="w-5 h-5" /> Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold">
                {editingProperty?.id ? 'Edit Listing Details' : 'Create New Listing'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Property Title
                  </label>
                  <Input 
                    value={editingProperty?.title || ''} 
                    onChange={e => setEditingProperty(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Modern Villa with Pool" 
                    className="h-12 border-muted"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Listing Type</label>
                    <Select 
                      value={editingProperty?.type} 
                      onValueChange={(val: PropertyType) => setEditingProperty(prev => ({ ...prev, type: val }))}
                    >
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buy">For Sale</SelectItem>
                        <SelectItem value="Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                    <Input 
                      value={editingProperty?.category || ''} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Modern Villa" 
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <Input 
                    value={editingProperty?.location || ''} 
                    onChange={e => setEditingProperty(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State" 
                    className="h-12"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-3 h-3" /> Price/Rent
                    </label>
                    <Input 
                      value={editingProperty?.price || ''} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="$0.00 or $0/mo" 
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Maximize className="w-3 h-3" /> Sq Ft
                    </label>
                    <Input 
                      type="number"
                      value={editingProperty?.sqft || ''} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, sqft: parseInt(e.target.value) || 0 }))}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Listing Description</label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-[11px] font-bold gap-1 border-secondary text-primary hover:bg-secondary/10"
                      onClick={handleAiGenerate}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea 
                    value={editingProperty?.description || ''} 
                    onChange={e => setEditingProperty(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Auto-generate or type a professional description..."
                    className="h-[188px] resize-none border-muted"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Bed className="w-3 h-3" /> Bedrooms
                    </label>
                    <Input 
                      type="number"
                      value={editingProperty?.bedrooms || 0} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Bath className="w-3 h-3" /> Bathrooms
                    </label>
                    <Input 
                      type="number"
                      value={editingProperty?.bathrooms || 0} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-6">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-bold">Discard</Button>
              <Button onClick={handleSave} className="font-bold px-10">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search properties by title or location..." 
              className="pl-10 h-10 border-none bg-white shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-xs font-bold uppercase text-muted-foreground">Total Listings</div>
              <div className="text-2xl font-bold text-primary">{properties.length}</div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-right">
              <div className="text-xs font-bold uppercase text-muted-foreground">Active Sales</div>
              <div className="text-2xl font-bold text-secondary">{properties.filter(p => p.type === 'Buy').length}</div>
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold w-[40%]">Property Information</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Value</TableHead>
              <TableHead className="font-bold">Inventory</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length > 0 ? filteredProperties.map((property) => (
              <TableRow key={property.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border shadow-sm">
                      <Image src={property.imageUrl} alt={property.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-primary">{property.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {property.location}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {property.type === 'Buy' ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">Sale</Badge>
                    ) : (
                      <Badge className="bg-secondary/20 text-primary border-none">Rent</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-sm text-primary">
                  {property.price}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
                    <Badge variant="outline" className="text-[10px] py-0.5 border-green-500 text-green-600 bg-green-50 w-fit">ACTIVE</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5"
                      onClick={() => {
                        setEditingProperty(property);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No properties match your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12 flex justify-center">
        <Button 
          variant="outline" 
          className="text-muted-foreground gap-2 border-dashed border-2 px-8 h-12" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Finalize Session & Log Out
        </Button>
      </div>
    </div>
  );
}
