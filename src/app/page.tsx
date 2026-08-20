'use client';

import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import RunningProductsMarquee from '@/components/RunningProductsMarquee';
import ServiceExplainer from '@/components/ServiceExplainer';
import GalleryShowcase from '@/components/GalleryShowcase';
import { Sparkles, ShieldCheck, Box, Layers, DollarSign, CheckCircle2, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 bg-slate-50 text-slate-900">
      {/* 1. Hero Section with 360 3D Model */}
      <HeroSection />

      {/* 2. Seamless Running Marquee of Meshy AI Generated 3D Products */}
      <RunningProductsMarquee />

      {/* 3. Full Service & Cost Explainer (We print & ship full service) */}
      <ServiceExplainer />

      {/* 4. Verified Customer Showcase & Reviews (Legit website social proof) */}
      <GalleryShowcase />

      {/* 5. SLA 14-Day Delivery Guarantee Hero Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>คำมั่นสัญญาคุณภาพและความรวดเร็วจาก 3DMan</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  รับประกันจัดส่ง SLA 14 วัน หรือคืนเงิน 100% เต็มจำนวน
                </h2>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  เราการันตีความแม่นยำในการผลิตและการจัดส่งที่รวดเร็ว ทันทีที่คุณยืนยันแบบ 3D และชำระเงินผ่านระบบ Stripe ชิ้นงานจริงจะถูกพิมพ์ ขัดแต่ง อบแสง UV และส่งถึงบ้านคุณภายใน 14 วันทำการ หากล่าช้าแม้แต่วันเดียว คุณจะได้รับเงินคืน 100% เต็มจำนวนทันที
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ติดตามสถานะพัสดุเรียลไทม์</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ตรวจสอบมิติชิ้นงานละเอียด</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ปรับแต่งแบบได้ 3 ครั้ง</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/90 rounded-2xl border border-emerald-200 text-center space-y-3 shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="font-extrabold text-lg text-slate-900">รับประกัน 100%</div>
                <div className="text-xs text-slate-500">ส่งตรงเวลาใน 14 วัน หรือคืนเงินทันที</div>
                <Link
                  href="/sla-guarantee"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  อ่านเงื่อนไข SLA ทั้งหมด
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="py-16 text-center bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            พร้อมที่จะเปลี่ยนจินตนาการ 3D สู่ชิ้นงานจริงแล้วหรือยัง?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            ส่งคำขอสั่งทำชิ้นงาน 3D ให้ช่างเขียนแบบได้ทันที มัดจำเพียง 300 บาท (ตรวจแก้ได้ 3 ครั้ง คืนเงินได้ถึงรอบที่ 2)
          </p>
          <div className="pt-2">
            <Link
              href="/request-print"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>ส่งคำขอสั่งทำชิ้นงาน 3D ทันที</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
