'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isRealClerkKey =
  Boolean(clerkKey) &&
  clerkKey.startsWith('pk_test_') &&
  !clerkKey.includes('mock') &&
  !clerkKey.includes('Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA');

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isRealClerkKey) {
    return <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>;
  }

  // Graceful standalone fallback when Clerk keys are not yet configured
  return <>{children}</>;
}
