import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MoreVertical, Star, UserPlus, Filter, MapPin, Tag, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmptyState from '../../components/ui/EmptyState';
import RefreshButton from '../../components/ui/RefreshButton';
import Modal from '../../components/ui/Modal';
import { cn } from '../../lib/utils';

const initialCustomers: Customer[] = [
  { id: '1', name: 'Budi Setiawan', email: 'budi@example.com', phone: '0812-3456-7890', address: 'Jl. Melati No. 12', category: 'Retail', notes: 'Pelanggan tetap', totalOrders: 12, lastOrder: '2026-05-10', tier: 'Gold' },
  { id: '2', name: 'Siti Rahma', email: 'siti@example.com', phone: '0812-9876-5432', address: 'Apartemen Green View', category: 'Retail', notes: '', totalOrders: 5, lastOrder: '2026-05-08', tier: 'Silver' },
  { id: '3', name: 'Agus Pratama', email: 'agus@example.com', phone: '0813-1122-3344', address: 'Perumahan Indah B/4', category: 'Grosir', notes: 'Toko kelontong', totalOrders: 3, lastOrder: '2026-05-01', tier: 'Bronze' },
  { id: '4', name: 'Dewi Lestari', email: 'dewi@example.com', phone: '0811-5566-7788', address: 'Jl. Merdeka No. 45', category: 'Retail', notes: '', totalOrders: 15, lastOrder: '2026-05-09', tier: 'Gold' },
];

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: 'Retail' | 'Grosir';
  notes: string;
  totalOrders: number;
  lastOrder: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

export default function Customers() {
  const [activeTab, setActiveTab] = useState('list');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'Retail' as 'Retail' | 'Grosir',
    notes: ''
  });

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustomerForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        category: customer.category,
        notes: customer.notes
      });
    } else {
      setEditingCustomer(null);
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        category: 'Retail',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...customerForm } : c));
    } else {
      const newCustomer: Customer = {
        id: Math.random().toString(36).substr(2, 9),
        ...customerForm,
        totalOrders: 0,
        lastOrder: '-',
        tier: 'Bronze'
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Hapus data pelanggan ini?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.phone.includes(searchTerm)) &&
    (filterTier === 'All' || c.tier === filterTier)
  );

  const loyalCount = customers.filter(c => c.tier === 'Gold').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" />
            CRM & Loyalitas
          </h1>
          <p className="text-slate-500">Kelola basis data pelanggan dan bangun loyalitas bisnis Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onRefresh={handleRefresh} />
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 text-sm"
          >
            <UserPlus size={18} />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {[
          { id: 'list', label: 'Database Pelanggan' },
          { id: 'loyalty', label: 'Loyalty Program' },
          { id: 'segments', label: 'Segmentasi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="crmTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Pelanggan</p>
            <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pelanggan Setia</p>
            <p className="text-2xl font-bold text-slate-900">{loyalCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Subscribed Email</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau telepon..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="All">Semua Tier</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        </div>

        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Nama Pelanggan</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4">Total Pesanan</th>
                  <th className="px-6 py-4">Pesanan Terakhir</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-400">ID: CUST-{customer.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail size={12} className="text-slate-400" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone size={12} className="text-slate-400" /> {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{customer.totalOrders}x</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{customer.lastOrder}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        customer.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                        customer.tier === 'Silver' ? 'bg-slate-100 text-slate-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(customer)}
                          className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            icon={Users}
            title="Belum ada pelanggan"
            description="Mulai bangun basis data pelanggan Anda untuk meningkatkan loyalitas bisnis."
            action={
              <button 
                onClick={() => handleOpenModal()}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Tambah Pelanggan Pertama
              </button>
            }
          />
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Pelanggan</label>
              <input 
                required
                type="text" 
                value={customerForm.name}
                onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                placeholder="Nama lengkap"
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nomor Telepon</label>
              <input 
                required
                type="tel" 
                value={customerForm.phone}
                onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                placeholder="0812xxxx"
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
              <input 
                type="email" 
                value={customerForm.email}
                onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
                placeholder="email@provider.com"
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Kategori</label>
              <select 
                value={customerForm.category}
                onChange={e => setCustomerForm({...customerForm, category: e.target.value as 'Retail' | 'Grosir'})}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              >
                <option value="Retail">Retail</option>
                <option value="Grosir">Grosir</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Alamat</label>
              <textarea 
                rows={2}
                value={customerForm.address}
                onChange={e => setCustomerForm({...customerForm, address: e.target.value})}
                placeholder="Alamat lengkap..."
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Catatan Tambahan</label>
              <textarea 
                rows={2}
                value={customerForm.notes}
                onChange={e => setCustomerForm({...customerForm, notes: e.target.value})}
                placeholder="Catatan khusus pelanggan..."
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-200"
            >
              {editingCustomer ? "Simpan Perubahan" : "Simpan Pelanggan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

