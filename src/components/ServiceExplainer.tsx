'use client';

import React from 'react';
import { Wand2, Layers, Cpu, ShieldCheck, Truck, RotateCcw, DollarSign, Sparkles, Gift, Clock, CheckCircle2 } from 'lucide-react';

export default function ServiceExplainer() {
  const steps = [
    {
      num: '01',
      title: 'แจ้งรายละเอียด & มัดจำ 300฿',
      desc: 'พิมพ์อธิบายชิ้นงานที่ต้องการและอัปโหลดรูปภาพอ้างอิง พร้อมชำระมัดจำเริ่มงาน 300 บาท',
      icon: Wand2,
      highlight: 'เริ่มงานช่างเขียนแบบ 3D',
    },
    {
      num: '02',
      title: 'ช่างเขียนแบบ & ตรวจแก้ 3 รอบ',
      desc: 'ช่างปั้นโมเดล 3D และส่งภาพแบบร่างให้ตรวจ โดยสามารถขอคืนเงินมัดจำ 300 บาทได้ถึงรอบที่ 2',
      icon: RotateCcw,
      highlight: 'คืนเงิน 300฿ ได้ถึงรอบที่ 2',
    },
    {
      num: '03',
      title: 'สรุปราคาค่าพิมพ์จริง & ยืนยัน SLA',
      desc: 'เมื่อแบบ 3D เสร็จสมบูรณ์ ช่างจะเสนอราคาค่าพิมพ์จริง พร้อมหักลบเงินมัดจำ 300 บาทออกให้เต็มจำนวน',
      icon: Layers,
      highlight: 'หักลบมัดจำ 300฿ เต็มจำนวน',
    },
    {
      num: '04',
      title: 'พิมพ์ด้วยเรซิน 8K & ตรวจสอบคุณภาพ',
      desc: 'โรงพิมพ์ 3D ระดับอุตสาหกรรมจะพิมพ์ ขัดแต่ง อบแข็งด้วยแสง UV และตรวจสอบความสมบูรณ์ทุกมิติ',
      icon: Sparkles,
      highlight: 'ผิวเนียนคมชัดระดับไมครอน',
    },
    {
      num: '05',
      title: 'จัดส่งถึงบ้าน & Cashback 300฿',
      desc: 'บรรจุกล่องโฟมกันกระแทก จัดส่งถึงบ้านคุณใน 14 วัน และรับเงินคืน Cashback 300฿ เมื่อส่งรูปรีวิวสินค้า',
      icon: Gift,
      highlight: 'รับ Cashback 300฿ เมื่อส่งรูป',
    },
  ];

  const costFactors = [
    {
      title: 'ความซับซ้อนของโครงสร้าง 3D',
      desc: 'การสร้างตาข่ายโพลีกอนความละเอียดสูง และส่วนยื่นที่ต้องใช้โครงสร้าง Support พิเศษ',
    },
    {
      title: 'ชนิดของเนื้อวัสดุที่เลือก',
      desc: 'ตั้งแต่เส้น PLA ผิวด้าน ไปจนถึงเรซิน 8K ความละเอียดสูง และทองสัมฤทธิ์หล่อแท้',
    },
    {
      title: 'น้ำหนักและสัดส่วน Infill',
      desc: 'คำนวณตามปริมาตรจริง ($cm^3$) คูณด้วยความหนาแน่นของเนื้อวัสดุและร้อยละของเนื้อในชิ้นงาน',
    },
    {
      title: 'ความเร็วในการจัดส่งและ SLA',
      desc: 'รับประกันจัดส่งถึงบ้านภายใน 14 วันทำการ พร้อมการันตีคืนเงิน 100% เต็มจำนวนหากล่าช้า',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: End to End 5-Step Process */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono text-violet-600 font-bold tracking-wider uppercase">
              กระบวนการทำงานแบบโปร่งใส 100% (Process Transparency)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ช่างปั้นแบบ 3D เฉพาะคุณ — ผลิตจริงและจัดส่งตรงถึงบ้าน
            </h2>
            <p className="text-sm text-slate-600">
              บริการครบจบในที่เดียว มัดจำเริ่มต้น 300 บาท ตรวจแก้ได้ 3 ครั้ง และรับ Cashback 300 บาทเมื่อส่งรูปรีวิว
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white border border-slate-200 hover:border-violet-400 rounded-3xl p-5 shadow-sm hover:shadow-md space-y-3 relative group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-violet-600 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                      {step.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Cost Calculation Factors */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                โครงสร้างการคำนวณราคาและต้นทุนที่โปร่งใส
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ช่างคำนวณราคาตามสูตรต้นทุนจริง (Cost-Plus) ไม่มีบวกราคาแอบแฝง
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              <span>มัดจำ 300฿ หักลบค่าผลิตเต็มจำนวน</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {costFactors.map((factor, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900">{factor.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
