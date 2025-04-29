import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '../utils/cn';

type NavButtonProps = {
  label: string;
  to: string;
  isActive: boolean;
};

const NavButton: React.FC<NavButtonProps> = ({ label, to, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-lg transition-all duration-200 font-medium",
        "hover:bg-slate-100 hover:scale-105 active:scale-95",
        isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
      )}
    >
      {label}
    </Link>
  );
};

export const NavBar: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'editor', label: 'Editor', path: '/editor' },
    { id: 'images', label: 'Images', path: '/images' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-full bg-white shadow-sm border-b">
      <div className="w-full bg-slate-800 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Site Maker</h1>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-2">
        {tabs.map((tab) => (
          <NavButton
            key={tab.id}
            label={tab.label}
            to={tab.path}
            isActive={location.pathname === tab.path}
          />
        ))}
      </div>
    </div>
  );
};
