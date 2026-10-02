import React from 'react';
import { motion } from 'framer-motion';

// Tabs
export const Tabs: React.FC<{ tabs: string[]; activeTab: number; onChange: (idx: number) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex border-b border-ice-100">
    {tabs.map((tab, idx) => (
      <button
        key={tab}
        onClick={() => onChange(idx)}
        className={`px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none ${
          activeTab === idx ? 'text-blue-600' : 'text-secundario hover:text-navy-900'
        }`}
      >
        {tab}
        {activeTab === idx && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            initial={false}
          />
        )}
      </button>
    ))}
  </div>
);

// SegmentedControl
export const SegmentedControl: React.FC<{ options: string[]; selectedIndex: number; onChange: (idx: number) => void }> = ({ options, selectedIndex, onChange }) => (
  <div className="inline-flex bg-ice-50 p-1 rounded-lg border border-ice-100 relative">
    {options.map((opt, idx) => (
      <button
        key={opt}
        onClick={() => onChange(idx)}
        className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          selectedIndex === idx ? 'text-navy-900' : 'text-secundario hover:text-navy-900'
        }`}
      >
        {opt}
        {selectedIndex === idx && (
          <motion.div
            layoutId="segmentedIndicator"
            className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    ))}
  </div>
);
