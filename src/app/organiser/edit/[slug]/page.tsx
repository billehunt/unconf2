'use client';

import { useState, useEffect } from 'react';
import { AdminAuthModal } from '@/components/admin-auth-modal';
import { ADMIN_STORAGE_KEY } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventEditPageProps {
  params: { slug: string };
}

export default function EventEditPage({ params }: EventEditPageProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (mounted && !isAdmin) {
      setShowAdminAuth(true);
    }
  }, [mounted, isAdmin]);

  const checkAdminStatus = () => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          if (session.isAdmin && session.timestamp && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
            setIsAdmin(true);
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    }
  };

  const handleAdminSuccess = () => {
    setShowAdminAuth(false);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    setIsAdmin(false);
    router.push('/events');
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <AdminAuthModal
        isOpen={showAdminAuth}
        onClose={() => router.push('/events')}
        onSuccess={handleAdminSuccess}
        title="Edit Event"
        description="Editing events requires administrator privileges"
      />
    );
  }

  return (
    <>
      {/* Admin Banner */}
      <div className="bg-green-100 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                Admin Mode Active - Editing Event
              </span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Edit Event: {params.slug}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Event editing interface for {params.slug}
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
              <p className="text-blue-800 dark:text-blue-200">
                🚧 Event editing interface is being developed. 
                This is a protected admin area for event: {params.slug}
              </p>
            </div>

            <div className="flex justify-between">
              <Link href="/events" className="text-blue-600 hover:text-blue-800">
                ← Back to Events
              </Link>
              <Link href="/organiser" className="text-blue-600 hover:text-blue-800">
                Create New Event →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
