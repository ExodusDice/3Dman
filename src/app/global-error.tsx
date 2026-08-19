'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="th">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">เกิดข้อผิดพลาดของระบบ</h2>
          <p className="text-xs text-slate-600">
            ระบบได้บันทึกรายงานข้อผิดพลาดไปยัง Sentry เรียบร้อยแล้ว ทีมวิศวกรกำลังเข้าตรวจสอบ
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs"
            >
              ลองใหม่อีกครั้ง
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
