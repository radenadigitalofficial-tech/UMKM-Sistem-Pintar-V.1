import React, { useState } from 'react';
import { TrendingUp, Users, Package, Wallet, ArrowUpRight, ArrowDownRight, Sparkles, Plus, Send, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { formatCurrency, cn } from '../../lib/utils';
import RefreshButton from '../../components/ui/RefreshButton';

const stats = [
  { label: 'Total Penjualan', value: 'Rp 12,450,000', change: '+12.5%', trending: 'up', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Pelanggan Baru', value: '148', change: '+18.2%', trending: 'up', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Produk Terjual', value: '856', change: '-4.1%', trending: 'down', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Omzet Bulanan', value: 'Rp 45,200,000', change: '+22.4%', trending: 'up', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
];

const chartData = [
  { name: 'Sen', amount: 4000 },
  { name: 'Sel', amount: 3000 },
  { name: 'Rab', amount: 2000 },
  { name: 'Kam', amount: 2780 },
  { name: 'Jum', amount: 1890 },
  { name: 'Sab', amount: 2390 },
  { name: 'Min', amount: 3490 },
];

import { ChartContainer } from '../../components/ui/ChartContainer';

export default function Dashboard() {
  const [stats] = useState([
    { label: 'Total Penjualan', value: 'Rp 0', change: '0%', trending: 'up', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pelanggan Baru', value: '0', change: '0%', trending: 'up', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Produk Terjual', value: '0', change: '0%', trending: 'up', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Omzet Bulanan', value: 'Rp 0', change: '0%', trending: 'up', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]);

  const [chartData] = useState([]);

  const handleRefresh = async () => {
    // Simulating API refetch
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Halo, Radena Digital! 👋</h1>
          <p className="text-slate-500 text-sm">Berikut adalah ringkasan performa bisnis Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={handleRefresh} />
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Send size={14} /> Kirim Invoice
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Plus size={14} /> Order Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group"
          >
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className={`text-[10px] mt-3 flex items-center font-bold ${stat.trending === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stat.change}
              <span className="text-slate-400 font-normal ml-1">vs bln lalu</span>
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Revenue Streams</h4>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Revenue
              </span>
            </div>
          </div>
          <div className="p-6">
            <ChartContainer height={300}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                  <TrendingUp className="text-slate-200" size={48} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Belum ada data visual</p>
                    <p className="text-[10px] text-slate-400">Data penjualan akan muncul saat transaksi mulai dicatat.</p>
                  </div>
                </div>
              )}
            </ChartContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-yellow-400" size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick AI Insight</span>
              </div>
              <h4 className="font-bold text-lg mb-3">Siap untuk Analisis AI?</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Setelah Anda mulai mencatatkan transaksi, AI kami akan memberikan rekomendasi cerdas untuk meningkatkan omzet Bisnis Anda.
              </p>
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all">
                Mulai Catat Penjualan
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Users size={14} className="text-indigo-500" />
                Customer Segments
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Royal Class', color: 'bg-indigo-500', pct: 0 },
                { label: 'Newbies', color: 'bg-emerald-500', pct: 0 },
                { label: 'One-timers', color: 'bg-slate-300', pct: 0 },
              ].map((seg, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{seg.label}</span>
                    <span>{seg.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", seg.color)} style={{ width: `${seg.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

