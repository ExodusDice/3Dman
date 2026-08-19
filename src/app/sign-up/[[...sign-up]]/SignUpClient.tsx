'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpClient() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto shadow-xl rounded-3xl',
            card: 'rounded-3xl border border-slate-200 shadow-sm bg-white',
            formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white rounded-xl',
          },
        }}
      />
    </div>
  );
}
