
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);

    if (isRegistering) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    
    // We don't await here. The useUser hook will update automatically.
    // If registration is successful, the user profile creation is handled in the effect below.
    // If there is an error, the global FirebaseErrorListener handles it.
    
    // Reset loading after a delay if no user is found yet (error cases)
    setTimeout(() => setIsLoading(false), 3000);
  };

  // Effect to create admin record after successful registration
  useEffect(() => {
    if (user && isRegistering && db) {
      const adminRef = doc(db, 'admin_users', user.uid);
      setDocumentNonBlocking(adminRef, {
        id: user.uid,
        fullName: fullName || 'New Administrator',
        email: user.email,
        role: 'Administrator',
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
      }, { merge: true });
      
      toast({
        title: "Registration Successful",
        description: "Your administrator account has been created.",
      });
    }
  }, [user, isRegistering, db, fullName]);

  if (isUserLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-muted/20">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-3 bg-primary" />
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-bold">
              {isRegistering ? 'Admin Registration' : 'Admin Portal'}
            </CardTitle>
            <CardDescription className="text-base">
              Secure access for Temmy Realty authorized personnel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name" 
                    required 
                    className="h-12 pl-12 bg-muted/30 border-none" 
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@temmyrealty.com" 
                  required 
                  className="h-12 pl-12 bg-muted/30 border-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="h-12 pl-12 pr-12 bg-muted/30 border-none" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full h-12 font-bold text-lg mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Please wait...
                </>
              ) : (
                isRegistering ? 'Register Admin' : 'Sign In To Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-medium">Internal Use Only</span>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {isRegistering ? 'Already have an account?' : 'Need to register authorized personnel?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1 font-bold text-primary hover:underline"
            >
              {isRegistering ? 'Log In' : 'Register Here'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
