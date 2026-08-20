'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CURATED_FREE_STL_DATABASE, 
  STL_CATEGORIES, 
  STL_PLATFORMS, 
  FreeSTLModel, 
  STLCategory, 
  STLPlatform 
} from '@/lib/stl-data';
import { 
  Globe, 
  Search, 
  Download, 
  ExternalLink, 
  Wand2, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Box, 
  Check, 
  FileCode, 
  Maximize2, 
  X, 
  Filter, 
  ArrowRight,
  Cpu,
  Monitor,
  Home,
  Gamepad2,
  Shield,
  Wrench,
  Palette
} from 'lucide-react';

export default function FreeSTLLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModelForModal, setSelectedModelForModal] = useState<FreeSTLModel | null>(null);

  // Filter models
  const filteredModels = CURATED_FREE_STL_DATABASE.filter((model) => {
    const matchesPlatform = selectedPlatform === 'all' || model.source.toLowerCase() === selectedPlatform.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      model.descriptionTh.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPlatform && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-slate-50 min-h-screen">
      {/* Top Banner: Global Free 3D Repositories Explorer */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-mono font-bold border border-white/10">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>World Free 3D Models • Printables • MakerWorld • Thingiverse • Thangs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            คลังโมเดล STL ฟรีทั่วโลก & บริการสั่งพิมพ์ 3D คุณภาพสูง
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            รวบรวมไฟล์โมเดล 3D ฟรีที่มียอดดาวน์โหลดสูงสุด มีไฟล์ <strong>.STL / .STEP / .3MF</strong> พร้อมดาวน์โหลด หรือกดสั่งพิมพ์ด้วยเรซิน 8K และคาร์บอนไฟเบอร์ส่งตรงถึงบ้านใน 14 วัน
          </p>

          {/* Search Input Bar */}
          <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโมเดล 3D ฟรี เช่น มังกร, หน้ากาก, ขาตั้งมือถือ, Benchy, Gridfinity, แจกัน..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <Link
              href="/request-print"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg whitespace-nowrap flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Wand2 className="w-4 h-4 text-cyan-200" />
              <span>สั่งทำชิ้นงาน 3D ตามแบบ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Source Platform Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-violet-600" />
            <span>เลือกแพลตฟอร์มต้นทาง (Source Platform):</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">พบ {filteredModels.length} รายการ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`p-3 rounded-2xl font-bold border transition-all text-center ${
              selectedPlatform === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>🌐 ทั้ง 4 แพลตฟอร์ม</span>
          </button>

          {STL_PLATFORMS.map((plat) => (
            <button
              key={plat.id}
              onClick={() => setSelectedPlatform(plat.id)}
              className={`p-3 rounded-2xl font-bold border transition-all text-center flex items-center justify-center gap-2 ${
                selectedPlatform === plat.id
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{plat.nameTh}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills (Matching Real 3D Platforms) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800">
          หมวดหมู่ชิ้นงาน 3D (Categories):
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 text-xs">
          {STL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-violet-100 text-violet-900 border-violet-300 font-bold shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{cat.nameTh}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Models Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-3xl border border-slate-200 hover:border-violet-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              {/* Photo Thumbnail */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={model.imageUrl}
                  alt={model.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Source Platform Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm ${
                    model.source === 'Printables'
                      ? 'bg-orange-500 text-white'
                      : model.source === 'MakerWorld'
                      ? 'bg-emerald-600 text-white'
                      : model.source === 'Thingiverse'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {model.source}
                  </span>
                </div>

                {/* File Formats Pill */}
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {model.fileFormat.map((fmt, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-white/10">
                      {fmt}
                    </span>
                  ))}
                </div>

                {/* Quick View Button */}
                <button
                  type="button"
                  onClick={() => setSelectedModelForModal(model)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
                  title="ดูรายละเอียดขยาย"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Creator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>ผู้สร้าง: {model.creator}</span>
                  <span className="font-mono text-slate-500">{model.license}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                  {model.titleTh}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 italic">
                  "{model.title}"
                </p>
              </div>

              {/* Physical Print Specs */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-violet-500" />
                    <span>ขนาดมิติ:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {model.dimensionsCm.width} × {model.dimensionsCm.depth} × {model.dimensionsCm.height} ซม.
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>เวลาพิมพ์ / น้ำหนัก:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    ~{model.estimatedPrintHours} ชม. ({model.estimatedWeightGrams}g)
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-500" />
                    <span>วัสดุแนะนำ:</span>
                  </span>
                  <span className="font-semibold text-violet-700 truncate max-w-[130px]" title={model.recommendedMaterial}>
                    {model.recommendedMaterial.split('(')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Link
                href={`/request-print?prompt=${encodeURIComponent(`ต้องการสั่งพิมพ์โมเดล: ${model.title} (${model.source}) - ${model.titleTh}`)}`}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>สั่งพิมพ์ชิ้นนี้ (ส่งคำขอช่าง)</span>
              </Link>

              <a
                href={model.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>ดาวน์โหลดไฟล์ .STL ฟรี บน {model.source}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / Live Search Fallback */}
      {filteredModels.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-900">ไม่พบโมเดล "{searchQuery}" ในคลังแนะนำ</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            คุณสามารถคลิกค้นหาโมเดล 3D นับล้านชิ้นบน 4 เว็บไซต์ต้นทางได้ทันที:
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
            <a
              href={`https://www.printables.com/search/models?q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold flex items-center gap-1.5 hover:bg-orange-600"
            >
              <span>ค้นหาบน Printables ➔</span>
            </a>
            <a
              href={`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 hover:bg-emerald-700"
            >
              <span>ค้นหาบน MakerWorld ➔</span>
            </a>
            <a
              href={`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}&page=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 hover:bg-blue-700"
            >
              <span>ค้นหาบน Thingiverse ➔</span>
            </a>
            <a
              href={`https://thangs.com/search/${encodeURIComponent(searchQuery)}?scope=all`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold flex items-center gap-1.5 hover:bg-purple-700"
            >
              <span>ค้นหาบน Thangs ➔</span>
            </a>
          </div>
        </div>
      )}

      {/* Modal: Detailed 3D Model Quick View */}
      {selectedModelForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-violet-600 font-bold">{selectedModelForModal.source}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedModelForModal.titleTh}</h3>
                <p className="text-xs text-slate-500">{selectedModelForModal.title}</p>
              </div>
              <button onClick={() => setSelectedModelForModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden bg-slate-900">
              <img src={selectedModelForModal.imageUrl} alt={selectedModelForModal.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed font-medium text-slate-800">{selectedModelForModal.descriptionTh}</p>
              <p className="leading-relaxed text-slate-500 italic">"{selectedModelForModal.description}"</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">ฟอร์แมตไฟล์:</span>
                <div className="font-bold text-slate-900">{selectedModelForModal.fileFormat.join(', ')}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">ขนาดชิ้นงาน:</span>
                <div className="font-bold text-slate-900 font-mono">{selectedModelForModal.dimensionsCm.height} ซม. สูง</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">น้ำหนักประมาณ:</span>
                <div className="font-bold text-slate-900 font-mono">{selectedModelForModal.estimatedWeightGrams} กรัม</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">สัญญาอนุญาต:</span>
                <div className="font-bold text-slate-900 font-mono text-[11px]">{selectedModelForModal.license}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={selectedModelForModal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์ .STL</span>
              </a>

              <Link
                href={`/request-print?prompt=${encodeURIComponent(`ต้องการสั่งพิมพ์โมเดล: ${selectedModelForModal.title} (${selectedModelForModal.source})`)}`}
                className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/20"
              >
                <Wand2 className="w-4 h-4" />
                <span>สั่งพิมพ์ชิ้นนี้กับช่าง</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
