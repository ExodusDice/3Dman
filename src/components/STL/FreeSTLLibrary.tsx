'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CURATED_FREE_STL_MODELS, 
  GLOBAL_STL_REPOSITORIES, 
  FreeSTLModel, 
  STLRepository 
} from '@/lib/stl-data';
import { 
  Search, 
  Download, 
  Sparkles, 
  ExternalLink, 
  Box, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Globe, 
  Flame, 
  SlidersHorizontal, 
  Check, 
  FolderDown,
  Wand2,
  Tag
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด (All)', nameEn: 'All Models' },
  { id: 'scifi', name: '🤖 ไซไฟ & เมคา', nameEn: 'Sci-Fi & Mech' },
  { id: 'fantasy', name: '🐉 แฟนตาซี & ข้อต่อ', nameEn: 'Fantasy & Flexi' },
  { id: 'art_statue', name: '🏛️ ประติมากรรม & ศิลปะ', nameEn: 'Art & Busts' },
  { id: 'functional', name: '🛠️ ของใช้ & เครื่องมือ', nameEn: 'Functional & Tools' },
  { id: 'home_decor', name: '🪴 ของแต่งบ้าน & แจกัน', nameEn: 'Home & Decor' },
  { id: 'engineering', name: '🚀 วิศวกรรม & อวกาศ NASA', nameEn: 'Engineering & NASA' },
];

export default function FreeSTLLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModelForPreview, setSelectedModelForPreview] = useState<FreeSTLModel | null>(null);

  // Filter models
  const filteredModels = CURATED_FREE_STL_MODELS.filter((model) => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = 
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-mono font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>World Free 3D Models & Global Open Repositories</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            คลังโมเดล STL ฟรีทั่วโลก & บริการสั่งพิมพ์ 3D คุณภาพสูง
          </h1>

          <p className="text-sm sm:text-base text-violet-100 leading-relaxed font-normal">
            ค้นพบและดาวน์โหลดไฟล์ 3D Printable ฟรีระดับโลกจาก Thingiverse, Printables, MakerWorld และ NASA หรือเลือกสั่งพิมพ์ด้วยเรซิน 8K หรือคาร์บอนไฟเบอร์ พร้อมจัดส่งถึงบ้านคุณใน 14 วัน
          </p>

          {/* Search Box */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโมเดล 3D ฟรี เช่น มังกร, หน้ากาก, หุ่นยนต์, แจกัน, stand, dragon..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg whitespace-nowrap flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Wand2 className="w-4 h-4 text-slate-950" />
              <span>สั่งทำชิ้นงาน 3D</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global STL Search Engines Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-600" />
            <h2 className="font-extrabold text-base text-slate-900">
              เว็บไซต์รวมไฟล์ 3D ฟรีระดับโลก (Global 3D Repositories)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            รวมไฟล์ STL ฟรีมากกว่า 25,000,000+ โมเดล
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GLOBAL_STL_REPOSITORIES.map((repo) => (
            <a
              key={repo.name}
              href={searchQuery ? repo.searchUrl(searchQuery) : repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-violet-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    {repo.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-700 transition-colors">
                  {repo.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">{repo.itemCount}</span>
                <span className="text-violet-600 font-bold group-hover:underline">
                  {searchQuery ? `ค้นหา "${searchQuery}"` : 'เข้าชมเว็บไซต์ ➔'}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Model Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>โมเดล 3D ยอดนิยมพร้อมดาวน์โหลด & สั่งพิมพ์</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">
              {filteredModels.length} รายการ
            </span>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            ไฟล์ทั้งหมดได้รับการทดสอบว่าพิมพ์ได้จริง 100% (Manifold Tested)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative aspect-video sm:aspect-square w-full bg-slate-100 overflow-hidden">
                <img
                  src={model.imageUrl}
                  alt={model.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Source Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <Box className="w-3 h-3 text-violet-600" />
                  <span>{model.source}</span>
                </div>

                {/* License Tag */}
                <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold shadow-sm">
                  {model.license}
                </div>

                {/* Formats Pills */}
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {model.fileFormat.map((fmt) => (
                    <span
                      key={fmt}
                      className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-mono px-1.5 py-0.5 rounded"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-violet-600">
                    {model.categoryTh} • โดย {model.creator}
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-violet-600 transition-colors leading-snug line-clamp-2">
                    {model.titleTh}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {model.descriptionTh}
                  </p>
                </div>

                {/* Tech Specs */}
                <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-[11px] border border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Box className="w-3.5 h-3.5 text-indigo-500" />
                      <span>ขนาดพิมพ์:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {model.dimensionsCm.width} × {model.dimensionsCm.depth} × {model.dimensionsCm.height} ซม.
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>เวลาพิมพ์โดยประมาณ:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      ~{model.estimatedPrintHours} ชม.
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                      <span>วัสดุแนะนำ:</span>
                    </span>
                    <span className="font-semibold text-violet-700 truncate max-w-[140px]" title={model.recommendedMaterial}>
                      {model.recommendedMaterial.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Link
                    href={`/request-print?prompt=${encodeURIComponent(model.title)}`}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>สั่งพิมพ์ชิ้นนี้ (ส่งคำขอช่าง)</span>
                  </Link>

                  <a
                    href={model.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>ดาวน์โหลดไฟล์ STL ฟรี ({model.source})</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-slate-900">ไม่พบโมเดลที่ค้นหา "{searchQuery}" ในคลังแนะนำ</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              คุณสามารถคลิกค้นหาโมเดลนี้ข้ามเว็บทั่วโลกบน Yeggi หรือ Printables ได้ทันที:
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <a
                href={`https://www.yeggi.com/q/${encodeURIComponent(searchQuery)}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <span>ค้นหาบน Yeggi ➔</span>
              </a>
              <a
                href={`https://www.printables.com/search/models?q=${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5"
              >
                <span>ค้นหาบน Printables ➔</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Service Guarantee Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              มีไฟล์ STL ของตัวเองแล้ว ต้องการสั่งพิมพ์?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คุณสามารถอัปโหลดไฟล์ STL หรือรูปภาพคอนเซปต์ให้ช่างประเมินราคาและสั่งพิมพ์ด้วยเรซิน 8K ได้ทันที
            </p>
          </div>
        </div>

        <Link
          href="/request-print"
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4 text-violet-400" />
          <span>ส่งคำขอสั่งพิมพ์ชิ้นงาน ➔</span>
        </Link>
      </div>
    </div>
  );
}
