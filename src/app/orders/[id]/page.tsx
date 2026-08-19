import React from 'react';
import OrderClient from './OrderClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: 'demo' },
  ];
}

export default function SingleOrderPage({ params }: { params: { id: string } }) {
  return <OrderClient id={params.id} />;
}
