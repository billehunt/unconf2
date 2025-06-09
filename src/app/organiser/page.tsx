'use client';

import { useState, useEffect } from 'react';
import { OrganiserWizard } from '@/components/organiser-wizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, LogIn, LogOut } from 'lucide-react';
import { validateAdminPassword, ADMIN_STORAGE_KEY } from '@/lib/auth';
import Link from 'next/link';

export default function OrganiserPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  }, []);

  const handleLogin = () => {
    setError('');
    
    if (validateAdminPassword(password)) {
      const adminSession = {
        isAdmin: true,
        timestamp: Date.now(),
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
      }
      
      setIsAdmin(true);
      setPassword('');
    } else {
      setError('Invalid admin password');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    setIsAdmin(false);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/events" className="text-blue-600 hover:text-blue-800">
              ← Back to Events
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <h1 className="text-2xl font-bold">Admin Access Required</h1>
              
              <div className="flex items-center justify-center">
                <Shield className="w-12 h-12 text-gray-400" />
              </div>
              
              <p>Only administrators can create events.</p>
              
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password (1106)"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>
                <Button onClick={handleLogin} disabled={!password}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In as Admin
                </Button>
                <p className="text-sm text-gray-600">Default password: 1106</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
  );
} 