import React, { useState } from 'react';
import { ShieldCheck, Users, Settings, Bell, Database, Lock, UserPlus } from 'lucide-react';
import RefreshButton from '../../components/ui/RefreshButton';
import UserList from './components/UserList';
import UserModal from './components/UserModal';
import { UserProfile } from '../../types';

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<(UserProfile & { status?: string })[]>([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = async () => {
    await fetchUsers();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await fetch(`/api/users/${uid}`, { method: 'DELETE' });
        setUsers(users.filter(u => u.uid !== uid));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleSaveUser = async (userData: Partial<UserProfile> & { password?: string }) => {
    try {
      if (selectedUser) {
        const response = await fetch(`/api/users/${selectedUser.uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const updatedUser = await response.json();
        setUsers(users.map(u => u.uid === selectedUser.uid ? updatedUser : u));
      } else {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create user');
        }
        
        const newUser = await response.json();
        setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Super Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manajemen sistem, user, dan konfigurasi platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <UserPlus size={18} />
            <span>Tambah User</span>
          </button>
          <RefreshButton onRefresh={handleRefresh} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'System Health', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Sessions', value: '1', icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Storage Used', value: '0.1 GB', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <UserList 
          users={users} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Global Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Enable maintenance mode for all users.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-800">New Registrations</p>
              <p className="text-xs text-slate-500">Allow new users to sign up for the platform.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
