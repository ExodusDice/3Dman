'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Sparkles, ShieldCheck, ShoppingBag, ShieldAlert, MessageSquare, User, Menu, X, Lock, LogIn, Globe, Wand2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isRealClerkKey =
  Boolean(clerkKey) &&
  clerkKey.startsWith('pk_test_') &&
  !clerkKey.includes('mock') &&
  !clerkKey.includes('Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA');

interface NavbarProps {
  onOpenChat?: () => void;
  unreadChatCount?: number;
}

export default function Navbar({ onOpenChat, unreadChatCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'สั่งทำชิ้นงาน 3D', href: '/request-print', icon: Wand2 },
    { name: 'คลังโมเดล STL ฟรี', href: '/free-stl', icon: Globe },
    { name: 'แกลเลอรีผลงาน', href: '/gallery', icon: Box },
    { name: 'รับประกัน SLA 14 วัน', href: '/sla-guarantee', icon: ShieldCheck },
    { name: 'คำสั่งซื้อของฉัน', href: '/orders', icon: ShoppingBag },
    { name: 'ระบบแอดมิน', href: '/admin', icon: ShieldAlert, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-violet-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Box className="w-6 h-6 text-violet-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-violet-700 bg-clip-text text-transparent">
                3D<span className="text-violet-600">Man</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                THAILAND
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">สั่งทำชิ้นงาน 3D & ผลิตพิมพ์ครบวงจร</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  link.highlight
                    ? isActive
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm font-bold'
                      : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50 border border-amber-200 font-semibold'
                    : isActive
                    ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.highlight ? 'text-amber-600' : isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Direct Live Chat with Admin */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-violet-400 text-slate-700 hover:text-violet-700 transition-all shadow-sm group"
              title="คุยกับแอดมินและช่างพิมพ์ 3D"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                  {unreadChatCount}
                </span>
              )}
            </button>
          )}

          {/* Auth Section */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            {isRealClerkKey ? (
              <>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8 rounded-xl border border-slate-200 shadow-sm',
                      },
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 border border-slate-200 transition-all shadow-sm">
                      <LogIn className="w-3.5 h-3.5 text-violet-600" />
                      <span>เข้าสู่ระบบ</span>
                    </button>
                  </SignInButton>
                </SignedOut>
              </>
            ) : (
              <Link
                href="/studio"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 border border-slate-200 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-violet-600" />
                <span>โหมดผู้เยี่ยมชม (Guest)</span>
              </Link>
            )}
          </div>

          {/* Studio Quick CTA */}
          <Link
            href="/request-print"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white text-xs font-semibold shadow-md shadow-violet-500/20 hover:scale-105 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>สั่งทำชิ้นงาน 3D</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-violet-50 text-violet-700 border border-violet-200 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-violet-600" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
