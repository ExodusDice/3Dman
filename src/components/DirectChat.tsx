'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { MessageSquare, Send, X, Bot, User, ShieldCheck, Sparkles, Clock } from 'lucide-react';

interface DirectChatProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  customerName?: string;
}

export default function DirectChat({
  isOpen,
  onClose,
  orderId,
  customerName = 'ลูกค้าผู้สั่งทำ',
}: DirectChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const url = orderId ? `/api/chat?orderId=${orderId}` : '/api/chat';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isOpen, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput('');
    setLoading(true);

    const tempMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      orderId,
      sender: 'customer',
      senderName: customerName,
      message: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          sender: 'customer',
          senderName: customerName,
          message: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? data.message : m)));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">แชทสดกับวิศวกรและแอดมิน</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">
              {orderId ? `คำสั่งซื้อ #${orderId}` : 'ปรึกษาเรื่องวัสดุและการพิมพ์ 3D'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Service Promise Banner */}
      <div className="bg-violet-50 border-b border-violet-100 px-4 py-2 flex items-center gap-2 text-[11px] text-violet-800 font-medium">
        <ShieldCheck className="w-4 h-4 text-violet-600 flex-shrink-0" />
        <span>สอบถามเรื่องวัสดุพิเศษ, ปรับสเกลขนาด, หรือคิวงานด่วนได้โดยตรง</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm space-y-2">
            <Bot className="w-10 h-10 mx-auto text-slate-300" />
            <p>ยังไม่มีข้อความ เริ่มพิมพ์เพื่อคุยกับช่างผู้เชี่ยวชาญ 3D ของเราได้เลยครับ</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                    isMe
                      ? 'bg-violet-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isMe ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-semibold text-[10px] ${isMe ? 'text-violet-100' : 'text-slate-500'}`}>
                      {msg.senderName}
                    </span>
                    <span className={`text-[9px] font-mono ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความถึงช่างพิมพ์ 3D..."
            className="w-full bg-slate-50 border border-slate-300 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none pr-12 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
