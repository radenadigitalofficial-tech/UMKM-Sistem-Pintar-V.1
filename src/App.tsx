/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './modules/dashboard/Dashboard';
import AITools from './modules/ai-tools/AITools';
import Inventory from './modules/inventory/Inventory';
import Finance from './modules/finance/Finance';
import DigitalStrategy from './modules/strategy/DigitalStrategy';
import Branding from './modules/branding/Branding';
import Creative from './modules/creative/Creative';
import Customers from './modules/customers/Customers';
import Growth from './modules/growth/Growth';
import Analytics from './modules/analytics/Analytics';
import Marketing from './modules/marketing/Marketing';
import Automation from './modules/automation/Automation';
import Admin from './modules/admin/Admin';
import BusinessProfile from './modules/profile/BusinessProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai-tools':
        return <AITools />;
      case 'inventory':
        return <Inventory />;
      case 'finance':
        return <Finance />;
      case 'strategy':
        return <DigitalStrategy />;
      case 'growth':
        return <Growth />;
      case 'branding':
        return <Branding />;
      case 'creative':
        return <Creative />;
      case 'customers':
        return <Customers />;
      case 'analytics':
        return <Analytics />;
      case 'marketing':
        return <Marketing />;
      case 'automation':
        return <Automation />;
      case 'admin':
        return <Admin />;
      case 'business-profile':
        return <BusinessProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

