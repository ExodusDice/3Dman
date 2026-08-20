import React from 'react';
import FreeSTLLibrary from '@/components/STL/FreeSTLLibrary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คลังโมเดล STL ฟรีทั่วโลก & สั่งพิมพ์ 3D | 3DMan Thailand',
  description: 'รวบรวมไฟล์โมเดล 3D STL ฟรีระดับโลกจาก Thingiverse, Printables, MakerWorld, NASA และพิพิธภัณฑ์โลก พร้อมบริการพิมพ์ 3D ส่งถึงบ้านใน 14 วัน',
};

export default function FreeSTLPage() {
  return <FreeSTLLibrary />;
}
