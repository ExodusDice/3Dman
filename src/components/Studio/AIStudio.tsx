'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArtStyle, MaterialOption, ModelGeometryInfo, ShippingOption } from '@/types';
import { AVAILABLE_MATERIALS, AVAILABLE_SHIPPING_OPTIONS } from '@/lib/materials';
import { calculateProfitPrice } from '@/lib/pricing';
import Viewer3D from '@/components/Viewer3D';
import PriceEstimator from '@/components/Studio/PriceEstimator';
import CheckoutModal from '@/components/CheckoutModal';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Box, 
  Sliders, 
  AlertCircle, 
  CheckCircle, 
  Flame, 
  Image as ImageIcon, 
  UploadCloud, 
  Key, 
  X, 
  ExternalLink, 
  FileText, 
  HelpCircle,
  Check
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { text: 'Cyberpunk samurai oni mask with glowing geometric horns and respirator tubes', style: 'cyberpunk' as ArtStyle },
  { text: 'หน้ากากนักรบไซเบอร์พังค์ โอนิ มีเขาเหลี่ยมเรขาคณิตและท่อหายใจเรืองแสงนีออน', style: 'cyberpunk' as ArtStyle },
  { text: 'Ancient celestial dragon coiled around crystal orb, sharp scales and museum finish', style: 'realistic' as ArtStyle },
  { text: 'Roman Emperor Marcus Aurelius bronze classical bust portrait', style: 'ancient_bronze' as ArtStyle },
  { text: 'Sci-fi heavy mech assault robot with shoulder cannon and power reactor', style: 'sci_fi_mech' as ArtStyle },
  { text: 'Chibi cute cyber fox mascot wearing large mechanical headphones', style: 'anime_cartoon' as ArtStyle },
  { text: 'Organic Voronoi parametric twisted art vase', style: 'voronoi_art' as ArtStyle },
];

export default function AIStudio() {
  // Mode: Text-to-3D or Image-to-3D
  const [studioMode, setStudioMode] = useState<'text' | 'image'>('text');

  // Text Prompt & Style
  const [prompt, setPrompt] = useState('Cyberpunk samurai oni mask with glowing geometric horns and respirator tubes');
  const [negativePrompt, setNegativePrompt] = useState('low quality, low resolution, messy mesh, non-manifold');
  const [artStyle, setArtStyle] = useState<ArtStyle>('cyberpunk');

  // Image Upload state
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Meshy API Key management
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);

  // Generation & Task Progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(100);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [taskId, setTaskId] = useState<string | null>(null);

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

  // Load saved API key on mount
  useEffect(() => {
    const saved = localStorage.getItem('3dman_meshy_api_key');
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('3dman_meshy_api_key', apiKey.trim());
    setSavedKeyNotification(true);
    setTimeout(() => setSavedKeyNotification(false), 2500);
    setIsApiKeyModalOpen(false);
  };

  // Image Upload Handler
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัปโหลดไฟล์รูปภาพ เช่น PNG, JPG หรือ WEBP (Please upload an image file)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB (Image size must be under 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedImageBase64(base64);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Calculate live profit price
  const pricing = calculateProfitPrice({
    widthCm: geometryInfo.widthCm,
    heightCm: geometryInfo.heightCm,
    depthCm: geometryInfo.depthCm,
    infillPercent: geometryInfo.infillPercent,
    material: selectedMaterial,
    shippingOption: selectedShipping,
  });

  // Handle Generation with Meshy AI & Task Polling
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (studioMode === 'text' && !prompt.trim()) {
      alert('กรุณากรอกคำสั่งชิ้นงาน 3D (Please enter a prompt)');
      return;
    }

    if (studioMode === 'image' && !uploadedImageBase64) {
      alert('กรุณาอัปโหลดรูปภาพที่ต้องการแปลงเป็น 3D (Please upload an image)');
      return;
    }

    if (revisionCount >= maxRevisions) {
      alert('คุณใช้สิทธิ์ปรับแต่งครบ 3 ครั้งแล้วสำหรับรอบนี้ กรุณายืนยันคำสั่งซื้อ หรือเริ่มรอบใหม่');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(10);
    setStatusMessage(studioMode === 'image' ? 'กำลังอัปโหลดรูปภาพไปยัง Meshy AI...' : 'กำลังส่งคำสั่งปั้นโมเดลไปยัง Meshy AI...');

    try {
      const response = await fetch('/api/meshy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: studioMode === 'image' ? 'image-to-3d' : 'text-to-3d',
          prompt: prompt.trim(),
          imageUrl: uploadedImageBase64 || undefined,
          negativePrompt,
          style: artStyle,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const initialResult = await response.json();

      if (!initialResult.success) {
        throw new Error(initialResult.error || 'Failed to initialize Meshy AI task');
      }

      const activeTaskId = initialResult.taskId;
      setTaskId(activeTaskId);

      // If simulated/local task, finish immediately
      if (activeTaskId.startsWith('meshy_local_')) {
        setGenerationProgress(100);
        setStatusMessage('เรนเดอร์โมเดล 3D สำเร็จ!');
        setGeometryInfo((prev) => ({
          ...prev,
          shape: initialResult.modelGeometry.shape,
          glbUrl: undefined,
          previewImageUrl: uploadedImageBase64 || undefined,
          triangleCount: initialResult.modelGeometry.triangleCount,
        }));
        setRevisionCount((c) => c + 1);
        setRevisionHistory((prev) => [
          ...prev,
          { prompt: studioMode === 'image' ? `Image: ${uploadedFileName}` : prompt.trim(), style: artStyle, timestamp: new Date().toLocaleTimeString('th-TH') },
        ]);
        setIsGenerating(false);
        return;
      }

      // Live Meshy Polling Loop
      let isDone = false;
      let pollAttempts = 0;
      const maxAttempts = 80;

      while (!isDone && pollAttempts < maxAttempts) {
        pollAttempts++;
        await new Promise((r) => setTimeout(r, 2500));

        const pollRes = await fetch(`/api/meshy?taskId=${activeTaskId}&taskType=${studioMode === 'image' ? 'image-to-3d' : 'text-to-3d'}&apiKey=${encodeURIComponent(apiKey.trim())}`);
        if (!pollRes.ok) continue;

        const pollData = await pollRes.json();

        if (pollData.status === 'IN_PROGRESS' || pollData.status === 'PENDING') {
          const currentProgress = Math.max(15, pollData.progress || Math.min(95, pollAttempts * 4));
          setGenerationProgress(currentProgress);
          setStatusMessage(`Meshy AI กำลังปั้น 3D Mesh (${currentProgress}%)...`);
        } else if (pollData.status === 'SUCCEEDED') {
          isDone = true;
          setGenerationProgress(100);
          setStatusMessage('ดาวน์โหลดและเรนเดอร์โมเดล 3D GLB สำเร็จ!');

          setGeometryInfo((prev) => ({
            ...prev,
            shape: 'custom_glb',
            glbUrl: pollData.glbUrl,
            previewImageUrl: pollData.thumbnailUrl || uploadedImageBase64 || undefined,
            triangleCount: pollData.modelGeometry?.triangleCount || 142000,
          }));

          setRevisionCount((c) => c + 1);
          setRevisionHistory((prev) => [
            ...prev,
            { prompt: studioMode === 'image' ? `Image: ${uploadedFileName}` : prompt.trim(), style: artStyle, timestamp: new Date().toLocaleTimeString('th-TH') },
          ]);
        } else if (pollData.status === 'FAILED') {
          isDone = true;
          alert(`Meshy AI ประมวลผลไม่สำเร็จ: ${pollData.errorMessage || 'เกิดข้อผิดพลาดในการสร้างโมเดล'}`);
        }
      }
    } catch (err: any) {
      console.error('Meshy generation error:', err);
      alert(`เกิดข้อผิดพลาดในการเชื่อมต่อ Meshy AI: ${err.message || 'กรุณาลองใหม่อีกครั้ง'}`);
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Meshy AI 3D Studio & Full Fulfillment Service</span>
              </span>

              {/* Meshy Key Status Badge */}
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all border ${
                  apiKey
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-violet-400'
                }`}
                title="ตั้งค่า Meshy API Key ของคุณ"
              >
                <Key className="w-3 h-3 text-violet-600" />
                <span>{apiKey ? 'Meshy API: เชื่อมต่อแล้ว (Connected)' : 'ตั้งค่า Meshy API Key'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              สร้างโมเดล 3D ด้วย Meshy AI (Text & Image to 3D)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              รองรับทั้งการพิมพ์คำสั่ง (ภาษาไทย & English) หรืออัปโหลดรูปภาพ 2D เพื่อให้ Meshy AI ปั้นเป็นโมเดล 3D แบบเรียลไทม์ พร้อมเลือกวัสดุและสั่งพิมพ์ส่งถึงบ้านใน 14 วัน
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
          {/* Studio Mode Selector (Text-to-3D vs Image-to-3D) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                <span>สตูดิโอ Meshy AI Engine</span>
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

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setStudioMode('text')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  studioMode === 'text'
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text to 3D (ข้อความ)</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('image')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  studioMode === 'image'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image to 3D (อัปโหลดรูป)</span>
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Mode 1: Text-to-3D Input */}
              {studioMode === 'text' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      อธิบายรูปร่างชิ้นงาน 3D (ภาษาไทย หรือ English):
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      placeholder="e.g. Cyberpunk samurai oni mask, Roman bronze bust, dragon coiled around crystal orb..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* Art Style Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      สไตล์ศิลปะของโมเดล (Art Style):
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { id: 'cyberpunk', name: 'Cyberpunk (ไซเบอร์พังค์)' },
                        { id: 'realistic', name: 'Realistic (สมจริง)' },
                        { id: 'ancient_bronze', name: 'Bronze (ทองสัมฤทธิ์)' },
                        { id: 'sculpted_marble', name: 'Marble (หินอ่อน)' },
                        { id: 'sci_fi_mech', name: 'Sci-Fi Mech (หุ่นยนต์)' },
                        { id: 'anime_cartoon', name: 'Anime (ฟิกเกอร์การ์ตูน)' },
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
                </div>
              )}

              {/* Mode 2: Image-to-3D Upload */}
              {studioMode === 'image' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 block">
                    อัปโหลดรูปภาพ 2D เพื่อให้ Meshy AI แปลงเป็นโมเดล 3D:
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {uploadedImageBase64 ? (
                    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                      <img
                        src={uploadedImageBase64}
                        alt="Uploaded preview"
                        className="w-16 h-16 object-cover rounded-xl border border-slate-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{uploadedFileName || 'ภาพที่เลือก'}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">✓ รูปภาพพร้อมแปลงเป็น 3D</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImageBase64(null);
                          setUploadedFileName('');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="ลบรูปภาพ"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-violet-500 bg-slate-50/70 hover:bg-violet-50/40 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                    >
                      <UploadCloud className="w-8 h-8 text-violet-500 mx-auto" />
                      <div className="text-xs font-bold text-slate-800">
                        คลิกเพื่อเลือกไฟล์รูปภาพ หรือลากรูปมาวางที่นี่
                      </div>
                      <p className="text-[11px] text-slate-500">
                        รองรับ PNG, JPG, WEBP สูงสุด 10MB (ภาพแนวตรง ชัดเจน จะได้โมเดล 3D ที่ดีที่สุด)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Generation Progress Bar */}
              {isGenerating && (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-violet-800 font-bold flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{statusMessage}</span>
                    </span>
                    <span className="text-violet-700 font-bold">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-violet-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Generate / Re-edit Button */}
              <button
                type="submit"
                disabled={isGenerating || revisionCount >= maxRevisions}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Meshy AI กำลังปั้น 3D...</span>
                  </>
                ) : revisionCount === 0 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างโมเดล 3D (Generate 3D)</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>ปรับแต่งโมเดล 3D (เหลือสิทธิ์ {maxRevisions - revisionCount} ครั้ง)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Inspiration Prompts */}
            {studioMode === 'text' && (
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>ตัวอย่างคำสั่งแนะนำ (ไทย & English):</span>
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
            )}
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

      {/* Meshy API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">ตั้งค่า Meshy AI API Key</h3>
              </div>
              <button onClick={() => setIsApiKeyModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ใส่ API Key ของบัญชี Meshy AI เพื่อใช้เครดิตเจนโมเดล 3D แบบ Text-to-3D และ Image-to-3D ของคุณโดยตรง:
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Meshy API Key (msy_...):</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="msy_your_secret_api_key..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-violet-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>ยังไม่มี API Key?</span>
                <a
                  href="https://www.meshy.ai/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>รับฟรี API Key ที่ Meshy.ai</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold shadow-md shadow-violet-500/20 hover:scale-105 transition-all"
                >
                  บันทึก & ใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          prompt={studioMode === 'image' ? `Image: ${uploadedFileName}` : prompt}
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
