'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

const clerkKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_dGVzdGluZy5jbGVyay5hY2NvdW50cy5kZXYk';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white rounded-xl',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
