'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowRight, Eye, Star } from 'lucide-react';

interface RunningProduct {
  id: string;
  title: string;
  prompt: string;
  material: string;
  timeToPrint: string;
  rating: number;
  imageUrl: string;
  badge: string;
  price: string;
}

const RUNNING_PRODUCTS: RunningProduct[] = [
  {
    id: 'mesh_1',
    title: 'หน้ากากนักรบไซเบอร์พังค์ โอนิ',
    prompt: 'Cyberpunk Oni mask with neon geometric horn vents and mechanical visor',
    material: 'คาร์บอนไฟเบอร์ PETG',
    timeToPrint: 'จัดส่งใน 8 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    badge: 'Artisan Custom 3D',
    price: '฿2,500',
  },
  {
    id: 'mesh_2',
    title: 'รูปปั้นจักรพรรดิโรมัน โบราณ',
    prompt: 'Ancient Roman Emperor bust with weathered bronze patina and classical drapery',
    material: 'ทองสัมฤทธิ์หล่อแท้ 80%',
    timeToPrint: 'จัดส่งใน 10 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    badge: 'Museum Cast Bronze',
    price: '฿3,800',
  },
  {
    id: 'mesh_3',
    title: 'มังกรสวรรค์พันลูกแก้วคริสตัล',
    prompt: 'Majestic celestial dragon coiled around a glowing crystal orb with sharp scales',
    material: 'เรซิน 8K ความละเอียด 25 ไมครอน',
    timeToPrint: 'จัดส่งใน 7 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    badge: '8K Ultra Detail',
    price: '฿2,900',
  },
  {
    id: 'mesh_4',
    title: 'หุ่นยนต์ไททันเมคา เกราะหนัก',
    prompt: 'Sci-Fi Mech Titan with heavy shoulder cannons and chest power core',
    material: 'เรซินเรืองแสง Glow Amber',
    timeToPrint: 'จัดส่งใน 9 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80',
    badge: 'Heavy Mech Armor',
    price: '฿3,200',
  },
  {
    id: 'mesh_5',
    title: 'แจกันเกลียวพารามิเตอร์ Voronoi',
    prompt: 'Parametric twisted organic Voronoi spiral sculpture vase with smooth curves',
    material: 'เรซินใสออพติคอล Crystal Clear',
    timeToPrint: 'จัดส่งใน 6 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Voronoi Art',
    price: '฿1,800',
  },
  {
    id: 'mesh_6',
    title: 'มาสคอตจิ้งจอกไซเบอร์ตัวจิ๋ว',
    prompt: 'Chibi cute robotic fox character wearing oversized mechanical headphones',
    material: 'เรซิน 8K ความละเอียดสูง',
    timeToPrint: 'จัดส่งใน 5 วัน',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    badge: 'Chibi Anime Figurine',
    price: '฿1,450',
  },
];

export default function RunningProductsMarquee() {
  const duplicatedProducts = [...RUNNING_PRODUCTS, ...RUNNING_PRODUCTS];

  return (
    <div className="py-12 bg-white border-b border-slate-200 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-mono font-semibold border border-violet-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Production Showcase • ผลงานจริงที่จัดส่งถึงมือลูกค้า</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          ผลงานชิ้นงาน 3D จากช่างฝีมือ 3DMan และผลิตสำเร็จแล้ว
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          ชมผลงานชิ้นเอกที่สั่งทำตามแบบและพิมพ์ด้วยวัสดุจริงคุณภาพสูง จัดส่งถึงมือผู้สั่งซื้อในไทย
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max py-2">
          {duplicatedProducts.map((prod, index) => (
            <div
              key={`${prod.id}_${index}`}
              className="w-[300px] sm:w-[320px] bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-violet-400 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Product Image */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-violet-700 border border-violet-200 shadow-sm">
                      {prod.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-white font-mono font-bold text-xs">
                    {prod.price}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(prod.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{prod.timeToPrint}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
                    "{prod.prompt}"
                  </p>
                </div>
              </div>

              {/* Bottom Specs & Action */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-600 text-[11px] font-medium">
                  {prod.material}
                </span>

                <Link
                  href="/request-print"
                  className="text-violet-600 hover:text-violet-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-xs"
                >
                  <span>สั่งทำแบบนี้</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
