'use client';

import React, { useState, useEffect } from 'react';
import { CustomerOrder, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { AVAILABLE_MATERIALS, AVAILABLE_SHIPPING_OPTIONS } from '@/lib/materials';
import Viewer3D from '@/components/Viewer3D';
import { 
  ShieldAlert, 
  Search, 
  Edit3, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Eye, 
  Truck, 
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Box,
  X,
  RotateCcw,
  Check,
  Package,
  Calendar,
  Lock,
  User,
  Key,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function AdminConsole() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [filterPhase, setFilterPhase] = useState<'all' | 'phase1' | 'phase2' | 'phase3' | 'refunds'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 3D Inspection Drawer
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Phase 1: Approve with Actual Price & SLA Modal
  const [approvingOrder, setApprovingOrder] = useState<CustomerOrder | null>(null);
  const [actualPriceInput, setActualPriceInput] = useState<string>('');
  const [actualSlaDaysInput, setActualSlaDaysInput] = useState<number>(14);
  const [approvalNotesInput, setApprovalNotesInput] = useState<string>('');

  // Refund Decision Modal
  const [reviewingRefundOrder, setReviewingRefundOrder] = useState<CustomerOrder | null>(null);
  const [refundAdminResponse, setRefundAdminResponse] = useState<string>('');

  // Create Request for Customer Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrderCustomerEmail, setNewOrderCustomerEmail] = useState('');
  const [newOrderCustomerName, setNewOrderCustomerName] = useState('');
  const [newOrderPrompt, setNewOrderPrompt] = useState('');
  const [newOrderMaterialId, setNewOrderMaterialId] = useState(AVAILABLE_MATERIALS[0].id);
  const [newOrderHeight, setNewOrderHeight] = useState(16);
  const [newOrderCustomPrice, setNewOrderCustomPrice] = useState('75.00');

  useEffect(() => {
    const token = sessionStorage.getItem('3dman_admin_auth');
    if (token === 'sadminwa_auth_valid') {
      setIsAuthenticated(true);
    }
    setAuthChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'sadminwa' && passwordInput === 'sadminwa') {
      sessionStorage.setItem('3dman_admin_auth', 'sadminwa_auth_valid');
      setIsAuthenticated(true);
      setLoginError('');
      fetchOrders();
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ใช้ sadminwa / sadminwa)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('3dman_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleApproveSlaAndPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingOrder) return;

    const parsedPrice = parseFloat(actualPriceInput);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('กรุณาระบุราคาจริงที่ถูกต้อง');
      return;
    }

    const calculatedSlaDate = new Date(Date.now() + actualSlaDaysInput * 24 * 3600 * 1000).toISOString();

    try {
      const res = await fetch(`/api/orders/${approvingOrder.id}/approve-sla`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualPrice: parsedPrice,
          actualSlaDate: calculatedSlaDate,
          notes: approvalNotesInput || 'ตรวจสอบโครงสร้างและสไลซ์ไฟล์ 3D เรียบร้อยแล้ว',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === approvingOrder.id ? data.order : o)));
        setApprovingOrder(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleAdvanceStage = async (order: CustomerOrder) => {
    let nextStatus: OrderStatus = 'printing';
    let trackingNum = order.trackingNumber;

    if (order.status === 'printing') {
      nextStatus = 'packaging';
    } else if (order.status === 'packaging') {
      nextStatus = 'shipping';
      trackingNum = `TH3D-${Math.floor(1000000 + Math.random() * 9000000)}`;
    } else if (order.status === 'shipping') {
      nextStatus = 'delivered_pending_confirmation';
    } else if (order.status === 'delivered_pending_confirmation') {
      nextStatus = 'completed';
    }

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          trackingNumber: trackingNum,
          trackingCarrier: trackingNum ? 'Flash Express / Kerry' : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
        fetchOrders();
      }
    } catch (err) {
      console.error('Stage update failed:', err);
    }
  };

  const handleRefundDecision = async (approved: boolean) => {
    if (!reviewingRefundOrder) return;

    try {
      const res = await fetch(`/api/orders/${reviewingRefundOrder.id}/refund`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved,
          adminResponse: refundAdminResponse || (approved ? 'อนุมัติการคืนเงินประกัน SLA 100%' : 'ปฏิเสธคำขอคืนเงินเนื่องจากคำสั่งซื้อเป็นไปตามเกณฑ์ SLA'),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === reviewingRefundOrder.id ? data.order : o)));
        setReviewingRefundOrder(null);
        setRefundAdminResponse('');
        fetchOrders();
      }
    } catch (err) {
      console.error('Refund decision failed:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    let matchesPhase = true;
    if (filterPhase === 'phase1') {
      matchesPhase = ['admin_review', 'price_adjusted_pending_customer', 'approved'].includes(o.status);
    } else if (filterPhase === 'phase2') {
      matchesPhase = ['printing', 'packaging', 'shipping'].includes(o.status);
    } else if (filterPhase === 'phase3') {
      matchesPhase = ['delivered_pending_confirmation', 'completed'].includes(o.status);
    } else if (filterPhase === 'refunds') {
      matchesPhase = ['refund_requested', 'refund_approved', 'refund_rejected'].includes(o.status);
    }

    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.prompt.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPhase && matchesSearch;
  });

  if (authChecking) {
    return (
      <div className="text-center py-32 bg-slate-50 min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
      </div>
    );
  }

  // Security Login Gate (Clean Light Theme)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-slate-900">ระบบจัดการแอดมิน (Admin Console)</h1>
            <p className="text-xs text-slate-500">
              สำหรับวิศวกรและผู้ดูแลระบบพิมพ์ 3D เท่านั้น
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-center font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">ชื่อผู้ใช้ (Username)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="sadminwa"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-mono focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-mono focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-all"
            >
              เข้าสู่ระบบ Super Admin
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            รหัสผ่านเริ่มต้น: <span className="font-mono text-amber-700 font-bold">sadminwa</span> / <span className="font-mono text-amber-700 font-bold">sadminwa</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Top Admin Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>เข้าสู่ระบบในชื่อ: sadminwa (Super Admin)</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            ศูนย์ควบคุมฟาร์มพิมพ์ 3D & วิเคราะห์กำไร
          </h1>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>สร้างคำสั่งซื้อให้ลูกค้าโดยตรง</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 text-slate-600 hover:text-rose-600 transition-colors shadow-sm"
            title="ออกจากระบบแอดมิน"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>รายได้รวมทั้งหมด</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(analytics.totalGrossRevenue)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              จากทั้งหมด {analytics.totalOrdersCount} คำสั่งซื้อ
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>กำไรสุทธิแพลตฟอร์ม</span>
              <TrendingUp className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-black text-violet-700 font-mono">
              {formatCurrency(analytics.totalProfit)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              มาร์จิ้นเฉลี่ย: <span className="text-emerald-700 font-bold">{analytics.averageMarginPercent}%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>รอแอดมินตรวจแบบ (ขั้นตอนที่ 1)</span>
              <Clock className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-black text-violet-800 font-mono">
              {analytics.pendingAdminReviewCount || 0} รายการ
            </div>
            <div className="text-[11px] text-slate-500">
              อนุมัติโครงสร้าง Support และคาลิเบรต SLA/ราคา
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>คำขอคืนเงินรอดำเนินการ</span>
              <RotateCcw className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">
              {analytics.pendingRefundsCount || 0} รายการ
            </div>
            <div className="text-[11px] text-slate-500">
              คิวตรวจสอบการรับประกัน SLA 100%
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs by 3 Phases & Refunds */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตาม Order #, ชื่อลูกค้า หรือคำสั่ง..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterPhase('all')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterPhase === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            คำสั่งซื้อทั้งหมด
          </button>
          <button
            onClick={() => setFilterPhase('phase1')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterPhase === 'phase1' ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            ขั้นที่ 1: ตรวจแบบ ({orders.filter(o => ['admin_review', 'price_adjusted_pending_customer'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilterPhase('phase2')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterPhase === 'phase2' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            ขั้นที่ 2: กำลังพิมพ์ & ส่ง ({orders.filter(o => ['printing', 'packaging', 'shipping'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilterPhase('phase3')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterPhase === 'phase3' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            ขั้นที่ 3: สำเร็จแล้ว ({orders.filter(o => ['delivered_pending_confirmation', 'completed'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilterPhase('refunds')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterPhase === 'refunds' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            การคืนเงิน ({orders.filter(o => ['refund_requested', 'refund_approved', 'refund_rejected'].includes(o.status)).length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[11px]">
              <tr>
                <th className="p-4">รหัสคำสั่งซื้อ & ขั้นตอน</th>
                <th className="p-4">ลูกค้า</th>
                <th className="p-4">คำสั่ง & วัสดุ</th>
                <th className="p-4">ราคาประเมิน vs ราคาจริง</th>
                <th className="p-4">สถานะ & SLA</th>
                <th className="p-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ไม่มีรายการคำสั่งซื้อที่ตรงกับตัวกรอง
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="font-bold text-slate-900">{order.orderNumber}</div>
                        <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('th-TH')}</div>
                        <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {['admin_review', 'price_adjusted_pending_customer'].includes(order.status)
                            ? 'ขั้นที่ 1 ตรวจแบบ'
                            : ['printing', 'packaging', 'shipping'].includes(order.status)
                            ? 'ขั้นที่ 2 กำลังผลิต'
                            : ['delivered_pending_confirmation', 'completed'].includes(order.status)
                            ? 'ขั้นที่ 3 ยืนยันรับ'
                            : 'ระบบคืนเงิน'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-500">{order.customerEmail}</div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="text-slate-800 truncate font-medium">"{order.prompt}"</div>
                        <div className="text-[10px] text-violet-700 font-mono font-semibold mt-0.5">
                          {order.material.name} • {order.pricing.estimatedWeightGrams}g
                        </div>
                      </td>

                      <td className="p-4 font-mono">
                        <div className="text-slate-500 text-[11px]">
                          ประเมิน: {formatCurrency(order.estimatedPrice || order.pricing.totalPrice)}
                        </div>
                        <div className="font-bold text-slate-900">
                          จริง: {formatCurrency(order.actualPrice || order.pricing.totalPrice)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          กำไร: +{formatCurrency(order.pricing.profitMarginAmount)}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold capitalize ${
                          order.status === 'admin_review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : order.status === 'printing'
                            ? 'bg-violet-100 text-violet-800 border border-violet-300'
                            : order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : order.status === 'refund_requested'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-bounce'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          SLA: {new Date(order.slaGuaranteedDeliveryDate).toLocaleDateString('th-TH')}
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-white border border-slate-300 hover:border-violet-500 text-violet-700 transition-colors shadow-sm"
                          title="ดูโมเดล 3D และสไลซ์"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {order.status === 'admin_review' && (
                          <button
                            onClick={() => {
                              setApprovingOrder(order);
                              setActualPriceInput(order.pricing.totalPrice.toString());
                              setActualSlaDaysInput(order.shippingOption.slaDays || 14);
                              setApprovalNotesInput('ตรวจสอบโครงสร้าง Support และสไลซ์ไฟล์เรียบร้อย');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                            title="อนุมัติราคาจริง & SLA"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>อนุมัติ SLA</span>
                          </button>
                        )}

                        {order.status === 'refund_requested' && (
                          <button
                            onClick={() => {
                              setReviewingRefundOrder(order);
                              setRefundAdminResponse('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>ตรวจคำขอคืนเงิน</span>
                          </button>
                        )}

                        {['printing', 'packaging', 'shipping', 'delivered_pending_confirmation'].includes(order.status) && (
                          <button
                            onClick={() => handleAdvanceStage(order)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                            title="เลื่อนไปยังขั้นตอนถัดไป"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>ขั้นถัดไป</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Phase 1 Admin Approve with Price & SLA */}
      {approvingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-violet-600" />
                <span>อนุมัติคำสั่งซื้อและกำหนดราคาจริง / SLA ({approvingOrder.orderNumber})</span>
              </h3>
              <button onClick={() => setApprovingOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveSlaAndPrice} className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500">คำสั่งลูกค้า:</div>
                <p className="text-slate-800 italic font-medium">"{approvingOrder.prompt}"</p>
                <div className="text-[11px] text-violet-700 font-mono font-bold pt-1">
                  ราคาประเมินเดิม: {formatCurrency(approvingOrder.estimatedPrice)}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  ราคาสุทธิตัวจริง ($ USD):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={actualPriceInput}
                  onChange={(e) => setActualPriceInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  กรอบเวลารับประกันจัดส่ง SLA (วัน):
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={actualSlaDaysInput}
                  onChange={(e) => setActualSlaDaysInput(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">บันทึกทางเทคนิคถึงลูกค้า:</label>
                <input
                  type="text"
                  value={approvalNotesInput}
                  onChange={(e) => setApprovalNotesInput(e.target.value)}
                  placeholder="เช่น สไลซ์ด้วยความละเอียด 0.12mm และโครงสร้าง Tree Support..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-xl px-4 py-2 text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingOrder(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold shadow-md"
                >
                  ยืนยันและส่งราคา/SLA จริงให้ลูกค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Refund Decision Modal */}
      {reviewingRefundOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                <span>ตรวจสอบคำขอคืนเงิน ({reviewingRefundOrder.orderNumber})</span>
              </h3>
              <button onClick={() => setReviewingRefundOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>ลูกค้า:</span>
                <span className="text-slate-900 font-semibold">{reviewingRefundOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ยอดเงินที่ขอคืน:</span>
                <span className="font-mono text-rose-600 font-bold">{formatCurrency(reviewingRefundOrder.pricing.totalPrice)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">เหตุผลของลูกค้า:</span>
                <p className="text-slate-800 italic font-medium">"{reviewingRefundOrder.refundRequest?.reason}"</p>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="text-slate-700 font-medium block">หมายเหตุการตัดสินใจของแอดมิน:</label>
              <textarea
                rows={2}
                value={refundAdminResponse}
                onChange={(e) => setRefundAdminResponse(e.target.value)}
                placeholder="ระบุเหตุผลในการอนุมัติหรือปฏิเสธการคืนเงิน..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
              />
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleRefundDecision(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 hover:border-rose-500 text-rose-700 font-bold text-xs"
              >
                ปฏิเสธคำขอคืนเงิน
              </button>
              <button
                type="button"
                onClick={() => handleRefundDecision(true)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                อนุมัติคืนเงิน 100% ทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 3D Model Inspection Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  ตรวจสอบแบบพิมพ์ 3D: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">ลูกค้า: {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 h-[360px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                <Viewer3D
                  geometryInfo={selectedOrder.modelGeometry}
                  material={selectedOrder.material}
                  autoRotate={true}
                />
              </div>

              <div className="md:col-span-5 space-y-3 text-xs">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-700">คำสั่ง AI (Prompt):</div>
                  <p className="text-slate-900 italic">"{selectedOrder.prompt}"</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>วัสดุ:</span>
                    <span className="text-slate-900 font-semibold">{selectedOrder.material.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>น้ำหนัก & ปริมาตร:</span>
                    <span className="text-violet-700 font-bold">{selectedOrder.pricing.estimatedWeightGrams}g / {selectedOrder.pricing.volumeCm3}cm³</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>กำหนดส่ง SLA:</span>
                    <span className="text-emerald-700 font-bold">{new Date(selectedOrder.slaGuaranteedDeliveryDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1 font-bold">
                    <span>ยอดชำระ:</span>
                    <span className="text-slate-900">{formatCurrency(selectedOrder.pricing.totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`ส่งออกไฟล์ GLB Mesh สำหรับโปรแกรม Slicer: ${selectedOrder.prompt}`)}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Box className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์ 3D GLB เพื่อสไลซ์พิมพ์</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Create Request for Customer */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>สร้างคำสั่งพิมพ์ให้ลูกค้าโดยตรง</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const selectedMat = AVAILABLE_MATERIALS.find((m) => m.id === newOrderMaterialId) || AVAILABLE_MATERIALS[0];
                const res = await fetch('/api/admin/create-request', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    customerName: newOrderCustomerName || 'ลูกค้า VIP',
                    customerEmail: newOrderCustomerEmail,
                    prompt: newOrderPrompt,
                    material: selectedMat,
                    heightCm: newOrderHeight,
                    customPrice: parseFloat(newOrderCustomPrice) || 85.00,
                  }),
                });
                if (res.ok) {
                  setIsCreateModalOpen(false);
                  fetchOrders();
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">ชื่อลูกค้า:</label>
                  <input
                    type="text"
                    value={newOrderCustomerName}
                    onChange={(e) => setNewOrderCustomerName(e.target.value)}
                    placeholder="ชื่อลูกค้า"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">อีเมลลูกค้า (*):</label>
                  <input
                    type="email"
                    required
                    value={newOrderCustomerEmail}
                    onChange={(e) => setNewOrderCustomerEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">คำสั่งโมเดล 3D (*):</label>
                <textarea
                  required
                  rows={2}
                  value={newOrderPrompt}
                  onChange={(e) => setNewOrderPrompt(e.target.value)}
                  placeholder="อธิบายชิ้นงาน 3D ที่ต้องการพิมพ์..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">วัสดุ:</label>
                  <select
                    value={newOrderMaterialId}
                    onChange={(e) => setNewOrderMaterialId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none shadow-sm"
                  >
                    {AVAILABLE_MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">ความสูง (ซม.):</label>
                  <input
                    type="number"
                    value={newOrderHeight}
                    onChange={(e) => setNewOrderHeight(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">ราคาพิเศษ ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderCustomPrice}
                    onChange={(e) => setNewOrderCustomPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-md"
                >
                  สร้างคำสั่งซื้อ & เข้าสู่คิว
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
