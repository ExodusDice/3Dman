'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wand2, 
  Sparkles, 
  UploadCloud, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Layers, 
  CreditCard, 
  RotateCcw, 
  Gift, 
  Clock, 
  Box, 
  Check, 
  Info,
  Camera,
  UserCheck
} from 'lucide-react';
import { AVAILABLE_MATERIALS } from '@/lib/materials';

export default function CustomOrderRequest() {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [dimensionsText, setDimensionsText] = useState('ความสูงประมาณ 15 ซม. (กว้างตามสัดส่วน)');
  const [intendedUse, setIntendedUse] = useState('ฟิกเกอร์ตั้งโชว์ / ของสะสมส่วนตัว');
  const [selectedMaterialId, setSelectedMaterialId] = useState('sla_ultra_resin');
  
  // Shipping Address
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Reference Images
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission & Payment State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'promptpay'>('promptpay');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Handle Multi-image upload
  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setReferenceImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Request & Create Order
  const handleProceedToDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('กรุณากรอกรายละเอียดชิ้นงาน 3D ที่คุณต้องการให้ช่างปั้นแบบ');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      alert('กรุณากรอกชื่อ อีเมล และเบอร์โทรศัพท์สำหรับติดต่อ');
      return;
    }
    setShowDepositModal(true);
  };

  const handleConfirmDepositAndCreateOrder = async () => {
    setIsSubmitting(true);

    try {
      const orderId = `3DM-${Date.now().toString().slice(-4)}`;
      const selectedMat = AVAILABLE_MATERIALS.find((m) => m.id === selectedMaterialId) || AVAILABLE_MATERIALS[0];

      const newOrder = {
        id: orderId,
        orderNumber: orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        status: 'deposit_paid',
        
        description: description.trim(),
        referenceImages,
        dimensionsText,
        intendedUse,
        
        depositAmountThb: 300,
        depositPaid: true,
        depositPaidAt: new Date().toISOString(),

        currentRevisionRound: 1,
        maxRevisions: 3,
        canRefundDeposit: true, // refundable in round 1 & 2
        revisions: [
          {
            round: 1,
            submittedAt: new Date().toISOString(),
            artisanNote: 'ช่างได้รับคำสั่งและเงินมัดจำ 300 บาทเรียบร้อยแล้ว กำลังเริ่มขึ้นโครงร่าง 3D Draft แรกสำหรับคุณ',
            status: 'pending_customer',
            isLastChanceRefund: false,
          }
        ],

        material: selectedMat,
        shippingOption: {
          id: 'standard_14d',
          name: 'จัดส่งมาตรฐาน รับประกัน SLA 14 วัน',
          slaDays: 14,
          price: 59,
          description: 'พิมพ์ด้วยความแม่นยำสูง อบแสง ตรวจสอบคุณภาพ และแพ็กเกจจัดส่ง Air Express',
          guaranteeText: 'รับประกันคืนเงิน 100% หากส่งช้ากว่า 14 วัน',
        },
        shippingAddress: {
          fullName: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          addressLine1: addressLine1.trim() || 'กรุงเทพมหานคร',
          city: city.trim() || 'กรุงเทพฯ',
          state: 'Bangkok',
          postalCode: postalCode.trim() || '10110',
          country: 'Thailand',
        },
        modelGeometry: {
          shape: referenceImages.length > 0 ? 'photo_relief' : 'cyberpunk_helmet',
          previewImageUrl: referenceImages[0] || undefined,
          widthCm: 14.0,
          heightCm: 18.0,
          depthCm: 12.0,
          infillPercent: 35,
          triangleCount: 124000,
        },
        pricing: {
          volumeCm3: 120,
          estimatedWeightGrams: 140,
          printTimeHours: 8,
          aiComputeFee: 0,
          rawMaterialCost: 350,
          machineTimeCost: 200,
          handFinishingQAFee: 150,
          slaInsuranceFee: 50,
          shippingFee: 59,
          cogsTotal: 809,
          profitMarginAmount: 391,
          profitMarginPercent: 32,
          subtotal: 1200,
          totalPrice: 1200,
        },
        slaGuaranteedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        isSlaMet: true,
        
        cashbackClaim: {
          submitted: false,
          status: 'none',
          amountThb: 300,
        }
      };

      // Save order to localStorage
      const existing = JSON.parse(localStorage.getItem('3dman_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('3dman_orders', JSON.stringify(existing));

      // Also persist last active order id
      localStorage.setItem('3dman_last_order_id', orderId);

      // Redirect to Order Tracking Page
      router.push(`/orders/${orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-slate-50 min-h-screen">
      {/* Transparency Header & Commitment */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Process Transparency • กระบวนการสร้างงาน 3D โปร่งใส 100%</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <Gift className="w-3.5 h-3.5" />
            <span>รับเงินคืน Cashback 300 บาทเมื่อส่งรูปรีวิว</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ส่งคำขอสั่งทำ & พิมพ์ชิ้นงาน 3D (Custom 3D Print Request)
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            ช่างฝีมือของเรา (Artisan) จะดูแลและปั้นแบบ 3D เฉพาะของคุณอย่างพิถีพิถัน ด้วยความช่วยเหลือของเทคโนโลยี AI และซอฟต์แวร์วิศวกรรมความละเอียดสูง พร้อมรายงานความคืบหน้าให้คุณตรวจแก้ได้ถึง 3 รอบ
          </p>
        </div>

        {/* 7-Step Visual Process Roadmap */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-600" />
            <span>ขั้นตอนการทำงานของช่าง 7 ลำดับ (Artisan Roadmap):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 relative">
              <div className="w-6 h-6 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center text-xs">1</div>
              <div className="font-bold text-slate-900">1. แจ้งแบบ & มัดจำ 300฿</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                อธิบายสิ่งที่ต้องการ + อัปโหลดรูป ชำระมัดจำเริ่มงาน 300 บาท
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 relative">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">2</div>
              <div className="font-bold text-slate-900">2. ช่างเขียนแบบ 3D</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ช่างเริ่มปั้นโมเดล 3D และส่งภาพแบบร่างให้คุณตรวจแก้ได้ 3 ครั้ง
              </p>
              <span className="text-[10px] font-bold text-amber-600 block pt-0.5">
                ★ ขอคืนเงิน 300฿ ได้ถึงรอบที่ 2
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 relative">
              <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">3</div>
              <div className="font-bold text-slate-900">3. สรุปราคา & ยืนยัน SLA</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                เมื่อแบบเสร็จ ช่างจะเสนอราคาค่าพิมพ์จริง หักลบมัดจำ 300฿ ออกให้
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 relative">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">4</div>
              <div className="font-bold text-slate-900">4. ผลิต ส่ง & Cashback 300฿</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                พิมพ์ชิ้นงาน ➔ แพ็กเกจ ➔ จัดส่งถึงบ้าน ➔ ส่งรูปรับเงินคืน 300฿!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Request Form & Pricing Summary */}
      <form onSubmit={handleProceedToDeposit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: 3D Model Description */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span>1. รายละเอียดชิ้นงาน 3D ที่ต้องการให้ช่างสร้าง</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  อธิบายสิ่งที่คุณต้องการให้ละเอียดที่สุด <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น ต้องการให้ปั้นรูปปั้นแมวสายพันธุ์เปอร์เซียสวมหมวกซามูไร มีดาบสะพายหลัง และสลักชื่อ 'KIKI' ที่ฐานรอง..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none leading-relaxed shadow-inner"
                />
              </div>

              {/* Reference Images Upload */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  อัปโหลดรูปภาพอ้างอิง / ภาพสเก็ตช์ / โลโก้ (ถ้ามี):
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="hidden"
                />

                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/40 rounded-2xl p-5 text-center cursor-pointer transition-colors space-y-1.5"
                  >
                    <UploadCloud className="w-7 h-7 text-violet-500 mx-auto" />
                    <div className="text-xs font-bold text-slate-800">
                      คลิกเพื่ออัปโหลดรูปภาพอ้างอิง (PNG, JPG, WEBP)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      สามารถเลือกได้หลายรูป เช่น ภาพมุมตรง ด้านข้าง หรือโทนสีที่ชอบ
                    </p>
                  </div>

                  {/* Image Previews */}
                  {referenceImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                      {referenceImages.map((img, idx) => (
                        <div key={idx} className="relative rounded-2xl border border-slate-200 overflow-hidden group aspect-square bg-slate-100 shadow-sm">
                          <img src={img} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dimensions & Purpose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    ขนาดมิติที่ต้องการโดยประมาณ:
                  </label>
                  <input
                    type="text"
                    value={dimensionsText}
                    onChange={(e) => setDimensionsText(e.target.value)}
                    placeholder="เช่น สูง 15 ซม., กว้าง 10 ซม."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    วัตถุประสงค์การใช้งาน:
                  </label>
                  <input
                    type="text"
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    placeholder="เช่น ตั้งโชว์, ชิ้นส่วนคอสเพลย์, อุปกรณ์กลไก"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Material Preference */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              <span>2. เนื้อวัสดุที่คาดว่าจะใช้พิมพ์ (เลือกเบื้องต้น)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AVAILABLE_MATERIALS.slice(0, 3).map((mat) => {
                const isSelected = selectedMaterialId === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterialId(mat.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-50/80 border-violet-500 shadow-md ring-1 ring-violet-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: mat.colorHex }} />
                        {mat.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold">
                            {mat.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-slate-900">{mat.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{mat.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              * ช่างจะช่วยคำนวณน้ำหนักและแนะนำวัสดุที่เหมาะสมที่สุดอีกครั้งหลังจากแบบ 3D เสร็จสมบูรณ์
            </p>
          </div>

          {/* Section 3: Contact & Address */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-violet-600" />
              <span>3. ข้อมูลติดต่อและที่อยู่จัดส่ง</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">ชื่อ-นามสกุล <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">อีเมลแจ้งเตือน <span className="text-rose-500">*</span>:</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">เบอร์โทรศัพท์ <span className="text-rose-500">*</span>:</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081-234-5678"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-800 block mb-1">ที่อยู่จัดส่ง:</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="เลขที่บ้าน, ซอย, ถนน, แขวง/ตำบล"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">รหัสไปรษณีย์:</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10110"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 300 THB Deposit Summary & Guarantee (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <div className="text-xs font-mono font-semibold text-slate-400">สรุปค่าบริการเริ่มต้น</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">มัดจำเริ่มงานช่าง 3D</div>
              <div className="text-3xl font-black text-violet-600 mt-1">
                ฿300 <span className="text-xs font-normal text-slate-500 font-sans">บาท (THB)</span>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>ช่างเริ่มเขียนแบบ 3D และส่งภาพแบบร่างให้ตรวจ</span>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>สิทธิ์สั่งแก้ไขแบบได้ <strong>3 ครั้ง (3 Revisions)</strong></span>
              </div>

              <div className="flex items-start gap-2 text-slate-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-amber-900 leading-snug">
                  <strong>การันตีคืนเงิน:</strong> ในการตรวจแบบรอบที่ 2 หากยังไม่พอใจ สามารถกดขอคืนเงินมัดจำ 300 บาทได้ 100% ทันที
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>ยอด 300 บาทนี้จะนำไป<strong>หักลบเต็มจำนวน</strong>ออกจากค่าพิมพ์ชิ้นงานจริง</span>
              </div>

              <div className="flex items-start gap-2 text-slate-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-emerald-900 font-semibold leading-snug">
                  รับ <strong>Cashback 300 บาทคืน</strong> เมื่อสินค้าส่งถึงบ้านแล้วคุณถ่ายรูปชิ้นงานส่งรีวิว!
                </span>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-2.5 text-[11px] text-slate-600 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
              />
              <span>
                ฉันเข้าใจเงื่อนไขการตรวจแบบ 3 ครั้ง และข้อตกลงการขอคืนเงินมัดจำก่อนยืนยันแบบรอบสุดท้าย
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agreedToTerms}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>ชำระมัดจำ 300 บาท & ส่งคำขอให้ช่าง</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Deposit Checkout Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">ชำระเงินมัดจำ 300 บาท</h3>
              </div>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>คำสั่ง:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{description.slice(0, 30)}...</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ลูกค้า:</span>
                <span className="font-semibold text-slate-800">{customerName}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-2">
                <span>ยอดมัดจำเริ่มต้น:</span>
                <span className="text-violet-600">300.00 THB</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">เลือกช่องทางชำระเงิน:</label>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('promptpay')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                    paymentMethod === 'promptpay'
                      ? 'bg-violet-50 border-violet-500 text-violet-700 ring-1 ring-violet-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>🇹🇭 PromptPay QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe_card')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                    paymentMethod === 'stripe_card'
                      ? 'bg-violet-50 border-violet-500 text-violet-700 ring-1 ring-violet-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>💳 บัตรเครดิต/เดบิต</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'promptpay' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                <div className="w-36 h-36 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-inner">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PROMPTPAY-3DMAN-THAILAND-300THB"
                    alt="PromptPay QR Code 300 THB"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  สแกนจ่าย 300.00 บาท (บันทึกอัตโนมัติ)
                </div>
              </div>
            )}

            {paymentMethod === 'stripe_card' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="หมายเลขบัตร 4242 •••• •••• 4242"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  defaultValue="4242 4242 4242 4242"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    defaultValue="12/28"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    defaultValue="123"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="w-1/3 py-3 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDepositAndCreateOrder}
                className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>กำลังบันทึกคำสั่ง...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ยืนยันชำระมัดจำ 300 บาท</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
