import React from "react";
import { Utensils, Settings, Bell } from "lucide-react";

interface AppHeaderProps {
  onSettingsClick?: () => void;
  activeTab: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSettingsClick, activeTab }) => {
  return (
    <header className="flex items-center justify-between px-5 h-16 w-full sticky top-0 z-50 bg-cream-bg/95 backdrop-blur-md border-b border-soft-gray/30">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-deep-olive">
          <Utensils size={22} className="stroke-[2.5]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-deep-olive font-gmarket">
          씨마스고등학교 급식
        </h1>
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft-gray/50 active:scale-95 transition-all text-on-surface-variant relative"
          aria-label="알림 및 설정"
        >
          <Bell size={20} className="text-olive-green" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
