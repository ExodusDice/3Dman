'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GalleryDesignItem } from '@/lib/db';
import Viewer3D from '@/components/Viewer3D';
import { Star, ShieldCheck, Box, Sparkles, CheckCircle2, User, ArrowRight, Search, Layers, RefreshCw, Check } from 'lucide-react';

export default function GalleryShowcase() {
  const [designs, setDesigns] = useState<GalleryDesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<GalleryDesignItem | null>(null);
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          const items: GalleryDesignItem[] = data.designs || [];
          setDesigns(items);
          if (items.length > 0) {
            setSelectedDesign(items[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load gallery designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredDesigns = designs.filter((d) => {
    const matchesMat = filterMaterial === 'all' || d.material.id === filterMaterial;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMat && matchesSearch;
  });

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>คลังผลงานสั่งพิมพ์จริงของลูกค้า</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            แกลเลอรีโมเดล 3D และชิ้นงานจริงที่จัดส่งแล้ว
          </h2>
          <p className="text-sm text-slate-600">
            ทุกผลงานที่สั่งทำผ่าน 3DMan จะถูกบันทึกและจัดเก็บไว้ที่นี่ ท่านสามารถหมุนชมแบบ 360 องศา ดูวัสดุ และอ่านรีวิวจากผู้สั่งซื้อจริง
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชิ้นงาน 3D ตามคำสั่ง หรือชื่อผู้สั่ง..."
              className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setFilterMaterial('all')}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filterMaterial === 'all'
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              ทุกวัสดุ ({designs.length})
            </button>
            {['sla_ultra_resin', 'petg_carbon_fiber', 'antique_cast_bronze', 'translucent_glow_amber'].map((matId) => {
              const label =
                matId === 'sla_ultra_resin'
                  ? 'เรซิน 8K'
                  : matId === 'petg_carbon_fiber'
                  ? 'คาร์บอนไฟเบอร์'
                  : matId === 'antique_cast_bronze'
                  ? 'ทองสัมฤทธิ์หล่อ'
                  : 'เรซินเรืองแสง';
              return (
                <button
                  key={matId}
                  onClick={() => setFilterMaterial(matId)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    filterMaterial === matId
                      ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
            <p className="text-slate-500 text-xs font-mono">กำลังโหลดผลงานจากฐานข้อมูล...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Active 3D Model 360 View (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {selectedDesign ? (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>ผลงานพิมพ์จริงของลูกค้า</span>
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          รหัส #{selectedDesign.orderNumber}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{selectedDesign.title}</h3>
                      <div className="text-xs text-violet-700 font-mono mt-0.5">{selectedDesign.specs}</div>
                    </div>

                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-violet-100 text-violet-800 border border-violet-200 font-bold">
                      {selectedDesign.material.name}
                    </span>
                  </div>

                  <div className="h-[380px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                    <Viewer3D
                      geometryInfo={selectedDesign.modelGeometry}
                      material={selectedDesign.material}
                      autoRotate={true}
                    />
                  </div>

                  {/* Customer Review & Location Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(selectedDesign.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>จัดส่งตรงเวลาใน 14 วัน</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{selectedDesign.reviewText}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-violet-600" />
                        <span>{selectedDesign.customerName} ({selectedDesign.customerLocation})</span>
                      </div>
                      <span className="text-slate-400 font-mono">
                        {new Date(selectedDesign.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>

                  {/* Remix in Studio CTA */}
                  <Link
                    href="/studio"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>นำไอเดียนี้ไปต่อยอดในสตูดิโอ 3D AI</span>
                  </Link>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">เลือกชิ้นงานเพื่อหมุนดูแบบ 360 องศา</div>
              )}
            </div>

            {/* Right Column: Scrollable Customer Design Archive Cards (6 cols) */}
            <div className="lg:col-span-6 space-y-3.5 max-h-[820px] overflow-y-auto pr-1">
              {filteredDesigns.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 text-xs">
                  ไม่พบชิ้นงานที่ตรงกับคำค้นหา
                </div>
              ) : (
                filteredDesigns.map((item) => {
                  const isSelected = selectedDesign?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDesign(item)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-violet-50/80 border-violet-500 shadow-md ring-1 ring-violet-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                              ✓ ชิ้นงานผลิตจริง
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{item.orderNumber}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                          <div className="text-[11px] text-violet-700 font-mono mt-0.5">{item.specs}</div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        "{item.prompt}"
                      </p>

                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">{item.customerName} • {item.customerLocation}</span>
                        <span className="text-violet-600 font-semibold flex items-center gap-1">
                          <span>หมุนดู 360°</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
