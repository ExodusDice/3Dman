'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DirectChat from '@/components/DirectChat';
import { Box, Sparkles, ShieldCheck, Heart, MessageSquare } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-violet-500 selection:text-white">
      <Navbar onOpenChat={() => setIsChatOpen(true)} unreadChatCount={1} />

      <main className="flex-1">
        {children}
      </main>

      {/* Direct Live Chat Drawer */}
      <DirectChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-xl shadow-violet-500/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group"
        title="แชทสดกับวิศวกรพิมพ์ 3D"
      >
        <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold hidden sm:inline">คุยกับช่าง 3D</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Global Thai Footer (Clean White Theme) */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5">
                  <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                    <Box className="w-4 h-4 text-violet-600" />
                  </div>
                </div>
                <span className="font-extrabold text-lg text-slate-900">3DMan Thailand</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                แพลตฟอร์มสร้างสรรค์งานประติมากรรม 3D ด้วยพลัง Meshy AI และบริการพิมพ์ชิ้นงานจริงด้วยเรซินความละเอียดสูง คาร์บอนไฟเบอร์ และทองสัมฤทธิ์หล่อแท้ พร้อมจัดส่งทั่วประเทศไทย
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">เมนูหลัก</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link href="/studio" className="hover:text-violet-600 transition-colors">สตูดิโอ 3D AI</Link></li>
                <li><Link href="/gallery" className="hover:text-violet-600 transition-colors">แกลเลอรีผลงานจริง</Link></li>
                <li><Link href="/sla-guarantee" className="hover:text-violet-600 transition-colors">การรับประกัน SLA 14 วัน</Link></li>
                <li><Link href="/orders" className="hover:text-violet-600 transition-colors">ติดตามคำสั่งซื้อ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">การรับประกันคุณภาพ</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>รับประกันส่งใน 14 วัน หรือคืนเงิน 100%</span>
                </li>
                <li><span>แก้ไขแบบได้ 3 ครั้งก่อนยืนยัน</span></li>
                <li><span>ความละเอียดชั้นพิมพ์ระดับ 25 ไมครอน</span></li>
                <li><span>ระบบชำระเงินปลอดภัย 256-bit Stripe</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">ระบบสำหรับแอดมิน</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/admin" className="text-amber-700 hover:underline font-semibold flex items-center gap-1">
                    <span>ระบบจัดการแอดมิน & วิเคราะห์กำไร</span>
                  </Link>
                </li>
                <li><span>ตรวจแบบและปรับราคาตามจริง</span></li>
                <li><span>สร้างคำสั่งซื้อด่วนให้ลูกค้า</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} 3DMan (Thailand) Co., Ltd. สงวนลิขสิทธิ์ทุกประการ ขับเคลื่อนด้วย Meshy AI & Three.js
            </div>
            <div className="flex items-center gap-1">
              <span>สร้างสรรค์เพื่อศิลปินดิจิทัลและนักสะสมงาน 3D ทั่วประเทศ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
