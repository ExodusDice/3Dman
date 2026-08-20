'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wand2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Gift, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Camera,
  FileCheck,
  PackageCheck
} from 'lucide-react';

export default function ServiceExplainer() {
  const steps = [
    {
      num: '01',
      phase: 'ขั้นตอนที่ 1',
      title: 'แจ้งรายละเอียด & มัดจำ 300฿',
      desc: 'พิมพ์อธิบายสิ่งที่ต้องการ อัปโหลดรูปภาพอ้างอิง และชำระมัดจำเริ่มงาน 300 บาทผ่าน PromptPay QR หรือบัตรเครดิต',
      icon: Wand2,
      highlight: 'ช่างเริ่มงานเขียนแบบ 3D ทันที',
      color: 'from-violet-500 to-indigo-600',
    },
    {
      num: '02',
      phase: 'ขั้นตอนที่ 2',
      title: 'ช่างเขียนแบบ & ตรวจแก้ได้ 3 ครั้ง',
      desc: 'ช่างปั้นโมเดล 3D และส่งภาพแบบร่างให้ตรวจแก้ได้ถึง 3 รอบ โดยในรอบที่ 2 คุณมีสิทธิ์ขอคืนเงินมัดจำ 300฿ ได้ 100% หากไม่พอใจ',
      icon: RotateCcw,
      highlight: '★ ขอคืนเงิน 300฿ ได้ถึงรอบที่ 2',
      color: 'from-amber-500 to-orange-600',
    },
    {
      num: '03',
      phase: 'ขั้นตอนที่ 3',
      title: 'สรุปราคาค่าพิมพ์จริง & ยืนยัน SLA',
      desc: 'เมื่อแบบ 3D ได้รับการยืนยัน ช่างจะคำนวณน้ำหนักวัสดุจริง เสนอราคาโดยหักลบมัดจำ 300฿ ออกให้เต็มจำนวน และเริ่มนับเวลา SLA 14 วัน',
      icon: FileCheck,
      highlight: 'หักลบมัดจำ 300฿ เต็มจำนวน',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      num: '04',
      phase: 'ขั้นตอนที่ 4',
      title: 'พิมพ์ชิ้นงาน 8K & ตรวจสอบคุณภาพ',
      desc: 'โรงพิมพ์ 3D พิมพ์ด้วยเรซิน 8K หรือคาร์บอนไฟเบอร์ อบแสง UV Curing ขัดแต่งผิว และผ่านการตรวจมิติ Optical QA',
      icon: Cpu,
      highlight: 'ผิวเนียนคมชัดระดับไมครอน',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      num: '05',
      phase: 'ขั้นตอนที่ 5',
      title: 'แพ็กเกจ & จัดส่งถึงบ้านใน 14 วัน',
      desc: 'บรรจุกล่องโฟมกันกระแทกอย่างหนาแน่น พร้อมเลขพัสดุ Tracking รับประกันส่งถึงบ้านใน 14 วัน (หากช้ากว่านั้น คืนเงิน 100%)',
      icon: Truck,
      highlight: 'รับประกัน SLA 14 วัน หรือคืนเงิน',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: '06',
      phase: 'ขั้นตอนที่ 6',
      title: 'ถ่ายรูปรีวิว ➔ รับ Cashback 300฿ คืน',
      desc: 'เมื่อได้รับพัสดุแล้ว เพียงถ่ายรูปสินค้าจริงส่งเข้ามาในระบบ รับเงินโอนคืน Cashback 300 บาทเข้าบัญชีทันที',
      icon: Gift,
      highlight: 'รับเงินโอนคืน 300฿ ทันที',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  const faqs = [
    {
      q: 'ทำไมต้องมีค่ามัดจำเริ่มต้น 300 บาท?',
      a: 'ค่ามัดจำ 300 บาทคือค่าแรงเริ่มต้นของช่างฝีมือในการขึ้นโครงสร้าง 3D และเปิดสิทธิ์ตรวจแก้ 3 ครั้ง โดยเงินจำนวนนี้จะถูกนำไปหักลบออกจากค่าพิมพ์ชิ้นงานจริงเต็มจำนวน 100% เสมือนว่าคุณไม่ได้เสียค่าออกแบบเพิ่มเลย',
    },
    {
      q: 'สามารถขอคืนเงินมัดจำ 300 บาทได้ถึงขั้นตอนไหน?',
      a: 'คุณสามารถกดขอคืนเงินมัดจำ 300 บาทเต็มจำนวนได้ในการตรวจแบบรอบที่ 1 และรอบที่ 2 (Last Chance Refund) หากหลังรอบที่ 2 คุณยืนยันแบบแล้ว จะเข้าสู่ขั้นตอนผลิตจริงและไม่สามารถคืนเงินมัดจำได้',
    },
    {
      q: 'การรับเงินคืน Cashback 300 บาททำอย่างไร?',
      a: 'เมื่อชิ้นงาน 3D จัดส่งถึงบ้านคุณแล้ว ให้เข้าไปที่หน้า "ติดตามคำสั่งซื้อ" แล้วกดอัปโหลดรูปถ่ายสินค้าจริงที่คุณได้รับ พร้อมใส่เบอร์พร้อมเพย์/เลขบัญชี แอดมินจะตรวจสอบและโอนเงินคืน 300 บาทให้ภายใน 24 ชั่วโมง',
    },
    {
      q: 'การรับประกัน SLA 14 วัน คืนเงิน 100% มีเงื่อนไขอย่างไร?',
      a: 'ทันทีที่คุณยืนยันใบเสนอราคาและเข้าสู่คิวพิมพ์ ระบบจะเริ่มนับเวลาถอยหลัง 14 วันทำการ หากพัสดุไม่ถึงมือคุณภายในกำหนด คุณมีสิทธิ์กดรับเงินคืน 100% เต็มจำนวนทันที',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section 1: Process Transparency Roadmap */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Customer Flow & Transparency • ขั้นตอนการทำงาน 6 ลำดับ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              เส้นทางการสั่งทำชิ้นงาน 3D แบบโปร่งใส 100%
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ตั้งแต่ไอเดียแรกของคุณ สู่ช่างเขียนแบบ 3D ตรวจแก้ได้ 3 ครั้ง ผลิตจริงด้วยเรซิน 8K จัดส่งถึงบ้าน และรับเงินคืน Cashback 300 บาท
            </p>
          </div>

          {/* 6-Step Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white border border-slate-200 hover:border-violet-400 rounded-3xl p-6 shadow-sm hover:shadow-xl space-y-4 relative group transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-800 transition-colors">
                        {step.phase}
                      </span>
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 inline-block group-hover:border-violet-300 group-hover:bg-violet-50 group-hover:text-violet-800 transition-colors">
                      {step.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner to Start Order */}
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-black">พร้อมสั่งทำชิ้นงาน 3D ชิ้นแรกของคุณแล้วหรือยัง?</h3>
              <p className="text-xs text-violet-100">มัดจำเริ่มต้นเพียง 300 บาท (ตรวจแก้ได้ 3 ครั้ง คืนเงินได้ถึงรอบ 2)</p>
            </div>
            <Link
              href="/request-print"
              className="px-8 py-4 rounded-2xl bg-white text-violet-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-violet-600" />
              <span>ส่งคำขอสั่งทำชิ้นงาน 3D ทันที</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section 2: Frequently Asked Questions (FAQ) */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-violet-600" />
              <span>คำถามที่พบบ่อย (FAQ & Transparency)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ทุกคำถามเกี่ยวกับมัดจำ 300฿, การตรวจแก้แบบ, สิทธิ์ขอคืนเงิน, และ Cashback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6 font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
