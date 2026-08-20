'use client';

import React, { useState, useEffect } from 'react';
import { CustomerOrder, OrderStatus } from '@/types';
import Viewer3D from '@/components/Viewer3D';
import { 
  ShieldCheck, 
  Clock, 
  Box, 
  CheckCircle2, 
  Truck, 
  Package, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  RotateCcw,
  Star,
  Check,
  AlertTriangle,
  Layers,
  HelpCircle,
  X,
  Camera,
  Gift,
  ArrowRight,
  FileText,
  CreditCard,
  UploadCloud,
  CheckCircle
} from 'lucide-react';

interface OrderTrackerProps {
  order: CustomerOrder;
  onOpenChat?: () => void;
}

export default function OrderTracker({ order: initialOrder, onOpenChat }: OrderTrackerProps) {
  const [order, setOrder] = useState<CustomerOrder>(initialOrder);

  // Revision Feedback State
  const [customerFeedbackText, setCustomerFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Refund Modal State (Available in Round 1 & 2)
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  // Quotation Affirmation State
  const [isAffirming, setIsAffirming] = useState(false);

  // 300 THB Cashback Photo Claim State
  const [cashbackPhotoBase64, setCashbackPhotoBase64] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'promptpay' | 'bank'>('promptpay');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [isSubmittingCashback, setIsSubmittingCashback] = useState(false);
  const [cashbackSuccess, setCashbackSuccess] = useState(false);

  // Receipt Confirmation
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(5);

  // Live SLA Countdown
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const deadline = new Date(order.slaGuaranteedDeliveryDate || Date.now() + 14 * 24 * 3600 * 1000).getTime();
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

  // Handle Customer Feedback Submission (Round 1, 2, or 3)
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerFeedbackText.trim()) return;

    setIsSubmittingFeedback(true);
    setTimeout(() => {
      const nextRound = Math.min((order.currentRevisionRound || 1) + 1, 3);
      const updatedOrder: CustomerOrder = {
        ...order,
        currentRevisionRound: nextRound,
        revisions: [
          ...(order.revisions || []),
          {
            round: nextRound,
            submittedAt: new Date().toISOString(),
            artisanNote: `ช่างได้รับข้อเสนอแนะรอบที่ ${order.currentRevisionRound} แล้ว: "${customerFeedbackText.trim()}" กำลังเร่งปรับปรุงแบบ 3D ให้ตรงใจคุณที่สุด`,
            status: 'pending_customer',
            isLastChanceRefund: nextRound === 2,
          }
        ]
      };

      setOrder(updatedOrder);
      setCustomerFeedbackText('');
      setIsSubmittingFeedback(false);

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem('3dman_orders') || '[]');
      const idx = orders.findIndex((o: CustomerOrder) => o.id === order.id);
      if (idx !== -1) {
        orders[idx] = updatedOrder;
        localStorage.setItem('3dman_orders', JSON.stringify(orders));
      }
    }, 600);
  };

  // Handle 300 THB Refund (Permitted in Round 1 & 2)
  const handleConfirmRefund = () => {
    setIsSubmittingRefund(true);
    setTimeout(() => {
      const updatedOrder: CustomerOrder = {
        ...order,
        status: 'deposit_refunded',
      };
      setOrder(updatedOrder);
      setIsRefundModalOpen(false);
      setIsSubmittingRefund(false);

      // Save
      const orders = JSON.parse(localStorage.getItem('3dman_orders') || '[]');
      const idx = orders.findIndex((o: CustomerOrder) => o.id === order.id);
      if (idx !== -1) {
        orders[idx] = updatedOrder;
        localStorage.setItem('3dman_orders', JSON.stringify(orders));
      }
    }, 800);
  };

  // Handle Final Quotation Affirmation
  const handleAcceptFinalQuotation = () => {
    setIsAffirming(true);
    setTimeout(() => {
      const updatedOrder: CustomerOrder = {
        ...order,
        status: 'printing',
      };
      setOrder(updatedOrder);
      setIsAffirming(false);

      const orders = JSON.parse(localStorage.getItem('3dman_orders') || '[]');
      const idx = orders.findIndex((o: CustomerOrder) => o.id === order.id);
      if (idx !== -1) {
        orders[idx] = updatedOrder;
        localStorage.setItem('3dman_orders', JSON.stringify(orders));
      }
    }, 800);
  };

  // Handle 300 THB Cashback Claim Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCashbackPhotoBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCashbackClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashbackPhotoBase64 || !payoutAccount.trim()) {
      alert('กรุณาอัปโหลดรูปภาพสินค้าและระบุเบอร์พร้อมเพย์/เลขบัญชีเพื่อรับเงินคืน 300 บาท');
      return;
    }

    setIsSubmittingCashback(true);
    setTimeout(() => {
      const updatedOrder: CustomerOrder = {
        ...order,
        status: 'cashback_submitted',
        cashbackClaim: {
          submitted: true,
          photoUrl: cashbackPhotoBase64,
          submittedAt: new Date().toISOString(),
          status: 'pending',
          amountThb: 300,
          payoutMethod,
          payoutAccount: payoutAccount.trim(),
        }
      };
      setOrder(updatedOrder);
      setIsSubmittingCashback(false);
      setCashbackSuccess(true);

      const orders = JSON.parse(localStorage.getItem('3dman_orders') || '[]');
      const idx = orders.findIndex((o: CustomerOrder) => o.id === order.id);
      if (idx !== -1) {
        orders[idx] = updatedOrder;
        localStorage.setItem('3dman_orders', JSON.stringify(orders));
      }
    }, 800);
  };

  const currentRound = order.currentRevisionRound || 1;
  const isRefundableStage = (order.status === 'deposit_paid' || order.status === 'artisan_drafting' || currentRound <= 2) && order.status !== 'deposit_refunded' && order.status !== 'printing';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Top Banner: Transparency & Deposit Guarantee */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-100 text-violet-800 font-bold">
              คำสั่งซื้อ #{order.orderNumber}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ชำระมัดจำ 300฿ เรียบร้อยแล้ว</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            ติดตามสถานะการปั้นแบบ 3D & กระบวนการผลิต
          </h1>
          <p className="text-xs text-slate-500">
            ลูกค้า: {order.customerName} ({order.customerEmail}) • อัปเดตล่าสุด: {new Date(order.updatedAt || Date.now()).toLocaleTimeString('th-TH')}
          </p>
        </div>

        {/* SLA 14-Day Countdown Timer */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg flex items-center gap-4 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-300 font-mono">รับประกัน SLA 14 วัน (คืนเงิน 100%)</div>
            <div className="text-base font-black font-mono text-cyan-300">
              {timeLeft.days} วัน {timeLeft.hours} ชม. {timeLeft.minutes} นาที
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">ส่งตรงเวลาถึงหน้าประตูบ้าน</div>
          </div>
        </div>
      </div>

      {/* Visual Step Progress Tracker (7 Stages) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span>ความคืบหน้าของงาน (Progress Transparency):</span>
          <span className="text-violet-600 font-mono">
            {order.status === 'deposit_refunded' ? 'ยกเลิก & คืนเงินมัดจำ 300฿ แล้ว' : order.status === 'printing' ? 'กำลังพิมพ์ 3D ชิ้นงานจริง' : `ตรวจแบบรอบที่ ${currentRound}/3`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: 1, label: '1. มัดจำ 300฿', active: true, done: true },
            { step: 2, label: '2. ตรวจแบบรอบ 1', active: currentRound >= 1, done: currentRound > 1 || order.status === 'printing' },
            { step: 3, label: '3. ตรวจแบบรอบ 2 (สิทธิ์คืนเงิน)', active: currentRound >= 2, done: currentRound > 2 || order.status === 'printing' },
            { step: 4, label: '4. ยืนยันแบบ 3D', active: currentRound >= 3 || order.status === 'printing', done: order.status === 'printing' },
            { step: 5, label: '5. กำลังพิมพ์ 3D', active: order.status === 'printing' || order.status === 'packaging' || order.status === 'shipping' || order.status === 'delivered', done: order.status === 'shipping' || order.status === 'delivered' },
            { step: 6, label: '6. จัดส่งถึงบ้าน', active: order.status === 'shipping' || order.status === 'delivered', done: order.status === 'delivered' },
            { step: 7, label: '7. Cashback 300฿', active: order.status === 'delivered' || order.cashbackClaim?.submitted, done: order.status === 'cashback_paid' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-2xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 ${
                item.done
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : item.active
                  ? 'bg-violet-50 border-violet-400 text-violet-800 ring-1 ring-violet-400'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <span>{item.label}</span>
              {item.done && <Check className="w-3 h-3 text-emerald-600" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Revisions, Refund, Quotation & 3D Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3D Interactive Model Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Box className="w-5 h-5 text-violet-600" />
                <span>ตัวอย่างชิ้นงาน 3D (360° Real-Time Viewer)</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {order.dimensionsText || 'สูง 15 ซม.'}
              </span>
            </div>

            <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <Viewer3D
                geometryInfo={order.modelGeometry}
                material={order.material}
                autoRotate={true}
              />
            </div>
          </div>

          {/* Artisan Drafting & 3-Round Revision Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <span>แบบร่างจากช่าง & กล่องส่งข้อเสนอแนะ (Revision {currentRound}/3)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  คุณมีสิทธิ์สั่งแก้ไขแบบได้ 3 ครั้ง ก่อนยืนยันเข้าสู่กระบวนการพิมพ์ชิ้นงานจริง
                </p>
              </div>

              {/* Refund Notice Pill */}
              {isRefundableStage && currentRound === 2 && (
                <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>รอบที่ 2: โอกาสสุดท้ายในการขอคืนเงิน 300฿</span>
                </div>
              )}
            </div>

            {/* Revision Timeline Stream */}
            <div className="space-y-3">
              {(order.revisions || []).map((rev, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-violet-700">แบบร่างรอบที่ {rev.round}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{new Date(rev.submittedAt).toLocaleTimeString('th-TH')}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">{rev.artisanNote}</p>
                </div>
              ))}
            </div>

            {/* Customer Feedback Input (If under 3 revisions and not printed yet) */}
            {order.status !== 'deposit_refunded' && order.status !== 'printing' && currentRound <= 3 && (
              <form onSubmit={handleSubmitFeedback} className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800 block">
                  พิมพ์ระบุจุดที่ต้องการให้ช่างปรับแต่ง (รอบที่ {currentRound}/3):
                </label>
                <textarea
                  rows={3}
                  required
                  value={customerFeedbackText}
                  onChange={(e) => setCustomerFeedbackText(e.target.value)}
                  placeholder="เช่น ต้องการให้เพิ่มความหนาของฐานรอง, ปรับความโค้งของเขาด้านบน, หรือเพิ่มรายละเอียดลายเส้น..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  {/* Refund Trigger Button in Round 1 or 2 */}
                  {isRefundableStage ? (
                    <button
                      type="button"
                      onClick={() => setIsRefundModalOpen(true)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{currentRound === 2 ? 'ไม่พอใจแบบร่าง (ขอคืนเงินมัดจำ 300 บาทรอบสุดท้าย)' : 'ขอคืนเงินมัดจำ 300 บาท'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      * หลังรอบที่ 2 จะไม่สามารถขอคืนเงินมัดจำ 300 บาทได้เนื่องจากงานออกแบบเสร็จสิ้น
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>ส่งข้อเสนอแนะให้ช่างปรับแก้</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Stage 4: Final Price & SLA Quotation Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  ใบเสนอราคาค่าผลิตจริง & ข้อตกลง SLA
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                มัดจำ 300฿ หักลบเรียบร้อย
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500">เนื้อวัสดุ:</span>
                <div className="font-bold text-slate-900">{order.material.name}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500">น้ำหนักประมาณ:</span>
                <div className="font-bold text-slate-900 font-mono">140 กรัม</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500">เวลาพิมพ์:</span>
                <div className="font-bold text-slate-900 font-mono">~8 ชั่วโมง</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-500">การรับประกัน SLA:</span>
                <div className="font-bold text-emerald-600">14 วัน (คืนเงิน 100%)</div>
              </div>
            </div>

            {/* Financial Math */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>ค่าวัตถุดิบเรซิน & การพิมพ์:</span>
                <span className="font-mono font-semibold">฿1,200.00</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>หักลบเงินมัดจำ 300 บาทที่จ่ายแล้ว:</span>
                <span className="font-mono">-฿300.00</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-2">
                <span>ยอดคงเหลือชำระค่าผลิต:</span>
                <span className="text-violet-600 font-mono text-base">฿900.00 THB</span>
              </div>
            </div>

            {order.status !== 'printing' && order.status !== 'deposit_refunded' && (
              <button
                type="button"
                onClick={handleAcceptFinalQuotation}
                disabled={isAffirming}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ยืนยันข้อตกลงใบเสนอราคา & สั่งเริ่มพิมพ์ชิ้นงาน 3D ทันที</span>
              </button>
            )}
          </div>

          {/* Stage 7: 300 THB Cashback Photo Claim Box */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  กิจกรรมรับเงินคืน Cashback 300 บาท! (Photo Review)
                </h3>
                <p className="text-xs text-slate-600">
                  เมื่อคุณได้รับชิ้นงาน 3D ที่บ้านแล้ว เพียงถ่ายรูปสินค้าจริงส่งเข้ามา รับเงินคืน 300 บาทโอนเข้าบัญชีทันที
                </p>
              </div>
            </div>

            {cashbackSuccess || order.cashbackClaim?.submitted ? (
              <div className="bg-emerald-100 border border-emerald-300 rounded-2xl p-4 text-center space-y-1 text-xs text-emerald-900 font-bold">
                <div>✓ ส่งรูปถ่ายชิ้นงานเรียบร้อยแล้ว!</div>
                <div className="text-[11px] font-normal text-emerald-700">
                  แอดมินกำลังตรวจสอบรูปถ่ายและโอนเงินคืน 300 บาทเข้าบัญชี/พร้อมเพย์ของคุณภายใน 24 ชม.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitCashbackClaim} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    1. ถ่ายรูปสินค้าชิ้นงาน 3D จริงที่คุณได้รับ:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                  />
                  {cashbackPhotoBase64 && (
                    <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-emerald-300 shadow-sm">
                      <img src={cashbackPhotoBase64} alt="Delivered Review" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">2. ช่องทางรับเงินคืน:</label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="promptpay">🇹🇭 พร้อมเพย์ (PromptPay)</option>
                      <option value="bank">ธนาคารไทย</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">เบอร์พร้อมเพย์ / เลขบัญชี:</label>
                    <input
                      type="text"
                      required
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCashback}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>ส่งรูปถ่าย & ยืนยันรับเงินคืน 300 บาท</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Customer Info & Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-600" />
              <span>ข้อมูลจัดส่ง & ผู้รับ</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">ผู้รับ:</span>
                <span className="font-bold text-slate-900">{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">เบอร์โทร:</span>
                <span className="font-mono text-slate-800">{order.customerPhone || order.shippingAddress.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ที่อยู่:</span>
                <span className="text-right text-slate-800 max-w-[180px]">{order.shippingAddress.addressLine1}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</span>
              </div>
            </div>

            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-violet-600" />
                <span>คุยสอบถามช่างโดยตรง</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 300 THB Refund Confirmation Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">ยืนยันขอคืนเงินมัดจำ 300 บาท</h3>
                <p className="text-[11px] text-slate-500">สิทธิ์ขอคืนเงินมัดจำในรอบที่ 1 และ 2</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              คุณกำลังขอคืนเงินมัดจำ 300 บาทเต็มจำนวน เนื่องจากแบบร่างยังไม่ตรงกับความต้องการ ระบบจะยกเลิกคำสั่งซื้อและคืนเงินเข้าบัญชีเดิมของคุณทันที
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                ตรวจแบบต่อ
              </button>

              <button
                type="button"
                disabled={isSubmittingRefund}
                onClick={handleConfirmRefund}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all"
              >
                {isSubmittingRefund ? 'กำลังคืนเงิน...' : 'ยืนยันคืนเงิน 300฿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
