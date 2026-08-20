'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isRealClerkKey =
  Boolean(clerkKey) &&
  clerkKey.startsWith('pk_test_') &&
  !clerkKey.includes('mock') &&
  !clerkKey.includes('Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA');

export default function SignInClient() {
  if (isRealClerkKey) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <SignIn
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 mx-auto shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-900">เข้าสู่ระบบ 3DMan</h2>
          <p className="text-xs text-slate-500">
            คุณสามารถเข้าใช้งานในโหมดผู้เยี่ยมชม (Guest Explorer) หรือเข้าสู่ระบบแอดมินได้ทันที
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/request-print"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>เข้าสู่หน้าส่งคำขอสั่งทำ 3D</span>
          </Link>

          <Link
            href="/admin"
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-amber-600" />
            <span>เข้าสู่ระบบคอนโซลแอดมิน (sadminwa)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
