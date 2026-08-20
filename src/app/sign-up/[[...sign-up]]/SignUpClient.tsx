'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isRealClerkKey =
  Boolean(clerkKey) &&
  clerkKey.startsWith('pk_test_') &&
  !clerkKey.includes('mock') &&
  !clerkKey.includes('Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA');

export default function SignUpClient() {
  if (isRealClerkKey) {
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600 mx-auto shadow-sm">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-900">ลงทะเบียนสมาชิก 3DMan</h2>
          <p className="text-xs text-slate-500">
            คุณสามารถทดลองปั้นโมเดล 3D และสั่งพิมพ์ได้ทันทีโดยไม่ต้องลงทะเบียน
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/request-print"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>เริ่มต้นส่งคำขอสั่งทำ 3D ได้ทันที</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
