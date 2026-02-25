
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Handles the base /admin route by redirecting to the dashboard.
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground font-medium">
        Redirecting to dashboard...
      </div>
    </div>
  );
}
