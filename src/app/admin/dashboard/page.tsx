
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, LogOut, LayoutDashboard, Building2, DollarSign, MapPin, Maximize, Bed, Bath, Sparkles, Loader2, ShieldAlert, Key, Tag, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { generatePropertyDescription } from '@/ai/flows/ai-property-description-generation';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase, useCollection, deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';

const MASTER_ADMIN_EMAIL = 'jordankatie767@gmail.com';

export default function AdminDashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const adminRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'admin_users', user.uid);
  }, [db, user]);
  
  const { data: adminData, isLoading: isAdminDataLoading } = useDoc(adminRef);

  const isMasterAdmin = user?.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  const isAuthorized = !!adminData || isMasterAdmin;

  const propertiesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'property_listings');
  }, [db]);

  const { data: firestoreProperties, isLoading: isPropertiesLoading } = useCollection(propertiesRef);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [activeTab, setActiveTab] = useState<PropertyType | 'all'>('Buy');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isUserLoading && !isAdminDataLoading && user && !isAuthorized) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You are not authorized to access the admin dashboard.",
      });
      if (auth) signOut(auth);
      router.push('/admin/login');
    }
  }, [user, isAuthorized, isUserLoading, isAdminDataLoading, router, auth]);

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
    const list = Array.isArray(firestoreProperties) ? firestoreProperties : [];
    return list.filter(p => {
      const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || p.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [firestoreProperties, searchQuery, activeTab]);

  const handleDelete = (id: string) => {
    if (!db) return;
    if (confirm('Are you sure you want to delete this listing permanently?')) {
      const docRef = doc(db, 'property_listings', id);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Listing Deleted",
        description: "The property has been successfully removed from the inventory.",
      });
    }
  };

  const handleAiGenerate = async () => {
    if (!editingProperty?.title || !editingProperty?.location) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a title and location for AI generation.",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await generatePropertyDescription({
        propertyType: editingProperty.category || 'Residential',
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
        description: "AI Listing Assistant has updated the description.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "The listing assistant is busy. Please try manual entry.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!db || !user) return;
    if (!editingProperty?.title || !editingProperty?.price || !editingProperty?.type) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title, Price, and Listing Type are required.",
      });
      return;
    }

    const payload = {
      ...editingProperty,
      adminId: user.uid,
      lastUpdatedDate: new Date().toISOString(),
      status: editingProperty.status || 'Available',
    };

    if (editingProperty?.id) {
      const docRef = doc(db, 'property_listings', editingProperty.id);
      setDocumentNonBlocking(docRef, payload, { merge: true });
    } else {
      const colRef = collection(db, 'property_listings');
      addDocumentNonBlocking(colRef, {
        ...payload,
        listingDate: new Date().toISOString(),
        imageUrl: editingProperty.imageUrl || `https://picsum.photos/seed/${Math.random()}/1200/800`,
      });
    }

    setIsDialogOpen(false);
    setEditingProperty(null);
    toast({
      title: "Property Saved",
      description: editingProperty?.id ? "The listing has been updated." : "New property added successfully.",
    });
  };

  if (isUserLoading || isAdminDataLoading || isPropertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Synchronizing Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl shadow-2xl border">
          <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary font-headline">Unauthorized Access</h1>
            <p className="text-muted-foreground">You are not authorized to access the admin dashboard.</p>
          </div>
          <Button className="w-full" onClick={() => router.push('/admin/login')}>Return to Login</Button>
        </div>
      </div>
    );
  }

  const salesCount = firestoreProperties?.filter(p => p.type === 'Buy').length || 0;
  const rentalsCount = firestoreProperties?.filter(p => p.type === 'Rent').length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
            <LayoutDashboard className="w-4 h-4" /> Secure Property Management
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">Listing Inventory</h1>
          <p className="text-sm text-muted-foreground">Logged in as: {adminData?.fullName || user.email}</p>
        </div>
        
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProperty({ type: activeTab === 'all' ? 'Buy' : activeTab, amenities: [], bedrooms: 1, bathrooms: 1 })} className="h-12 px-6 font-bold gap-2 shadow-xl shadow-primary/10">
                <Plus className="w-5 h-5" /> Create New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">
                  {editingProperty?.id ? 'Modify Property' : 'Publish New Listing'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Transaction Type
                    </label>
                    <Select 
                      value={editingProperty?.type} 
                      onValueChange={(val: PropertyType) => setEditingProperty(prev => ({ ...prev, type: val }))}
                    >
                      <SelectTrigger className="h-12 border-primary/20 bg-primary/5">
                        <SelectValue placeholder="Select Listing Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buy">For Sale (Direct Purchase)</SelectItem>
                        <SelectItem value="Rent">For Rent (Monthly Lease)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Style/Category</label>
                      <Input 
                        value={editingProperty?.category || ''} 
                        onChange={e => setEditingProperty(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. Mansion" 
                        className="h-12"
                      />
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> {editingProperty?.type === 'Rent' ? 'Monthly Rent' : 'Selling Price'}
                      </label>
                      <Input 
                        value={editingProperty?.price || ''} 
                        onChange={e => setEditingProperty(prev => ({ ...prev, price: e.target.value }))}
                        placeholder={editingProperty?.type === 'Rent' ? '$2,500/mo' : '$450,000'} 
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
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description (AI Assisted)</label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-[11px] font-bold gap-1 border-secondary text-primary hover:bg-secondary/10"
                        onClick={handleAiGenerate}
                        disabled={isAiLoading}
                      >
                        {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Auto-Write
                      </Button>
                    </div>
                    <Textarea 
                      value={editingProperty?.description || ''} 
                      onChange={e => setEditingProperty(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the property features..."
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
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-bold">Cancel</Button>
                <Button onClick={handleSave} className="font-bold px-10">Confirm & Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="Buy" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-14 w-full md:w-auto">
            <TabsTrigger value="Buy" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Tag className="w-4 h-4 mr-2" /> For Sale ({salesCount})
            </TabsTrigger>
            <TabsTrigger value="Rent" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-secondary data-[state=active]:text-primary">
              <Key className="w-4 h-4 mr-2" /> For Rent ({rentalsCount})
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-muted data-[state=active]:text-primary">
              <ClipboardList className="w-4 h-4 mr-2" /> All Inventory
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search listings..." 
              className="pl-10 h-14 rounded-2xl border-none bg-white shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="bg-white rounded-3xl shadow-xl overflow-hidden border mt-0 ring-0 focus-visible:ring-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold w-[40%]">Property Details</TableHead>
                <TableHead className="font-bold">Listing Type</TableHead>
                <TableHead className="font-bold">Price/Rent</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length > 0 ? filteredProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border shadow-sm">
                        <Image 
                          src={property.imageUrl || `https://picsum.photos/seed/${property.id}/200/200`} 
                          alt={property.title} 
                          fill 
                          className="object-cover" 
                        />
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
                    {property.type === 'Buy' ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" /> FOR SALE
                      </Badge>
                    ) : (
                      <Badge className="bg-secondary/20 text-primary border-secondary/20 hover:bg-secondary/30 flex items-center gap-1 w-fit">
                        <Key className="w-3 h-3" /> FOR RENT
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-sm text-primary">
                    {property.price}
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
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="w-10 h-10 opacity-20" />
                      <p className="font-medium">No {activeTab === 'all' ? '' : activeTab.toLowerCase()} listings found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div className="mt-12 flex justify-center">
        <Button 
          variant="outline" 
          className="text-muted-foreground gap-2 border-dashed border-2 px-8 h-12" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Finalize Session
        </Button>
      </div>
    </div>
  );
}
