'use client';

import React, { useState, useEffect } from 'react';
import { CustomerOrder, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import Viewer3D from '@/components/Viewer3D';
import { 
  ShieldCheck, 
  Clock, 
  Box, 
  CheckCircle2, 
  Truck, 
  Package, 
  Sparkles, 
  Flame, 
  MessageSquare, 
  AlertCircle, 
  RotateCcw,
  Star,
  Check,
  AlertTriangle,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

interface OrderTrackerProps {
  order: CustomerOrder;
  onOpenChat?: () => void;
}

export default function OrderTracker({ order: initialOrder, onOpenChat }: OrderTrackerProps) {
  const [order, setOrder] = useState<CustomerOrder>(initialOrder);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  // Live SLA Countdown
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const deadline = new Date(order.slaGuaranteedDeliveryDate).getTime();
      const now = Date.now();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [order.slaGuaranteedDeliveryDate]);

  const getPhaseNumber = (status: OrderStatus): number => {
    if (['admin_review', 'price_adjusted_pending_customer', 'approved'].includes(status)) return 1;
    if (['printing', 'packaging', 'shipping'].includes(status)) return 2;
    if (['delivered_pending_confirmation', 'completed'].includes(status)) return 3;
    return 2;
  };

  const currentPhase = getPhaseNumber(order.status);

  const handleAcceptPriceAdjustment = async () => {
    try {
      const res = await fetch(`/api/orders/${order.id}/confirm-adjustment`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to accept price adjustment:', err);
    }
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundReason.trim()) return;

    setIsSubmittingRefund(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: refundReason }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setIsRefundModalOpen(false);
        setRefundReason('');
      }
    } catch (err) {
      console.error('Refund submission error:', err);
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const handleConfirmReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReceipt(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/confirm-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchesOrder: true,
          satisfactionRating,
          feedbackNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setIsReceiptModalOpen(false);
      }
    } catch (err) {
      console.error('Receipt confirmation error:', err);
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Top Banner: Order Header & 14-Day SLA Countdown Clock */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200 font-bold">
                หมายเลขคำสั่งซื้อ #{order.orderNumber}
              </span>
              <span className="text-xs text-slate-500">
                สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleDateString('th-TH')}
              </span>
              {order.status === 'completed' && (
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>คำสั่งซื้อเสร็จสมบูรณ์ 100%</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {order.prompt.slice(0, 65)}...
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              วัสดุ: <span className="text-violet-700 font-semibold">{order.material.name}</span> • น้ำหนัก: <span className="font-mono text-slate-900 font-medium">{order.pricing.estimatedWeightGrams} กรัม</span> • ความสูง: <span className="font-mono text-slate-900 font-medium">{order.modelGeometry.heightCm} ซม.</span>
            </p>
          </div>

          {/* 14-Day SLA Countdown Clock */}
          <div className="bg-slate-50 border border-emerald-300 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                ตัวจับเวลาการรับประกัน SLA 14 วัน
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="flex items-center gap-1 font-mono font-black text-xl text-slate-900">
                  <span>{String(timeLeft.days).padStart(2, '0')} วัน</span>
                  <span className="text-slate-400">:</span>
                  <span>{String(timeLeft.hours).padStart(2, '0')} ชม.</span>
                  <span className="text-slate-400">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')} นาที</span>
                  <span className="text-slate-400">:</span>
                  <span className="text-emerald-600">{String(timeLeft.seconds).padStart(2, '0')} วิ</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                กำหนดส่งถึงบ้านภายใน: {new Date(order.slaGuaranteedDeliveryDate).toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>
        </div>

        {/* Refund Status Alert Banners */}
        {order.status === 'refund_requested' && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-slate-900">ยื่นคำขอคืนเงินประกัน SLA 100% รอแอดมินตรวจสอบ</div>
              <p className="text-amber-800">
                คุณได้ยื่นคำขอคืนเงินจำนวน {formatCurrency(order.pricing.totalPrice)} ด้วยเหตุผล: <em>"{order.refundRequest?.reason}"</em> แอดมินกำลังดำเนินการตรวจสอบและจะแจ้งผลให้ทราบโดยเร็ว
              </p>
            </div>
          </div>
        )}

        {order.status === 'refund_approved' && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-slate-900">อนุมัติการคืนเงิน 100% เรียบร้อยแล้ว</div>
              <p className="text-emerald-800">
                {order.refundRequest?.adminResponse || 'ระบบได้ดำเนินการคืนเงิน 100% เต็มจำนวนเข้าสู่บัตร/บัญชี Stripe ต้นทางของคุณแล้ว'}
              </p>
            </div>
          </div>
        )}

        {order.status === 'refund_rejected' && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-slate-900">คำขอคืนเงินไม่ได้รับการอนุมัติ</div>
              <p className="text-rose-800">
                เหตุผลจากแอดมิน: {order.refundRequest?.adminResponse || 'คำสั่งซื้ออยู่ในเกณฑ์มาตรฐาน SLA ที่กำหนด'}
              </p>
            </div>
          </div>
        )}

        {/* Phase 1 Notice: Price/SLA Adjustment Banner */}
        {order.status === 'price_adjusted_pending_customer' && (
          <div className="bg-violet-50 border border-violet-300 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h3 className="font-bold text-sm text-slate-900">แอดมินได้ตรวจทานและกำหนดราคาจริง / SLA เรียบร้อยแล้ว</h3>
              </div>
              <span className="text-xs font-mono font-bold text-violet-800 bg-white px-2.5 py-1 rounded-lg border border-violet-200 shadow-sm">
                ราคาสุทธิ: {formatCurrency(order.actualPrice || order.pricing.totalPrice)}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {order.adminApprovalNotes || 'วิศวกร 3D ได้สไลซ์ไฟล์และคำนวณโครงสร้าง Support เรียบร้อย กรุณากดปุ่มด้านล่างเพื่อยืนยันและเริ่มคิวพิมพ์ชิ้นงานทันที'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAcceptPriceAdjustment}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันราคา & เริ่มต้นพิมพ์ชิ้นงาน 3D</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3 Action Banner: Customer Confirms Receiving Product */}
        {order.status === 'delivered_pending_confirmation' && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>พัสดุถึงมือคุณแล้ว! กรุณายืนยันการรับสินค้า</span>
              </div>
              <p className="text-xs text-emerald-800">
                กรุณาตรวจสอบชิ้นงานจริงว่าตรงตามแบบ 3D และกดยืนยันเพื่อเสร็จสิ้นกระบวนการสั่งพิมพ์
              </p>
            </div>

            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>ยืนยันรับสินค้า & ตรงตามแบบ [เสร็จสมบูรณ์]</span>
            </button>
          </div>
        )}

        {/* 3 DISTINCT PROGRESS PHASES */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-violet-700 font-bold uppercase tracking-wider">
              3 ขั้นตอนหลักในการผลิตและจัดส่ง
            </span>
            <span className="text-xs text-slate-500 font-mono">
              สถานะปัจจุบัน: ขั้นตอนที่ {currentPhase} จาก 3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PHASE 1 CARD */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
              currentPhase === 1
                ? 'bg-violet-50/80 border-violet-500 shadow-md ring-1 ring-violet-500'
                : currentPhase > 1
                ? 'bg-white border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-sm">
                  ขั้นตอนที่ 01
                </span>
                {currentPhase > 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-violet-600 animate-ping" />
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900">แอดมินตรวจแบบ & กำหนดราคา/SLA จริง</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {order.status === 'admin_review'
                  ? 'ชำระยอดประเมินแล้ว แอดมินกำลังตรวจเช็กความแข็งแรงและสไลซ์ไฟล์ 3D'
                  : order.status === 'price_adjusted_pending_customer'
                  ? 'แอดมินปรับราคา/เวลาตามความซับซ้อน รอลูกค้ายืนยัน'
                  : 'อนุมัติแบบและจัดสรรคิวเครื่องพิมพ์เรียบร้อย'}
              </p>
              <div className="pt-2 text-[11px] font-mono text-violet-700 font-bold border-t border-slate-200">
                {order.actualPrice ? `ราคาจริง: ${formatCurrency(order.actualPrice)}` : `ราคาประเมิน: ${formatCurrency(order.estimatedPrice)}`}
              </div>
            </div>

            {/* PHASE 2 CARD */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
              currentPhase === 2
                ? 'bg-cyan-50/80 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                : currentPhase > 2
                ? 'bg-white border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-sm">
                  ขั้นตอนที่ 02
                </span>
                {currentPhase > 2 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : currentPhase === 2 ? (
                  <div className="w-3 h-3 rounded-full bg-cyan-600 animate-ping" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900">กำลังพิมพ์ ➔ แพ็กเกจ ➔ จัดส่งพัสดุ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {order.status === 'printing'
                  ? 'เครื่องพิมพ์ 3D กำลังขึ้นรูปชิ้นงานทีละเลเยอร์ด้วยแสงเลเซอร์'
                  : order.status === 'packaging'
                  ? 'อบแสง UV ผ่านการตรวจคุณภาพ QA กำลังบรรจุกล่องโฟมกันกระแทก'
                  : order.status === 'shipping'
                  ? `ส่งมอบพนักงานขนส่งแล้ว (${order.trackingCarrier || 'Flash Express / Kerry'})`
                  : 'จะเริ่มพิมพ์ทันทีหลังผ่านขั้นตอนที่ 1'}
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-700 font-bold border-t border-slate-200 flex justify-between">
                <span>วัสดุ: {order.material.name}</span>
                <span>{order.pricing.estimatedWeightGrams}g</span>
              </div>
            </div>

            {/* PHASE 3 CARD */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
              currentPhase === 3
                ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-sm">
                  ขั้นตอนที่ 03
                </span>
                {order.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900">ลูกค้ายืนยันรับสินค้า [เสร็จสมบูรณ์]</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {order.status === 'completed'
                  ? 'ลูกค้ายืนยันรับชิ้นงานตรงตามแบบและให้คะแนนความพึงพอใจ คำสั่งซื้อเสร็จสมบูรณ์!'
                  : order.status === 'delivered_pending_confirmation'
                  ? 'พัสดุจัดส่งถึงบ้านแล้ว รอลูกค้ายืนยันความถูกต้องของชิ้นงาน'
                  : 'ตรวจเช็กชิ้นงานจริงเมื่อพัสดุถึงบ้าน'}
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold border-t border-slate-200">
                {order.status === 'completed' ? '✓ สำเร็จเรียบร้อย 100%' : 'รับประกันส่งใน 14 วัน'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 360 3D Viewer & Order Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 360 Interactive 3D Model Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-violet-600" />
                <span>ตรวจสอบแบบ 3D ชิ้นงานของคุณ</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                หมุนดูได้ 360 องศา
              </span>
            </div>

            <div className="h-[440px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
              <Viewer3D
                geometryInfo={order.modelGeometry}
                material={order.material}
                autoRotate={true}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Courier Tracking, Specs & Refund/Chat Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracking & Courier Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-600" />
              <span>ข้อมูลการจัดส่งและพัสดุ</span>
            </h3>

            {order.trackingNumber ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">บริษัทขนส่ง:</span>
                  <span className="font-bold text-slate-900">{order.trackingCarrier || 'Flash Express / Kerry'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">เลขพัสดุ (Tracking No.):</span>
                  <span className="font-mono font-bold text-violet-700">{order.trackingNumber}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ อยู่ในกำหนดการรับประกันส่งถึงบ้านใน 14 วัน
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500">
                <p>เลขพัสดุจะแสดงทันทีเมื่อชิ้นงานผ่านการตรวจ QA และแพ็กเกจเรียบร้อย</p>
              </div>
            )}
          </div>

          {/* Shipping Address Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-violet-600" />
              <span>ที่อยู่จัดส่งสินค้า</span>
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.addressLine1}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
              <div>{order.shippingAddress.country}</div>
              <div className="text-slate-500 font-mono text-[11px] pt-1">โทร: {order.shippingAddress.phone}</div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ใบเสร็จและการชำระเงิน</span>
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>ค่าบริการ AI & พิมพ์ 3D:</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(order.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าจัดส่ง ({order.shippingOption.name}):</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(order.pricing.shippingFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>ยอดเงินรวม:</span>
                <span className="text-violet-700 font-mono">{formatCurrency(order.pricing.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Direct Chat & Request Refund */}
          <div className="space-y-3">
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>แชทสอบถามช่างพิมพ์ 3D โดยตรง</span>
              </button>
            )}

            {order.status !== 'refund_approved' && order.status !== 'refund_requested' && (
              <button
                onClick={() => setIsRefundModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-rose-300 hover:border-rose-500 hover:bg-rose-50 text-rose-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ขอยื่นเรื่องคืนเงินประกัน SLA 100%</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Customer Request Refund Dialog */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>ขอยื่นเรื่องคืนเงินประกัน SLA 100%</span>
              </h3>
              <button onClick={() => setIsRefundModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ภายใต้เงื่อนไขการรับประกัน SLA 14 วัน คุณมีสิทธิ์ได้รับเงินคืน 100% เต็มจำนวนเป็นเงิน <span className="font-bold text-slate-900">{formatCurrency(order.pricing.totalPrice)}</span> หากการจัดส่งล่าช้า หรือยกเลิกก่อนเริ่มพิมพ์
            </p>

            <form onSubmit={handleSubmitRefund} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">ระบุเหตุผลในการขอคืนเงิน (*):</label>
                <textarea
                  required
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="เช่น การจัดส่งเกินกำหนด 14 วัน หรือต้องการยกเลิกก่อนเริ่มพิมพ์..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-rose-500 resize-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRefund || !refundReason.trim()}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md disabled:opacity-40"
                >
                  {isSubmittingRefund ? 'กำลังส่งเรื่อง...' : 'ส่งคำขอคืนเงิน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Customer Confirm Receiving Product Dialog */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>ยืนยันการรับสินค้า & คุณภาพตรงตามแบบ</span>
              </h3>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              การกดยืนยันจะทำให้สถานะคำสั่งซื้อของคุณเสร็จสมบูรณ์ 100%
            </p>

            <form onSubmit={handleConfirmReceipt} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">ระดับความพึงพอใจในชิ้นงาน:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= satisfactionRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-600 ml-2 font-mono font-bold">{satisfactionRating} / 5 ดาว</span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">ความคิดเห็น / รีวิว (ไม่บังคับ):</label>
                <textarea
                  rows={2}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="เช่น ชิ้นงานสวยงามมาก รายละเอียดคมชัด ผิวเนียนประทับใจ!"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReceipt}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  {isSubmittingReceipt ? 'กำลังบันทึก...' : 'ยืนยันรับสินค้า & เสร็จสิ้นคำสั่งซื้อ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
