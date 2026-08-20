import React from 'react';
import CustomOrderRequest from '@/components/CustomOrder/CustomOrderRequest';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สั่งทำ & พิมพ์ชิ้นงาน 3D | 3DMan Thailand',
  description: 'บริการสั่งทำชิ้นงาน 3D โปร่งใสทุกขั้นตอน ช่างเขียนแบบตรวจแก้ได้ 3 ครั้ง มัดจำ 300 บาท พร้อมรับ Cashback 300 บาท',
};

export default function StudioPage() {
  return <CustomOrderRequest />;
}
