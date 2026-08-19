'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerOrder } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { ShoppingBag, ArrowRight, Clock, ShieldCheck, Box, RefreshCw, Layers } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-mono font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ระบบติดตามสถานะคำสั่งซื้อและการผลิต</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">คำสั่งซื้อของฉัน</h1>
          <p className="text-xs text-slate-600">
            ติดตามสถานะแบบเรียลไทม์ 3 ขั้นตอน พร้อมตัวนับถอยหลังการรับประกันจัดส่ง SLA 14 วัน
          </p>
        </div>

        <Link
          href="/studio"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Box className="w-4 h-4" />
          <span>สั่งพิมพ์โมเดล 3D ชิ้นใหม่</span>
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-24 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
          <p className="text-xs text-slate-500 font-mono">กำลังค้นหาข้อมูลคำสั่งซื้อ...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ยังไม่มีรายการสั่งพิมพ์</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            เริ่มต้นสร้างโมเดล 3D ชิ้นแรกของคุณด้วย Meshy AI และสั่งพิมพ์ชิ้นงานจริงได้แล้ววันนี้
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md"
          >
            <span>เข้าสู่สตูดิโอ 3D AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="bg-white border border-slate-200 hover:border-violet-400 rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:scale-[1.01] hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200">
                      #{order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full capitalize ${
                      order.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : order.status === 'printing'
                        ? 'bg-violet-100 text-violet-800 border border-violet-300'
                        : order.status === 'admin_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">
                    "{order.prompt}"
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>วัสดุ:</span>
                      <span className="text-slate-900 font-medium">{order.material.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>น้ำหนัก:</span>
                      <span className="font-mono text-violet-700 font-bold">{order.pricing.estimatedWeightGrams}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>กำหนดส่ง SLA:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{new Date(order.slaGuaranteedDeliveryDate).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900 font-mono">
                    {formatCurrency(order.actualPrice || order.pricing.totalPrice)}
                  </div>
                  <div className="text-xs text-violet-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>ดูขั้นตอนติดตาม</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
