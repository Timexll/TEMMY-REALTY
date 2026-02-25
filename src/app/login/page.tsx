"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

export default function PublicLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);

    if (isRegistering) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    
    // Fallback to stop loading if something goes wrong
    setTimeout(() => setIsLoading(false), 5000);
  };

  // Create user profile on successful registration
  useEffect(() => {
    if (user && isRegistering && db) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        fullName: fullName || 'New User',
        email: user.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      
      toast({
        title: "Welcome to Temmy Realty",
        description: "Your account has been created successfully.",
      });
      setIsLoading(false);
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-muted/20">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="space-y-2 pt-10 text-center">
          <CardTitle className="text-3xl font-headline font-bold">
            {isRegistering ? 'Join Temmy Realty' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isRegistering 
              ? 'Create an account to find your perfect home' 
              : 'Sign in to access your saved properties and inquiries'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    required 
                    className="h-12 pl-12 bg-muted/30 border-none" 
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  required 
                  className="h-12 pl-12 bg-muted/30 border-none" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
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
            <Button className="w-full h-12 font-bold text-lg mt-6 shadow-xl shadow-primary/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            {isRegistering ? 'Already have an account?' : 'Don\'t have an account yet?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1 font-bold text-primary hover:underline"
            >
              {isRegistering ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}