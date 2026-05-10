import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Ringkasan Bisnis</h1>
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">Toko Aktif</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Cari fitur..." 
            className="w-48 pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 text-xs font-bold shadow-sm">
            RD
          </div>
        </div>
      </div>
    </header>
  );
}
