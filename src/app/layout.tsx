import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "3DMan Thailand - บริการสร้างโมเดล 3D ด้วย AI & ผลิตพิมพ์ชิ้นงานจริงครบวงจร",
  description: "ปั้นโมเดล 3D ด้วย Meshy AI หมุนดูได้ 360 องศา เลือกวัสดุเรซิน 8K คาร์บอนไฟเบอร์ หรือทองสัมฤทธิ์หล่อแท้ พร้อมจัดส่งถึงบ้านในไทยภายใน 14 วัน รับประกันคืนเงิน 100%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA';

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="th" className="light">
        <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
