import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Printer, Download, Edit2, Trash2, 
  FileText, Calendar, User, DollarSign, CheckCircle2, Clock, 
  ChevronRight, ShoppingBag, PlusCircle, MinusCircle, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APP_NAME } from '../../../constants';
import { cn, formatCurrency } from '../../../lib/utils';
import RefreshButton from '../../../components/ui/RefreshButton';
import EmptyState from '../../../components/ui/EmptyState';
import Modal from '../../../components/ui/Modal';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  notes?: string;
}

export default function InvoicesTab() {
  const INITIAL_INVOICES: InvoiceData[] = [
    {
      id: 'INV-001',
      invoiceNumber: 'INV/2026/05/001',
      date: '2026-05-10',
      dueDate: '2026-05-17',
      customerId: 'CUST-001',
      customerName: 'Bapak Ahmad',
      customerEmail: 'ahmad@example.com',
      customerPhone: '08123456789',
      customerAddress: 'Jl. Merdeka No. 123, Jakarta',
      items: [
        { id: 'item-1', name: 'Paket Katering A (20 pax)', quantity: 20, price: 25000, subtotal: 500000 }
      ],
      subtotal: 500000,
      tax: 55000,
      total: 555000,
      status: 'Paid',
      notes: 'Terima kasih telah memesan!'
    },
    {
      id: 'INV-002',
      invoiceNumber: 'INV/2026/05/002',
      date: '2026-05-09',
      dueDate: '2026-05-16',
      customerId: 'CUST-002',
      customerName: 'Ibu Siti',
      customerEmail: 'siti@example.com',
      customerPhone: '08987654321',
      customerAddress: 'Jl. Mawar No. 45, Bandung',
      items: [
        { id: 'item-2', name: 'Kopi Bubuk Robusta 1kg', quantity: 5, price: 30000, subtotal: 150000 }
      ],
      subtotal: 150000,
      tax: 16500,
      total: 166500,
      status: 'Sent',
      notes: 'Mohon segera lakukan pembayaran.'
    }
  ];

  const [invoices, setInvoices] = useState<InvoiceData[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Draft' | 'Sent' | 'Paid' | 'Overdue'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  
  const [form, setForm] = useState({
    invoiceNumber: `INV/2026/05/${(invoices.length + 1).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    status: 'Draft' as 'Draft' | 'Sent' | 'Paid' | 'Overdue',
    items: [] as InvoiceItem[],
    notes: ''
  });

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, filterStatus]);

  const handleOpenModal = (invoice?: InvoiceData) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setForm({
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerAddress: invoice.customerAddress,
        status: invoice.status,
        items: [...invoice.items],
        notes: invoice.notes || ''
      });
    } else {
      setEditingInvoice(null);
      setForm({
        invoiceNumber: `INV/2026/05/${(invoices.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        status: 'Draft',
        items: [{ id: 'item-1', name: '', quantity: 1, price: 0, subtotal: 0 }],
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { id: `item-${Date.now()}`, name: '', quantity: 1, price: 0, subtotal: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setForm(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'price') {
            newItem.subtotal = newItem.quantity * newItem.price;
          }
          return newItem;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, tax, total } = calculateTotals(form.items);
    
    const data: InvoiceData = {
      id: editingInvoice?.id || `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      invoiceNumber: form.invoiceNumber,
      date: form.date,
      dueDate: form.dueDate,
      customerId: 'CUST-MOCK',
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: '-',
      customerAddress: form.customerAddress,
      items: form.items,
      subtotal,
      tax,
      total,
      status: form.status,
      notes: form.notes
    };

    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? data : inv));
    } else {
      setInvoices(prev => [data, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus faktur ini?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handlePreview = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nomor faktur atau pelanggan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none hover:bg-slate-50 transition-colors"
          >
            <option value="All">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Terkirim</option>
            <option value="Paid">Lunas</option>
            <option value="Overdue">Jatuh Tempo</option>
          </select>
          <RefreshButton onRefresh={handleRefresh} />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 text-sm"
        >
          <Plus size={18} />
          Buat Faktur Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Faktur', value: invoices.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Belum Terbayar', value: invoices.filter(i => i.status !== 'Paid').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Sudah Lunas', value: invoices.filter(i => i.status === 'Paid').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Piutang', value: formatCurrency(invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.total, 0)), icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Jatuh Tempo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400">{inv.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{inv.customerName}</p>
                        <p className="text-[10px] text-slate-400">{inv.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(inv.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {inv.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'Sent' ? 'bg-indigo-100 text-indigo-700' :
                        inv.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handlePreview(inv)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors" 
                          title="Preview & Cetak"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(inv)}
                          className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv.id)}
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
        </div>
      ) : (
        <EmptyState 
          icon={FileText}
          title="Belum Ada Faktur"
          description="Kelola tagihan pelanggan Anda secara profesional dengan sistem invoice otomatis."
          action={
            <button 
              onClick={() => handleOpenModal()}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all font-bold"
            >
              Buat Faktur Pertama
            </button>
          }
        />
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingInvoice ? "Edit Faktur" : "Buat Faktur Baru"}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nomor Faktur</label>
              <input 
                required
                type="text" 
                value={form.invoiceNumber}
                onChange={e => setForm({...form, invoiceNumber: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tanggal</label>
              <input 
                required
                type="date" 
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Jatuh Tempo</label>
              <input 
                required
                type="date" 
                value={form.dueDate}
                onChange={e => setForm({...form, dueDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-rose-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-indigo-600" />
              Informasi Pelanggan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400">Nama Pelanggan / Institusi</label>
                <input 
                  required
                  type="text" 
                  value={form.customerName}
                  onChange={e => setForm({...form, customerName: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400">Email (Opsional)</label>
                <input 
                  type="email" 
                  value={form.customerEmail}
                  onChange={e => setForm({...form, customerEmail: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400">Alamat Penagihan</label>
                <textarea 
                  value={form.customerAddress}
                  onChange={e => setForm({...form, customerAddress: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[60px]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag size={14} className="text-indigo-600" />
                Daftar Item / Jasa
              </h3>
              <button 
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
              >
                <PlusCircle size={14} />
                Tambah Baris
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-white p-3 rounded-xl border border-slate-100">
                  <div className="col-span-12 md:col-span-5 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Nama Item</label>
                    <input 
                      required
                      type="text"
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Contoh: Catering Paket A"
                      className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Jumlah</label>
                    <input 
                      required
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm font-bold"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Harga @</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">Rp</span>
                      <input 
                        required
                        type="number"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                        className="w-full pl-7 pr-2 py-2 bg-slate-50 border-none rounded-lg text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2 px-1">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                      <p className="text-sm font-bold text-slate-800">{formatCurrency(item.subtotal)}</p>
                    </div>
                    {form.items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <MinusCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8 pt-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase pl-1">Catatan Tambahan</label>
                <textarea 
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  placeholder="Instruksi pembayaran, terima kasih, dll..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase pl-1">Status Faktur</label>
                <div className="flex gap-2">
                  {['Draft', 'Sent', 'Paid'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({...form, status: s as any})}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border-2",
                        form.status === s ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-slate-50 border-transparent text-slate-400"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 bg-slate-900 rounded-3xl p-6 text-white space-y-4 h-fit">
              <div className="flex justify-between text-sm opacity-60">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateTotals(form.items).subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-60">
                <span>Pajak (PPN 11%)</span>
                <span>{formatCurrency(calculateTotals(form.items).tax)}</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Total Bayar</span>
                <span className="text-xl font-bold">{formatCurrency(calculateTotals(form.items).total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
            >
              Batal
            </button>
            <div className="flex-1 flex gap-3">
              <button 
                type="submit"
                className="flex-1 py-3 text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-200"
              >
                {editingInvoice ? "Simpan Perubahan" : "Simpan & Buat Faktur"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title="Pratinjau Faktur"
        maxWidth="max-w-5xl"
      >
        {selectedInvoice && (
          <div className="space-y-8">
            <div id="invoice-print-area" className="bg-white p-12 border border-slate-100 rounded-sm print:border-none print:p-0">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">U</div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{APP_NAME}</h2>
                      <p className="text-xs text-slate-500">Jl. Pelumas No. 99, Jakarta</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ditagihkan Kepada:</p>
                    <p className="font-bold text-slate-800">{selectedInvoice.customerName}</p>
                    <p className="text-xs text-slate-500">{selectedInvoice.customerAddress}</p>
                    <p className="text-xs text-slate-500">{selectedInvoice.customerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-bold text-slate-300 uppercase tracking-tighter mb-4">FAKTUR</h1>
                  <div className="space-y-1">
                    <div className="flex justify-end gap-4 text-xs">
                      <span className="text-slate-400 uppercase font-bold">No. Faktur</span>
                      <span className="font-bold text-slate-800">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-end gap-4 text-xs">
                      <span className="text-slate-400 uppercase font-bold">Tanggal</span>
                      <span className="text-slate-800">{selectedInvoice.date}</span>
                    </div>
                    <div className="flex justify-end gap-4 text-xs">
                      <span className="text-slate-400 uppercase font-bold">Jatuh Tempo</span>
                      <span className="text-rose-600 font-bold">{selectedInvoice.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left">
                    <th className="py-4 text-xs font-bold text-slate-900 uppercase">Deskripsi Item</th>
                    <th className="py-4 text-xs font-bold text-slate-900 uppercase text-center">Jumlah</th>
                    <th className="py-4 text-xs font-bold text-slate-900 uppercase text-right">Harga Satuan</th>
                    <th className="py-4 text-xs font-bold text-slate-900 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4">
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                      </td>
                      <td className="py-4 text-center text-sm">{item.quantity}</td>
                      <td className="py-4 text-right text-sm">{formatCurrency(item.price)}</td>
                      <td className="py-4 text-right font-bold text-slate-800 text-sm">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between gap-12">
                <div className="flex-1">
                  {selectedInvoice.notes && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Catatan:</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">{selectedInvoice.notes}</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Informasi Pembayaran:</p>
                    <div className="text-xs text-slate-700 space-y-1">
                      <p>Bank Central Asia (BCA)</p>
                      <p className="font-bold">882-001-2291 a/n {APP_NAME}</p>
                    </div>
                  </div>
                </div>
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Pajak (PPN 11%)</span>
                    <span>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl text-white">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">Total Tagihan</span>
                    <span className="text-lg font-bold">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 flex justify-end">
                <div className="text-center w-64 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 mb-12">Hormat Kami,</p>
                  <p className="font-bold text-slate-900">Finance Manager</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end no-print">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-6 py-2.5 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Tutup
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 text-sm"
              >
                <Printer size={18} />
                Cetak Faktur
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
              >
                <Download size={18} />
                PDF
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                <Send size={18} />
                Kirim WA/Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
