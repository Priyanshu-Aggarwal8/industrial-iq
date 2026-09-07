import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LeadDetailModal } from '../leads/LeadDetailModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal />
    </div>
  );
};

