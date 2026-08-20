'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, CheckCircle2, RotateCcw, AlertCircle, ArrowRight, Truck, Sparkles, Info } from 'lucide-react';

export default function SlaGuaranteePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>มาตรฐานคุ้มครองผู้สั่งซื้อสูงสุดในประเทศไทย</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          การรับประกันจัดส่ง SLA 14 วัน & คืนเงิน 100% เต็มจำนวน
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          ที่ 3DMan เราให้ความสำคัญกับความพึงพอใจและความโปร่งใสสูงสุด ทุกชิ้นงานสั่งพิมพ์ได้รับการคุ้มครองด้วยการตรวจสอบราคาจริงโดยวิศวกร และการันตีคืนเงิน 100% ทั้งก่อนเริ่มพิมพ์และกรณีจัดส่งเกิน 14 วัน
        </p>
      </div>

      {/* 4 Pillars of the Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">วิศวกรตรวจการสไลซ์</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ทีมงานจะตรวจโครงสร้างและตำแหน่งเสาค้ำ Support หากชิ้นงานมีความซับซ้อน แอดมินจะกำหนดราคาและ SLA จริงก่อนเริ่มพิมพ์
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">คืนเงินได้ก่อนเริ่มพิมพ์</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            คุณสามารถขอยกเลิกและรับเงินคืน 100% ได้ตลอดเวลาก่อนที่เครื่องพิมพ์ 3D จะเริ่มทำงานโดยไม่มีค่าธรรมเนียมใดๆ
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">ส่งถึงบ้านใน 14 วัน</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            นับจากวันที่อนุมัติแบบ ชิ้นงานจะถูกผลิต ขัดแต่ง อบแสง UV ตรวจสอบ QA และส่งถึงบ้านคุณภายใน 14 วันทำการ
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">ยืนยันคุณภาพเมื่อรับของ</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ลูกค้ายืนยันว่าชิ้นงานจริงตรงตามแบบ 3D และให้คะแนนความพึงพอใจ เพื่อเสร็จสิ้นคำสั่งซื้ออย่างสมบูรณ์แบบ
          </p>
        </div>
      </div>

      {/* Detailed SLA Terms Accordion / Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span>เงื่อนไขและรายละเอียดมาตรฐานการบริการ (SLA Policy)</span>
        </h2>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">1. ขั้นตอนที่ 1: การตรวจทานทางวิศวกรรม & กำหนดราคาสุทธิ</div>
            <p className="text-slate-600">
              เมื่อสั่งซื้อด้วยยอดประเมิน วิศวกร 3D จะนำโมเดลเข้าโปรแกรม Slicer เพื่อคำนวณเนื้อ Support และเวลาพิมพ์จริง หากมีความจำเป็นต้องปรับราคาหรือระยะเวลา SLA แอดมินจะแจ้งให้ลูกค้ายืนยันก่อนเสมอ และลูกค้าสามารถปฏิเสธเพื่อรับเงินคืน 100% ได้ทันที
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">2. เงื่อนไขการนับเวลา SLA 14 วัน & การคืนเงิน</div>
            <p className="text-slate-600">
              ระยะเวลารับประกัน 14 วันจะเริ่มนับเมื่อคำสั่งซื้อเข้าสู่คิวพิมพ์ (Printing Queue) หากพัสดุไม่ได้รับการจัดส่งถึงที่อยู่ของผู้รับภายใน 14 วันตามระบบขนส่ง ลูกค้าสามารถยื่นคำร้องเพื่อรับเงินคืน 100% เต็มจำนวนผ่านระบบ Stripe ได้ทันที
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">3. การควบคุมคุณภาพและการบรรจุหีบห่อ</div>
            <p className="text-slate-600">
              ทุกชิ้นงานผ่านการตรวจวัดมิติด้วยแสง Optical Inspection แกะ Support และอบแสง UV Curing พร้อมบรรจุในกล่องโฟมกันกระแทกขึ้นรูปพิเศษเพื่อความปลอดภัยระหว่างขนส่ง
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-600 font-medium">
            พร้อมที่จะสร้างผลงานประติมากรรม 3D ชิ้นแรกของคุณแล้วหรือยัง?
          </div>
          <Link
            href="/request-print"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>ส่งคำขอสั่งทำชิ้นงาน 3D ทันที</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
