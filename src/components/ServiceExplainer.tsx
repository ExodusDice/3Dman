'use client';

import React from 'react';
import { Wand2, Layers, Cpu, ShieldCheck, Truck, RotateCcw, DollarSign, Sparkles } from 'lucide-react';

export default function ServiceExplainer() {
  const steps = [
    {
      num: '01',
      title: 'พิมพ์คำสั่ง & AI ปั้น 3D',
      desc: 'ป้อนข้อความคำสั่งหรือแนวคิดตัวละครที่ต้องการ Meshy AI จะสร้างโมเดลเรขาคณิต 3D ความละเอียดสูงในเวลาไม่กี่วินาที',
      icon: Wand2,
      highlight: 'แก้ไขแบบได้ 3 ครั้ง',
    },
    {
      num: '02',
      title: 'เลือกวัสดุ & กำหนดขนาด',
      desc: 'เลือกเรซิน 8K, คาร์บอนไฟเบอร์ หรือทองสัมฤทธิ์หล่อแท้ พร้อมปรับความสูง 8-30 ซม. และความหนาแน่น Infill',
      icon: Layers,
      highlight: 'คำนวณน้ำหนักและราคาจริง',
    },
    {
      num: '03',
      title: 'พิมพ์ด้วยเครื่องจักรแม่นยำสูง',
      desc: 'ฟาร์มเครื่องพิมพ์ 3D ระดับอุตสาหกรรมจะสไลซ์ไฟล์ด้วยความละเอียดระดับไมครอนและเริ่มพิมพ์ทันทีที่อนุมัติ',
      icon: Cpu,
      highlight: 'มาตรฐานอุตสาหกรรม',
    },
    {
      num: '04',
      title: 'ขัดแต่งด้วยมือ & ตรวจสอบคุณภาพ',
      desc: 'ช่างฝีมือผู้เชี่ยวชาญจะแกะ Support, อบแข็งด้วยแสง UV และตรวจสอบความสมบูรณ์ทุกมิติด้วยสายตาและเครื่องมือวัด',
      icon: Sparkles,
      highlight: 'ผิวเนียนไร้ตำหนิ',
    },
    {
      num: '05',
      title: 'รับประกันจัดส่งใน 14 วัน',
      desc: 'บรรจุกล่องโฟมกันกระแทกอย่างดี จัดส่งตรงถึงบ้านคุณภายใน 14 วันทำการ หากล่าช้าคืนเงิน 100% ทันที',
      icon: Truck,
      highlight: 'การันตีคืนเงิน 100%',
    },
  ];

  const costFactors = [
    {
      title: 'ความซับซ้อนของโครงสร้าง 3D',
      desc: 'การสร้างตาข่ายโพลีกอนจาก AI และส่วนยื่นที่ต้องใช้โครงสร้าง Support พิเศษ',
    },
    {
      title: 'ชนิดของวัสดุที่เลือก',
      desc: 'ตั้งแต่เส้น PLA ผิวด้าน ($0.06/g) ไปจนถึงทองสัมฤทธิ์หล่อแท้ ($0.38/g) และเรซินเรืองแสง',
    },
    {
      title: 'น้ำหนักและสัดส่วน Infill',
      desc: 'คำนวณตามปริมาตรจริง ($cm^3$) คูณด้วยความหนาแน่นของเนื้อวัสดุและร้อยละของเนื้อในชิ้นงาน',
    },
    {
      title: 'ความเร็วในการจัดส่งและ SLA',
      desc: 'มาตรฐาน SLA 14 วัน ($9.99), ด่วนพิเศษ 7 วัน ($24.99) หรือด่วน VIP 3 วัน ($49.99)',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: End to End 5-Step Process */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono text-violet-600 font-bold tracking-wider uppercase">
              บริการผลิตชิ้นงานจริงครบวงจร (Full-Service)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              เราไม่ใช่แค่โปรแกรมเรนเดอร์ — เราพิมพ์ชิ้นงานจริงและส่งถึงบ้านคุณ
            </h2>
            <p className="text-sm text-slate-600">
              บริการครบจบในที่เดียว ตั้งแต่ไอเดียในจินตนาการ สู่ชิ้นงานประติมากรรมของจริงวางบนโต๊ะทำงานของคุณ
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-semibold">
                      {step.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Cost Calculation Factors & Transparency */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold">
                <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                <span>โครงสร้างราคาโปร่งใส ชัดเจน</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                ราคาค่าบริการคำนวณอย่างไร?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ไม่มีค่าใช้จ่ายแอบแฝง ระบบคำนวณราคาตามจริงจากค่าประมวลผล AI, ปริมาณน้ำหนักวัสดุ, ชั่วโมงการทำงานของเครื่องพิมพ์ และค่าประกัน SLA จัดส่งตรงเวลา
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {costFactors.map((f, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                  <div className="font-bold text-xs text-violet-700">{f.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
