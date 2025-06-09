'use client';

import { useState, useEffect } from 'react';
import { OrganiserWizard } from '@/components/organiser-wizard';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminAuthModal } from '@/components/admin-auth-modal';
import { ADMIN_STORAGE_KEY } from '@/lib/auth';

export default function OrganiserPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

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
  };

  useEffect(() => {
    // Show admin auth modal if not admin and component is mounted
    if (mounted && !isAdmin) {
      setShowAdminAuth(true);
    }
  }, [mounted, isAdmin]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminAuthModal
        isOpen={showAdminAuth}
        onClose={() => window.history.back()}
        onSuccess={handleAdminSuccess}
        title="Create Event"
        description="Creating events requires administrator privileges"
      />

      {isAdmin && (
        <>
          {/* Admin Banner */}
          <div className="bg-green-100 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Admin Mode Active - Creating Event
                  </span>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out Admin
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Create Your Unconference Event
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Set up your event in 3 simple steps. We&apos;ll save your progress automatically.
              </p>
            </div>
            
            <OrganiserWizard />
          </div>
        </>
      )}
    </>
  );
} 