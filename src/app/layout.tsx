import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "3DMan Thailand - บริการสั่งทำและพิมพ์ชิ้นงาน 3D ครบวงจร โปร่งใสทุกขั้นตอน",
  description: "บริการสั่งทำชิ้นงาน 3D ช่างเขียนแบบเฉพาะคุณ ตรวจแก้ได้ 3 ครั้ง มัดจำเริ่มงาน 300 บาท (คืนเงินได้) พร้อมผลิตด้วยเรซิน 8K และรับ Cashback 300 บาทเมื่อส่งรูปรีวิว",
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
