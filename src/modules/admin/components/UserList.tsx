import React from 'react';
import { Mail, Shield, Trash2, Edit2, Search, MoreHorizontal } from 'lucide-react';
import { UserProfile } from '../../../types';

interface UserListProps {
  users: (UserProfile & { status?: string })[];
  onEdit: (user: UserProfile) => void;
  onDelete: (uid: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function UserList({ users, onEdit, onDelete, searchQuery, onSearchChange }: UserListProps) {
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Daftar Pengguna</h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari user (email, role)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.displayName || user.email.split('@')[0]}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      user.role === 'owner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <Shield size={12} />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'inactive' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'inactive' ? 'bg-slate-400' : 'bg-green-500'}`} />
                      {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(user.uid)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <button className="md:hidden p-2 text-slate-400">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <p className="text-sm">Tidak ada user ditemukan.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
