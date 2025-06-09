'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, LogIn, X } from 'lucide-react';
import { validateAdminPassword, ADMIN_STORAGE_KEY } from '@/lib/auth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function AdminAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Admin Access Required",
  description = "This action requires administrator privileges"
}: AdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setIsSubmitting(true);
    setError('');
    
    if (validateAdminPassword(password)) {
      const adminSession = {
        isAdmin: true,
        timestamp: Date.now(),
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
      }
      
      setPassword('');
      onSuccess();
    } else {
      setError('Incorrect admin password');
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={isSubmitting}
                className={error ? 'border-red-500' : ''}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleLogin}
                disabled={isSubmitting || !password}
                className="flex-1 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Verifying...' : 'Continue'}
              </Button>
              <Button 
                onClick={handleClose}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                  Why do I need admin access?
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Event management actions are restricted to administrators to maintain event quality and prevent unauthorized changes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 