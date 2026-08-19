'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArtStyle, MaterialOption, ModelGeometryInfo, PriceBreakdown, ShippingAddress, ShippingOption } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, Box, Sparkles, MapPin, AlertCircle, ArrowRight, Info, RotateCcw, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  artStyle: ArtStyle;
  geometryInfo: ModelGeometryInfo;
  material: MaterialOption;
  shippingOption: ShippingOption;
  pricing: PriceBreakdown;
  revisionCount: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  prompt,
  artStyle,
  geometryInfo,
  material,
  shippingOption,
  pricing,
  revisionCount,
}: CheckoutModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToProof, setAgreedToProof] = useState(false);
  const [agreedToSla, setAgreedToSla] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'สมชาย ศิลป์ประเสริฐ',
    email: 'somchai@thaiart.co.th',
    phone: '081-234-5678',
    addressLine1: '99/1 ถนนสุขุมวิท ซอย 21',
    addressLine2: 'อาคารเอ็กซ์เชนจ์ ทาวเวอร์ ชั้น 12',
    city: 'เขตวัฒนา',
    state: 'กรุงเทพมหานคร',
    postalCode: '10110',
    country: 'ประเทศไทย (Thailand)',
    specialInstructions: 'ส่งที่เคาน์เตอร์ประชาสัมพันธ์ชั้น 1 หากมานอกเวลาทำการ',
  });

  if (!isOpen) return null;

  const handleCreateOrder = async (isStripeLive: boolean = false) => {
    if (!agreedToProof || !agreedToSla) {
      alert('กรุณาคลิกยอมรับแบบ 3D และเงื่อนไขการรับประกัน SLA 14 วัน');
      return;
    }

    setIsSubmitting(true);

    if (isStripeLive) {
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            artStyle,
            geometryInfo,
            material,
            shippingOption,
            shippingAddress: address,
            revisionCount,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          }
        }
      } catch (err) {
        console.error('Stripe redirect failed:', err);
      }
    }

    // Direct Instant Checkout
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: address.fullName,
          customerEmail: address.email,
          prompt,
          style: artStyle,
          modelGeometry: geometryInfo,
          material,
          shippingOption,
          shippingAddress: address,
          pricing,
          revisionCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onClose();
        router.push(`/orders/${data.order.id}`);
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาตรวจสอบข้อมูล');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-600" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">ตรวจสอบแบบ 3D & ชำระเงิน</h2>
              <p className="text-xs text-slate-500">ชำระตามจริงด้วยระบบ Stripe พร้อมประกันจัดส่ง SLA 14 วัน</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Design Summary, Shipping & Review Policy */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Design & Material Proof Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-violet-700 font-bold uppercase">
                  ข้อมูลแบบชิ้นงาน & วัสดุ
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {formatCurrency(pricing.totalPrice)} (ยอดประเมิน)
                </span>
              </div>

              <p className="text-xs text-slate-800 font-medium italic">
                "{prompt}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">วัสดุ:</span>
                  <span className="text-slate-900 font-semibold">{material.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">น้ำหนักประเมิน:</span>
                  <span className="text-violet-700 font-semibold">{pricing.estimatedWeightGrams} กรัม</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ความสูง:</span>
                  <span className="text-slate-900 font-semibold">{geometryInfo.heightCm} ซม.</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ประกัน SLA:</span>
                  <span className="text-emerald-700 font-semibold">{shippingOption.slaDays} วัน</span>
                </div>
              </div>
            </div>

            {/* Admin Review & Pre-Print Refund Notice */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-700">
              <div className="font-bold text-violet-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-violet-600" />
                <span>การตรวจทานแบบโดยแอดมิน & สิทธิ์ขอคืนเงิน 100% ก่อนพิมพ์</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                หลังจากสั่งซื้อ ทีมวิศวกร 3D จะตรวจโครงสร้างไฟล์ หากต้องปรับราคาหรือกำหนดเวลา SLA ตามความซับซ้อนของชิ้นงาน คุณจะได้รับการแจ้งเตือนเพื่อยืนยันก่อนเริ่มพิมพ์
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>สามารถขอยกเลิกและรับเงินคืน 100% ได้ตลอดเวลาก่อนเริ่มพิมพ์!</span>
              </div>
            </div>

            {/* Shipping Address Inputs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-violet-600" />
                <span>ที่อยู่จัดส่งพัสดุในประเทศไทย</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">ชื่อ-นามสกุล ผู้รับ (*)</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">เบอร์โทรศัพท์ติดต่อ (*)</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">ที่อยู่อาคาร / บ้านเลขที่ / ถนน (*)</label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="เลขที่ ซอย ถนน"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">แขวง / ตำบล & เขต / อำเภอ</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">จังหวัด</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">รหัสไปรษณีย์</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToProof}
                  onChange={(e) => setAgreedToProof(e.target.checked)}
                  className="mt-0.5 rounded accent-violet-600 cursor-pointer"
                />
                <span className="text-slate-700">
                  ฉันตรวจสอบและยอมรับแบบ 3D และเข้าใจว่าแอดมินจะตรวจไฟล์ก่อนเริ่มพิมพ์
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToSla}
                  onChange={(e) => setAgreedToSla(e.target.checked)}
                  className="mt-0.5 rounded accent-emerald-600 cursor-pointer"
                />
                <span className="text-emerald-800 font-semibold">
                  ฉันรับทราบการรับประกัน SLA 14 วัน และสามารถขอคืนเงิน 100% ได้ตลอดเวลาก่อนเริ่มพิมพ์ หรือหากจัดส่งล่าช้ากว่ากำหนด
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={!agreedToProof || !agreedToSla}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
              >
                <span>ไปยังขั้นตอนชำระเงิน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Stripe Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>ยอดประเมินค่าบริการ (AI + พิมพ์ 3D + ขัดแต่ง):</span>
                <span className="text-slate-900 font-mono font-semibold">{formatCurrency(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>ค่าจัดส่ง ({shippingOption.name}):</span>
                <span className="text-slate-900 font-mono font-semibold">{formatCurrency(pricing.shippingFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>ยอดเงินมัดจำประเมินทั้งหมด:</span>
                <span className="text-xl font-extrabold text-violet-700">{formatCurrency(pricing.totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Stripe 256-Bit ระบบชำระเงินปลอดภัย</div>
                    <div className="text-[10px] text-indigo-700 font-medium">คุ้มครองด้วยการรับประกันคืนเงิน 100%</div>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreateOrder(false)}
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังประมวลผล...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>ยืนยันสั่งพิมพ์ทันที</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreateOrder(true)}
                  className="py-3.5 px-4 rounded-2xl bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-800 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>ชำระผ่านบัตรเครดิต Stripe</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-900"
              >
                ← ย้อนกลับไปแก้ไขที่อยู่จัดส่ง
              </button>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>การันตีคืนเงิน 100% SLA เปิดใช้งาน</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
