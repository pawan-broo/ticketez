'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.href,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            You need to be signed in to book tickets.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3 pt-4'>
          <Button onClick={handleGoogleSignIn} disabled={isLoading} size='lg'>
            {isLoading ? 'Loading...' : 'Continue with Google'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
