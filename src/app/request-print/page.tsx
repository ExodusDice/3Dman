import React from 'react';
import CustomOrderRequest from '@/components/CustomOrder/CustomOrderRequest';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ส่งคำขอสั่งทำ & พิมพ์ชิ้นงาน 3D | 3DMan Thailand',
  description: 'บริการสั่งทำชิ้นงาน 3D โปร่งใสทุกขั้นตอน ช่างเขียนแบบตรวจแก้ได้ 3 ครั้ง มัดจำ 300 บาท (คืนเงินได้) พร้อมรับ Cashback 300 บาทเมื่อส่งรูปรีวิว',
};

export default function RequestPrintPage() {
  return <CustomOrderRequest />;
}
