'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Box, 
  Wand2, 
  Gift, 
  RotateCcw, 
  Palette, 
  Clock, 
  Camera
} from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-white border-b border-slate-200">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-mono font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-spin" />
          <span>Process Transparency • ช่างปั้นแบบ 3D มืออาชีพ & โรงงานพิมพ์มาตรฐาน</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] max-w-4xl mx-auto">
          สั่งทำชิ้นงาน <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">3D ตามสั่ง</span> ช่างเขียนแบบ ตรวจแก้ได้ 3 ครั้ง
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto">
          เพียงบอกสิ่งที่คุณต้องการ ช่างฝีมือของเราจะปั้นแบบ 3D ให้คุณตรวจร่าง 3 รอบ <span className="text-amber-600 font-bold">(มัดจำ 300฿ คืนเงินได้ถึงรอบที่ 2)</span> พร้อมผลิตด้วยเรซิน 8K หรือคาร์บอนไฟเบอร์ จัดส่งถึงบ้านใน <span className="text-emerald-600 font-bold">14 วัน การันตีคืนเงิน 100%</span>
        </p>

        {/* 3 Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto text-left">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-violet-300 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <Palette className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900">ช่างเขียนแบบ 3D (แก้ได้ 3 ครั้ง)</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              ปั้นตามรูปถ่ายหรือคำอธิบาย ส่งภาพแบบร่างให้ตรวจแก้ได้ถึง 3 รอบ
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2 hover:border-amber-300 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-amber-950">มัดจำ 300฿ (คืนเงินได้ถึงรอบ 2)</div>
            <p className="text-xs text-amber-800 leading-relaxed">
              หากไม่พอใจในรอบที่ 2 ขอคืนเงินมัดจำได้ 100% (ถ้ายืนยัน นำไปหักลบค่าพิมพ์)
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Gift className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-emerald-950">รับ Cashback 300฿ คืน</div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              เมื่อได้รับสินค้าแล้ว ถ่ายรูปส่งรีวิว รับเงินคืน 300 บาทโอนเข้าบัญชีทันที
            </p>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/request-print"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2.5 group"
          >
            <Wand2 className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span>สั่งทำและพิมพ์ชิ้นงาน 3D</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/free-stl"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Box className="w-4 h-4 text-slate-500" />
            <span>คลังโมเดล STL ฟรี</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
