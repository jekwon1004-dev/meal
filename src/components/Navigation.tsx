import React from "react";
import { Home, CalendarDays, Calculator, User } from "lucide-react";

interface NavigationProps {
  activeTab: "홈" | "식단표" | "영양계산" | "프로필";
  onChangeTab: (tab: "홈" | "식단표" | "영양계산" | "프로필") => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { label: "홈", value: "홈" as const, icon: Home },
    { label: "식단표", value: "식단표" as const, icon: CalendarDays },
    { label: "영양계산", value: "영양계산" as const, icon: Calculator },
    { label: "프로필", value: "프로필" as const, icon: User },
  ];

  return (
    <>
      {/* Mobile Fixed Bottom Navigation: Shown on < 640px */}
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 sm:hidden flex justify-around items-center px-4 py-3 pb-8 bg-card-white border-t border-soft-gray/50 shadow-[0_-4px_16px_rgba(79,111,0,0.06)] z-50 rounded-t-3xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChangeTab(tab.value)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl active:scale-95 transition-all duration-200 ${
                isActive 
                  ? "bg-deep-olive text-on-primary font-bold shadow-md shadow-deep-olive/10" 
                  : "text-olive-green hover:bg-sage-green/10"
              }`}
              id={`nav-mobile-${tab.value}`}
            >
              <Icon size={20} className={isActive ? "scale-110" : ""} />
              <span className="text-xs mt-1 font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Left Sidebar: Shown on >= 640px */}
      <nav className="desktop-nav hidden sm:flex flex-col gap-6 w-60 bg-card-white p-6 border-r border-soft-gray/30 min-h-screen fixed top-0 left-0 z-40 shadow-sm shadow-deep-olive/5">
        <div className="flex items-center gap-2 mb-8 mt-2 px-2">
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-deep-olive">
            <CalendarDays size={20} className="stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-deep-olive font-gmarket">씨마스급식</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onChangeTab(tab.value)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left font-semibold active:scale-98 transition-all ${
                  isActive 
                    ? "bg-deep-olive text-on-primary shadow-lg shadow-deep-olive/15" 
                    : "text-text-dark/80 hover:bg-sage-green/20 hover:text-deep-olive"
                }`}
                id={`nav-desktop-${tab.value}`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 bg-sage-green/10 rounded-2xl border border-sage-green/30">
          <p className="text-xs text-text-dark font-medium leading-relaxed">
            씨마스고등학교 공식 급식 파트너
          </p>
          <div className="h-1.5 bg-deep-olive/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-deep-olive w-3/4 rounded-full"></div>
          </div>
        </div>
      </nav>
    </>
  );
};
