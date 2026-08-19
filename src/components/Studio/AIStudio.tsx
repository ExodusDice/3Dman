'use client';

import React, { useState } from 'react';
import { ArtStyle, MaterialOption, ModelGeometryInfo, ShippingOption } from '@/types';
import { AVAILABLE_MATERIALS, AVAILABLE_SHIPPING_OPTIONS } from '@/lib/materials';
import { calculateProfitPrice } from '@/lib/pricing';
import { generate3DModel } from '@/lib/meshy';
import Viewer3D from '@/components/Viewer3D';
import PriceEstimator from '@/components/Studio/PriceEstimator';
import CheckoutModal from '@/components/CheckoutModal';
import { Sparkles, Wand2, RefreshCw, Layers, ShieldCheck, Box, Sliders, AlertCircle, CheckCircle, Flame } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { text: 'หน้ากากนักรบไซเบอร์พังค์ โอนิ มีเขาเหลี่ยมเรขาคณิตและท่อหายใจเรืองแสงนีออน', style: 'cyberpunk' as ArtStyle },
  { text: 'มังกรสวรรค์ในตำนานพันรอบลูกแก้วคริสตัล ลำตัวมีเกล็ดคมชัดและดวงตาสง่างาม', style: 'realistic' as ArtStyle },
  { text: 'รูปปั้นครึ่งตัวจักรพรรดิโรมัน มาร์คุส ออเรลิอุส สไตล์ทองสัมฤทธิ์โบราณพิพิธภัณฑ์', style: 'ancient_bronze' as ArtStyle },
  { text: 'หุ่นยนต์เมคาทหารเกราะหนักไซไฟ พร้อมกระบอกปืนใหญ่ที่หัวไหล่และเตาปฏิกรณ์พลังงาน', style: 'sci_fi_mech' as ArtStyle },
  { text: 'แจกันรูปทรงเกลียวพารามิเตอร์ Voronoi เส้นสายออร์แกนิกสลับซับซ้อน', style: 'voronoi_art' as ArtStyle },
  { text: 'มาสคอตจิ้งจอกไซเบอร์ตัวจิ๋ว (Chibi) สวมหูฟังเมคานิกส์ขนาดใหญ่', style: 'anime_cartoon' as ArtStyle },
];

export default function AIStudio() {
  const [prompt, setPrompt] = useState('หน้ากากนักรบไซเบอร์พังค์ โอนิ มีเขาเหลี่ยมเรขาคณิตและท่อหายใจเรืองแสงนีออน');
  const [artStyle, setArtStyle] = useState<ArtStyle>('cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(100);

  // Model geometry & scale
  const [geometryInfo, setGeometryInfo] = useState<ModelGeometryInfo>({
    shape: 'cyberpunk_helmet',
    widthCm: 14.0,
    heightCm: 18.0,
    depthCm: 12.0,
    infillPercent: 35,
    triangleCount: 124000,
  });

  // Material & Shipping
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(AVAILABLE_MATERIALS[0]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(AVAILABLE_SHIPPING_OPTIONS[0]);

  // Revision management: customer can re-edit up to 3 times
  const [revisionCount, setRevisionCount] = useState(0);
  const maxRevisions = 3;
  const [revisionHistory, setRevisionHistory] = useState<Array<{ prompt: string; style: ArtStyle; timestamp: string }>>([]);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Calculate live profit price
  const pricing = calculateProfitPrice({
    widthCm: geometryInfo.widthCm,
    heightCm: geometryInfo.heightCm,
    depthCm: geometryInfo.depthCm,
    infillPercent: geometryInfo.infillPercent,
    material: selectedMaterial,
    shippingOption: selectedShipping,
  });

  // Handle generation / re-edit
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    if (revisionCount >= maxRevisions) {
      alert('คุณใช้สิทธิ์ปรับแต่งครบ 3 ครั้งแล้วสำหรับรอบนี้ กรุณายืนยันคำสั่งซื้อ หรือเริ่มรอบใหม่');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(20);

    const progressTimer = setInterval(() => {
      setGenerationProgress((p) => Math.min(p + 25, 90));
    }, 300);

    try {
      const result = await generate3DModel({
        prompt: prompt.trim(),
        style: artStyle,
      });

      clearInterval(progressTimer);
      setGenerationProgress(100);

      if (result.success) {
        setGeometryInfo((prev) => ({
          ...prev,
          shape: result.modelGeometry.shape,
          triangleCount: result.modelGeometry.triangleCount,
        }));

        setRevisionCount((c) => c + 1);
        setRevisionHistory((prev) => [
          ...prev,
          { prompt: prompt.trim(), style: artStyle, timestamp: new Date().toLocaleTimeString('th-TH') },
        ]);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScaleChange = (newHeight: number) => {
    const scaleFactor = newHeight / geometryInfo.heightCm;
    setGeometryInfo((prev) => ({
      ...prev,
      heightCm: Number(newHeight.toFixed(1)),
      widthCm: Number((prev.widthCm * scaleFactor).toFixed(1)),
      depthCm: Number((prev.depthCm * scaleFactor).toFixed(1)),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Top Banner: Full Service & SLA Commitment */}
      <div className="bg-gradient-to-r from-violet-50 via-white to-cyan-50 border border-violet-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>บริการครบวงจร: AI ปั้นโมเดล 3D ➔ พิมพ์ชิ้นงานจริง ➔ ส่งถึงบ้าน</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              สร้างโมเดล 3D และสั่งพิมพ์ชิ้นงานจริงของคุณ
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              เพียงพิมพ์อธิบายชิ้นงานที่ต้องการ Meshy AI จะขึ้นรูปทรง 3D จากนั้นฟาร์มเครื่องพิมพ์ของเราจะผลิตด้วยเรซินความละเอียดสูง หรือคาร์บอนไฟเบอร์ พร้อมจัดส่งถึงบ้านคุณภายใน 14 วัน
            </p>
          </div>

          {/* SLA Badge Seal */}
          <div className="flex-shrink-0 bg-white border border-emerald-300 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900">รับประกัน SLA 14 วัน</div>
              <div className="text-xs text-emerald-600 font-bold">การันตีคืนเงิน 100%</div>
              <div className="text-[10px] text-slate-500">จัดส่งตรงเวลาถึงหน้าประตูบ้าน</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Prompt & Re-edit Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prompt Generator Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                <span>สตูดิโอคำสั่ง Meshy AI</span>
              </h2>

              {/* Revision Badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                revisionCount < 3
                  ? 'bg-violet-50 text-violet-700 border border-violet-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}>
                <span>เหลือสิทธิ์แก้ {maxRevisions - revisionCount} / {maxRevisions} ครั้ง</span>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  อธิบายรูปร่างชิ้นงาน 3D ที่ต้องการสร้าง:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="เช่น หน้ากากไซเบอร์พังค์มีเขาเรืองแสง, รูปปั้นโรมันคลาสสิก, หรือ มังกรพันลูกแก้ว..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none leading-relaxed shadow-inner"
                />
              </div>

              {/* Art Style Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  เลือกสไตล์และอารมณ์ของชิ้นงาน:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'cyberpunk', name: 'ไซเบอร์พังค์ (Cyberpunk)' },
                    { id: 'realistic', name: 'สมจริงเสมือนจริง (Realistic)' },
                    { id: 'ancient_bronze', name: 'ทองสัมฤทธิ์โบราณ (Bronze)' },
                    { id: 'sculpted_marble', name: 'หินอ่อนแกะสลัก (Marble)' },
                    { id: 'sci_fi_mech', name: 'หุ่นยนต์เมคาไซไฟ (Mech)' },
                    { id: 'anime_cartoon', name: 'ฟิกเกอร์อนิเมะ (Anime)' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setArtStyle(style.id as ArtStyle)}
                      className={`px-3 py-2 rounded-xl text-left font-medium transition-all ${
                        artStyle === style.id
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20 font-bold'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate / Re-edit Button */}
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim() || revisionCount >= maxRevisions}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI กำลังประมวลผลโมเดล 3D ({generationProgress}%)...</span>
                  </>
                ) : revisionCount === 0 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างโมเดล 3D เริ่มต้น</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>ปรับแต่งโมเดล 3D (เหลือสิทธิ์ {maxRevisions - revisionCount} ครั้ง)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Inspiration Pills */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>ตัวอย่างคำสั่งยอดนิยม:</span>
              </div>
              <div className="space-y-1.5">
                {SUGGESTED_PROMPTS.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(item.text);
                      setArtStyle(item.style);
                    }}
                    className="w-full text-left text-[11px] text-slate-600 hover:text-violet-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 truncate transition-colors font-medium"
                  >
                    "{item.text}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Physical Dimensions & Infill Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-600" />
              <span>ขนาดชิ้นงานจริง & ความหนาแน่น Infill</span>
            </h3>

            {/* Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">ความสูงของโมเดล:</span>
                <span className="font-mono font-bold text-violet-700">{geometryInfo.heightCm} ซม. ({Number((geometryInfo.heightCm / 2.54).toFixed(1))} นิ้ว)</span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                step="0.5"
                value={geometryInfo.heightCm}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>8 ซม. (มินิโมเดล)</span>
                <span>18 ซม. (มาตรฐาน)</span>
                <span>30 ซม. (สะสมใหญ่)</span>
              </div>
            </div>

            {/* Infill Percentage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">ความหนาแน่นเนื้อใน (Infill):</span>
                <span className="font-mono font-bold text-cyan-700">{geometryInfo.infillPercent}% Infill</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={geometryInfo.infillPercent}
                onChange={(e) => setGeometryInfo((prev) => ({ ...prev, infillPercent: parseInt(e.target.value) }))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20% (เบามาตรฐาน)</span>
                <span>40% (เนื้อแน่นแข็งแรง)</span>
                <span>80% (ตันหนักพิเศษ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: 360° Interactive 3D Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-[480px] sm:h-[520px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <Viewer3D
              geometryInfo={geometryInfo}
              material={selectedMaterial}
              autoRotate={true}
            />
          </div>

          {/* Material Selector Grid */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-600" />
                <span>เลือกวัสดุสำหรับพิมพ์ชิ้นงาน:</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {selectedMaterial.finish}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_MATERIALS.map((mat) => {
                const isSelected = selectedMaterial.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-3 rounded-2xl text-left transition-all relative border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-50/80 border-violet-500 shadow-md ring-1 ring-violet-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                          style={{ backgroundColor: mat.colorHex }}
                        />
                        {mat.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold">
                            {mat.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-slate-900 leading-snug">{mat.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{mat.description}</div>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-violet-700 font-bold">
                      ${mat.pricePerGram.toFixed(2)}/กรัม
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Checkout Quote Engine (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Shipping SLA Selector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ตัวเลือกการจัดส่ง & SLA</span>
            </h3>

            <div className="space-y-2">
              {AVAILABLE_SHIPPING_OPTIONS.map((ship) => {
                const isSelected = selectedShipping.id === ship.id;
                return (
                  <button
                    key={ship.id}
                    onClick={() => setSelectedShipping(ship)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-xs text-slate-900">{ship.name}</div>
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        +${ship.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{ship.description}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{ship.guaranteeText}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing Engine & Order CTA */}
          <PriceEstimator
            pricing={pricing}
            selectedMaterial={selectedMaterial}
            selectedShipping={selectedShipping}
            onProceedToOrder={() => setIsCheckoutOpen(true)}
            revisionCount={revisionCount}
            maxRevisions={maxRevisions}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          prompt={prompt}
          artStyle={artStyle}
          geometryInfo={geometryInfo}
          material={selectedMaterial}
          shippingOption={selectedShipping}
          pricing={pricing}
          revisionCount={revisionCount}
        />
      )}
    </div>
  );
}
