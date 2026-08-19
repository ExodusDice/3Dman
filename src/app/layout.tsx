import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "3DMan Thailand - บริการสร้างโมเดล 3D ด้วย AI & ผลิตพิมพ์ชิ้นงานจริงครบวงจร",
  description: "ปั้นโมเดล 3D ด้วย Meshy AI หมุนดูได้ 360 องศา เลือกวัสดุเรซิน 8K คาร์บอนไฟเบอร์ หรือทองสัมฤทธิ์หล่อแท้ พร้อมจัดส่งถึงบ้านในไทยภายใน 14 วัน รับประกันคืนเงิน 100%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="th" className="light">
        <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </html>
    </AuthProvider>
  );
}
