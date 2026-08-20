'use client';

import React from 'react';
import Link from 'next/link';
import Viewer3D from '@/components/Viewer3D';
import { Sparkles, ShieldCheck, ArrowRight, Layers, CheckCircle2, Box, Flame, Wand2, Gift, RotateCcw } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-white border-b border-slate-200">
      {/* Background Decorative Glow Blobs for Light Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-mono font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-spin" />
              <span>Process Transparency • ช่างปั้นแบบ 3D มืออาชีพ & โรงงานพิมพ์มาตรฐาน</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2]">
              สั่งทำชิ้นงาน <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">3D ตามสั่ง</span> ช่างเขียนแบบ ตรวจแก้ได้ 3 ครั้ง
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              เพียงบอกสิ่งที่คุณต้องการ ช่างฝีมือของเราจะปั้นแบบ 3D ให้คุณตรวจร่าง 3 รอบ <span className="text-amber-600 font-bold">(มัดจำ 300฿ คืนเงินได้ถึงรอบที่ 2)</span> พร้อมผลิตด้วยเรซิน 8K หรือคาร์บอนไฟเบอร์ จัดส่งถึงบ้านใน <span className="text-emerald-600 font-bold">14 วัน การันตีคืนเงิน 100%</span>
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-emerald-800 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>รับประกัน SLA 14 วัน (คืนเงิน 100%)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-amber-800 shadow-sm">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>มัดจำ 300฿ คืนเงินได้ถึงรอบที่ 2</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-emerald-800 shadow-sm">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>รับ Cashback 300฿ เมื่อส่งรูปรีวิว</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
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

          {/* Right Column: Interactive 360° 3D Hero Sculpture (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[440px] sm:h-[500px] w-full rounded-3xl p-1 bg-gradient-to-b from-violet-200 via-white to-cyan-100 border border-slate-200 shadow-xl">
              <Viewer3D
                geometryInfo={{
                  shape: 'cyberpunk_helmet',
                  widthCm: 14,
                  heightCm: 18,
                  depthCm: 12,
                  infillPercent: 35,
                  triangleCount: 124000,
                }}
                material={{
                  id: 'petg_carbon_fiber',
                  name: 'คาร์บอนไฟเบอร์ PETG',
                  category: 'Specialty',
                  description: 'ผิวด้านสเตลธ์',
                  finish: 'Stealth Matte',
                  colorHex: '#1e293b',
                  densityGPerCm3: 1.35,
                  pricePerGram: 0.19,
                  durability: 5,
                  detailLevel: 4,
                  textureRoughness: 0.3,
                  textureMetalness: 0.2,
                }}
                autoRotate={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
