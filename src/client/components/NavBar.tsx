import React from 'react';
import { cn } from '../utils/cn';

type NavButton = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const NavButton: React.FC<NavButton> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg transition-all duration-200 font-medium",
        "hover:bg-slate-100 hover:scale-105 active:scale-95",
        isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
      )}
    >
      {label}
    </button>
  );
};

export const NavBar: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('editor');

  const tabs = [
    { id: 'editor', label: 'Editor' },
    { id: 'images', label: 'Images' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="w-full bg-white shadow-sm border-b">
      {/* Title Section */}
      <div className="w-full bg-slate-800 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Site Maker</h1>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-2">
        {tabs.map((tab) => (
          <NavButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
    </div>
  );
};
