import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { UserProfile, Role } from '../../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserProfile> & { password?: string }) => void;
  user?: UserProfile | null;
}

export default function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(''); // Phone not in UserProfile currently, but requested
      setRole(user.role);
      // setStatus(user.status); // Status not in UserProfile currently
    } else {
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setRole('staff');
      setStatus('active');
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email && !phone) {
      newErrors.contact = 'Email atau Nomor HP wajib diisi';
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!user) {
      if (!password) {
        newErrors.password = 'Password wajib diisi';
      } else if (password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        uid: user?.uid || '',
        email,
        role,
        // status,
        password: password || undefined,
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Gagal menyimpan user. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {user ? 'Edit User' : 'Tambah User Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nomor HP</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
          </div>

          {!user && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className={`w-full pl-10 pr-12 py-2 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
            >
              {isSubmitting ? 'Memproses...' : user ? 'Simpan' : 'Tambah User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
