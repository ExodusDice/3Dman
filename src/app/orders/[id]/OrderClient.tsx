'use client';

import React, { useEffect, useState } from 'react';
import { CustomerOrder } from '@/types';
import OrderTracker from '@/components/OrderTracker';
import DirectChat from '@/components/DirectChat';
import { RefreshCw, Box } from 'lucide-react';
import Link from 'next/link';

export default function OrderClient({ id }: { id: string }) {
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-32 space-y-3 bg-slate-50 min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
        <p className="text-slate-500 text-xs font-mono">กำลังโหลดข้อมูลคำสั่งซื้อและการรับประกัน SLA...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-4">
        <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
          <Box className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">ไม่พบข้อมูลคำสั่งซื้อ</h2>
          <p className="text-xs text-slate-500">
            ระบบไม่พบคำสั่งซื้อรหัส "{id}" กรุณาตรวจสอบหมายเลขคำสั่งซื้ออีกครั้ง
          </p>
          <Link
            href="/orders"
            className="inline-block px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md"
          >
            กลับสู่หน้ารวมคำสั่งซื้อ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <OrderTracker order={order} onOpenChat={() => setIsChatOpen(true)} />
      <DirectChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} orderId={order.orderNumber} />
    </div>
  );
}
