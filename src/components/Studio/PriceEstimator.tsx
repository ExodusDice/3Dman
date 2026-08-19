'use client';

import React, { useState } from 'react';
import { MaterialOption, PriceBreakdown, ShippingOption } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { ShieldCheck, Info, Sparkles, Cpu, Layers, Clock, CheckCircle2, DollarSign, ChevronDown, ChevronUp, AlertCircle, RotateCcw } from 'lucide-react';

interface PriceEstimatorProps {
  pricing: PriceBreakdown;
  selectedMaterial: MaterialOption;
  selectedShipping: ShippingOption;
  onProceedToOrder: () => void;
  revisionCount: number;
  maxRevisions: number;
}

export default function PriceEstimator({
  pricing,
  selectedMaterial,
  selectedShipping,
  onProceedToOrder,
  revisionCount,
  maxRevisions,
}: PriceEstimatorProps) {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-mono text-violet-600 font-bold tracking-wider uppercase">
            ระบบคำนวณราคา & SLA เรียลไทม์
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>ใบเสนอราคาประเมิน</span>
            <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              รับประกัน SLA 14 วัน
            </span>
          </h3>
        </div>
        
        {/* Revision count status */}
        <div className="text-right">
          <div className="text-[11px] text-slate-500">สิทธิ์แก้แบบ</div>
          <div className="text-xs font-mono font-bold text-violet-700">
            เหลือ {maxRevisions - revisionCount} จาก {maxRevisions} ครั้ง
          </div>
        </div>
      </div>

      {/* Main Big Price Display */}
      <div className="bg-gradient-to-br from-slate-50 to-violet-50/40 p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-xs text-slate-500 font-medium">ยอดรวมค่าบริการประเมินเบื้องต้น</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-violet-700">
            {formatCurrency(pricing.totalPrice)}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5 font-medium">
            <span>AI ปั้นแบบ</span>
            <span>➔</span>
            <span>แอดมินตรวจ</span>
            <span>➔</span>
            <span>พิมพ์ 3D</span>
            <span>➔</span>
            <span className="text-emerald-700 font-bold">ส่งถึงบ้านใน 14 วัน</span>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="inline-flex items-center gap-1 bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-lg text-xs font-mono text-violet-800 font-bold">
            <Layers className="w-3.5 h-3.5 text-violet-600" />
            <span>{pricing.estimatedWeightGrams} กรัม</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            ~{pricing.printTimeHours} ชม. เครื่องพิมพ์
          </div>
        </div>
      </div>

      {/* Engineering Review & Pre-Print Refund Guarantee Notice */}
      <div className="bg-violet-50/70 border border-violet-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700">
        <div className="flex items-start gap-2 text-violet-800 font-bold">
          <Info className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
          <span>นโยบายตรวจสอบและคาลิเบรตชิ้นงานโดยแอดมิน</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
          ทีมวิศวกร 3D จะตรวจสอบการสไลซ์และโครงสร้าง Support ก่อนพิมพ์ หากโมเดลมีความซับซ้อน แอดมินอาจปรับราคาจริงและ SLA ขั้นสุดท้ายให้เหมาะสม
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pl-6 pt-0.5">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
          <span>สามารถขอยกเลิกและรับเงินคืน 100% ได้ตลอดเวลาก่อนเริ่มพิมพ์! :)</span>
        </div>
      </div>

      {/* SLA 100% Refund Assurance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span>การันตีจัดส่งใน 14 วัน หรือคืนเงินเต็มจำนวน</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
            หากพัสดุชิ้นงานของคุณไม่ถึงบ้านภายใน 14 วันนับจากวันที่อนุมัติ รับเงินคืน 100% เต็มจำนวน
          </p>
        </div>
      </div>

      {/* Accordion Toggle for Detailed Cost Transparency */}
      <div>
        <button
          onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-900 py-1.5 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <Info className="w-3.5 h-3.5 text-violet-600" />
            <span>ดูรายละเอียดการคำนวณต้นทุนโปร่งใส</span>
          </span>
          {showDetailedBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetailedBreakdown && (
          <div className="mt-2 space-y-2 text-xs bg-slate-50 rounded-xl p-3.5 border border-slate-200 font-mono animate-in fade-in duration-200">
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-600" />
                <span>ค่าประมวลผล Meshy AI 3D Meshing:</span>
              </span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.aiComputeFee)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-600" />
                <span>ค่าเนื้อวัสดุจริง ({selectedMaterial.name} ~ {pricing.estimatedWeightGrams}g):</span>
              </span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.rawMaterialCost)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>ค่าการทำงานเครื่องพิมพ์ 3D ({pricing.printTimeHours} ชม.):</span>
              </span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.machineTimeCost)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>ค่าขัดแต่งด้วยมือ, อบแสง UV & ตรวจสอบ QA:</span>
              </span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.handFinishingQAFee)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>กองทุนประกันจัดส่งตรงเวลา SLA 14 วัน:</span>
              </span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.slaInsuranceFee)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>ค่าจัดส่ง ({selectedShipping.name}):</span>
              <span className="text-slate-900 font-semibold">{formatCurrency(pricing.shippingFee)}</span>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
              <span>ยอดรวมประมาณการสุทธิ:</span>
              <span className="text-violet-700 text-sm">{formatCurrency(pricing.totalPrice)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Call to Action Button */}
      <button
        onClick={onProceedToOrder}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span>ยืนยันแบบ 3D & ดำเนินการสั่งพิมพ์</span>
      </button>
    </div>
  );
}
