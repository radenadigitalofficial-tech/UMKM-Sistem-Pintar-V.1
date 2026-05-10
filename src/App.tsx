/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Lazy load feature modules
const Dashboard = lazy(() => import('./modules/dashboard/Dashboard'));
const AITools = lazy(() => import('./modules/ai-tools/AITools'));
const Inventory = lazy(() => import('./modules/inventory/Inventory'));
const Finance = lazy(() => import('./modules/finance/Finance'));
const DigitalStrategy = lazy(() => import('./modules/strategy/DigitalStrategy'));
const Branding = lazy(() => import('./modules/branding/Branding'));
const Creative = lazy(() => import('./modules/creative/Creative'));
const Customers = lazy(() => import('./modules/customers/Customers'));
const Growth = lazy(() => import('./modules/growth/Growth'));
const Analytics = lazy(() => import('./modules/analytics/Analytics'));
const Marketing = lazy(() => import('./modules/marketing/Marketing'));
const Automation = lazy(() => import('./modules/automation/Automation'));
const Admin = lazy(() => import('./modules/admin/Admin'));
const BusinessProfile = lazy(() => import('./modules/profile/BusinessProfile'));

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'ai-tools': return <AITools />;
            case 'inventory': return <Inventory />;
            case 'finance': return <Finance />;
            case 'strategy': return <DigitalStrategy />;
            case 'growth': return <Growth />;
            case 'branding': return <Branding />;
            case 'creative': return <Creative />;
            case 'customers': return <Customers />;
            case 'analytics': return <Analytics />;
            case 'marketing': return <Marketing />;
            case 'automation': return <Automation />;
            case 'admin': return <Admin />;
            case 'business-profile': return <BusinessProfile />;
            default: return <Dashboard />;
          }
        })()}
      </Suspense>
    );
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

