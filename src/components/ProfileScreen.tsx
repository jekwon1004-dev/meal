import React, { useState } from "react";
import { Edit2, X, ChevronRight, LogOut, Bell, Shield, Heart, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ProfileScreen: React.FC = () => {
  // Local states for interactive demonstration
  const [userName, setUserName] = useState("김학생");
  const [userClass, setUserClass] = useState("2학년 3반 15번");
  const [isEditing, setIsEditing] = useState(false);
  
  // Settings toggle states
  const [allergyAlert, setAllergyAlert] = useState(true);
  const [dailyMealAlert, setDailyMealAlert] = useState(true);
  
  // Custom interactive allergy list
  const [allergens, setAllergens] = useState<string[]>(["우유", "땅콩"]);
  const [newAllergenInput, setNewAllergenInput] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  // Logout/Reset prompt states
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [editNameField, setEditNameField] = useState(userName);
  const [editClassField, setEditClassField] = useState(userClass);

  const handleRemoveAllergen = (name: string) => {
    setAllergens(prev => prev.filter(a => a !== name));
  };

  const handleAddAllergen = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newAllergenInput.trim();
    if (clean && !allergens.includes(clean)) {
      setAllergens(prev => [...prev, clean]);
      setNewAllergenInput("");
      setShowAddInput(false);
    }
  };

  const saveProfileChange = () => {
    setUserName(editNameField);
    setUserClass(editClassField);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 select-none pb-8">
      {/* Absolute Overlays / Dialog Modals */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card-white p-6 rounded-3xl w-full max-w-sm shadow-xl flex flex-col gap-4 border border-soft-gray/30"
            >
              <h3 className="text-base font-bold text-deep-olive font-gmarket">
                프로필 정보 수정
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dark/70">이름</label>
                  <input 
                    type="text" 
                    value={editNameField}
                    onChange={(e) => setEditNameField(e.target.value)}
                    className="w-full h-10 px-3 bg-cream-bg rounded-xl border border-soft-gray font-semibold text-sm focus:outline-none focus:border-deep-olive"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dark/70">학급 번호</label>
                  <input 
                    type="text" 
                    value={editClassField}
                    onChange={(e) => setEditClassField(e.target.value)}
                    className="w-full h-10 px-3 bg-cream-bg rounded-xl border border-soft-gray font-semibold text-sm focus:outline-none focus:border-deep-olive"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#EEF0EA]/80 hover:bg-[#EEF0EA] rounded-xl text-xs font-bold text-text-dark/80 cursor-pointer"
                >
                  취소
                </button>
                <button 
                  onClick={saveProfileChange}
                  className="px-4 py-2 bg-deep-olive text-on-primary rounded-xl text-xs font-bold hover:opacity-95 cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showLogoutAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card-white p-6 rounded-3xl w-full max-w-xs shadow-xl text-center flex flex-col gap-4 border border-soft-gray/30"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <LogOut size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-dark">정말 로그아웃 하시겠습니까?</h4>
                <p className="text-xs text-text-dark/50 mt-1">로그아웃 시 개인화 설정이 일시 차단됩니다.</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setShowLogoutAlert(false)}
                  className="flex-1 py-2.5 bg-soft-gray hover:bg-[#EEF0EA] rounded-xl text-xs font-bold text-text-dark/80 cursor-pointer"
                >
                  돌아가기
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutAlert(false);
                    alert("교원 연수 시연용 로그아웃이 완료되었습니다.");
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-card-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: 2 columns on Tablet Grid/Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* PROFILE CARD */}
        <div className="flex flex-col gap-6">
          <section className="bg-gradient-to-br from-card-white to-[#F0F7E6] rounded-[24px] p-5 shadow-md shadow-deep-olive/5 flex items-center gap-4 relative overflow-hidden border border-card-white/50">
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border-2 border-card-white shadow-sm shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKSGpw3oi7TybpmrqMaom73UU79QqiofEn0hAyBv2uuSzBv4gaPhFcHT58o9Uo-q1WW91h9DMa-raAuF1sbyA49O1p3PMIWiiJSzbokskQQ5mbZ1VZ-_lKcHGM16a-NE3UsSFg-iajrvSBsZ6H4WQRl_B4HYZVp8UhfbqZS0zA3uERod0O2xF211k5WWC6-8pVGiF4j3m8Z-kPbziNVPFGg0b72aFmFMB3omZPL4Aiwmn8k6R7adyy2t-MFzJ2yumqVr_uVmA3zeyB"
                alt="김학생 학적부 아바타"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-text-dark font-gmarket tracking-tight">
                {userName}
              </h2>
              <p className="text-xs text-text-dark/65 font-bold mt-0.5">
                {userClass}
              </p>
            </div>

            <button 
              onClick={() => {
                setEditNameField(userName);
                setEditClassField(userClass);
                setIsEditing(true);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card-white/60 text-olive-green hover:text-deep-olive hover:bg-card-white transition-all cursor-pointer border border-soft-gray/30 shadow-sm shrink-0"
              title="프로필 수정"
            >
              <Edit2 size={15} />
            </button>
          </section>

          {/* ALLERGY SETTINGS CARD */}
          <section className="bg-card-white rounded-[24px] p-5 shadow-md shadow-deep-olive/5 border border-soft-gray/30 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-text-dark font-gmarket">
                  알레르기 경고 알림
                </h3>
                <p className="text-xs text-text-dark/60 font-semibold leading-relaxed">
                  식단에 등록된 알레르기 유발 물질 포함 시 알림
                </p>
              </div>

              {/* IOS-style Toggle slider */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={allergyAlert}
                  onChange={(e) => setAllergyAlert(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                  allergyAlert ? "bg-deep-olive" : "bg-[#EEF0EA]"
                }`}>
                  <div className={`absolute top-[2px] left-[2px] bg-card-white rounded-full h-5 w-5 transition-transform duration-300 shadow-sm ${
                    allergyAlert ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </div>
              </label>
            </div>

            {/* Allergy List chips and input form */}
            <div className={`flex flex-wrap gap-1.5 transition-opacity ${allergyAlert ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              {allergens.map((allergen) => (
                <span 
                  key={allergen} 
                  className="bg-[#FAF7EF] text-olive-green border border-soft-gray/60 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:border-red-400 group/tag transition-all"
                >
                  {allergen}
                  <button 
                    onClick={() => handleRemoveAllergen(allergen)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-red-200 hover:text-red-700 transition-colors cursor-pointer shrink-0 ml-0.5 text-[10px] font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}

              {showAddInput ? (
                <form onSubmit={handleAddAllergen} className="inline-flex items-center gap-1 shrink-0">
                  <input 
                    type="text" 
                    value={newAllergenInput}
                    onChange={(e) => setNewAllergenInput(e.target.value)}
                    placeholder="알레르기성분"
                    className="h-7 px-2.5 bg-cream-bg rounded-xl border border-soft-gray focus:outline-none focus:border-deep-olive text-xs font-semibold w-24"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="h-7 w-7 flex items-center justify-center rounded-xl bg-deep-olive text-on-primary hover:opacity-95 transition-all text-xs cursor-pointer stroke-[3]"
                  >
                    <Check size={13} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddInput(false);
                      setNewAllergenInput("");
                    }}
                    className="h-7 w-7 flex items-center justify-center rounded-xl bg-soft-gray text-text-dark text-xs cursor-pointer"
                  >
                    ×
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setShowAddInput(true)}
                  className="bg-deep-olive text-on-primary border border-deep-olive/20 px-3 py-1 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1 ml-1 cursor-pointer"
                >
                  <Plus size={13} className="stroke-[3]" /> 추가
                </button>
              )}
            </div>
          </section>
        </div>

        {/* SETTINGS PANELS */}
        <div className="flex flex-col gap-6">
          {/* DAILY ACTION ALERTS CARD */}
          <section className="bg-card-white rounded-[24px] p-5 shadow-md shadow-deep-olive/5 border border-soft-gray/30 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-text-dark font-gmarket">
                일일 식단 알림
              </h3>
              <p className="text-xs text-text-dark/60 font-semibold leading-relaxed">
                매일 아침 8시에 오늘의 메뉴 알림
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={dailyMealAlert}
                onChange={(e) => setDailyMealAlert(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                dailyMealAlert ? "bg-deep-olive" : "bg-[#EEF0EA]"
              }`}>
                <div className={`absolute top-[2px] left-[2px] bg-card-white rounded-full h-5 w-5 transition-transform duration-300 shadow-sm ${
                  dailyMealAlert ? "translate-x-5" : "translate-x-0"
                }`}></div>
              </div>
            </label>
          </section>

          {/* OTHER LINKS LIST */}
          <section className="bg-card-white rounded-[24px] overflow-hidden shadow-sm border border-soft-gray/30 flex flex-col">
            {/* Help desk row */}
            <button 
              onClick={() => alert("씨마스고등학교 급식 고객센터 정보:\n운영원: 영양지원실\n문의: info@c-mas.hs.kr")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-bg/40 transition-colors text-left border-b border-soft-gray/30 cursor-pointer"
            >
              <span className="text-xs font-extrabold text-text-dark font-gmarket">고객센터 / 문의하기</span>
              <ChevronRight size={16} className="text-olive-green" />
            </button>

            {/* Terms row */}
            <button 
              onClick={() => alert("씨마스고등학교 급식 정보 서비스 이용약관:\n1. 본 서비스는 교원 연수용 데모로 제공됩니다.\n2. 급식 데이터는 NEIS 공개 식단을 참조하여 제공됩니다.\n3. 입력하시는 알레르기 수치는 로컬 스토리지에만 보관됩니다.")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-bg/40 transition-colors text-left border-b border-soft-gray/30 cursor-pointer"
            >
              <span className="text-xs font-extrabold text-text-dark font-gmarket">이용약관</span>
              <ChevronRight size={16} className="text-olive-green" />
            </button>

            {/* Log out row */}
            <button 
              onClick={() => setShowLogoutAlert(true)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50/40 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-extrabold text-red-600 font-gmarket">로그아웃</span>
              <LogOut size={16} className="text-red-500" />
            </button>
          </section>
        </div>

      </div>

      {/* Persistent Beautiful Footer block */}
      <footer className="pt-8 pb-4 text-center space-y-1.5 border-t border-soft-gray/30 mt-4">
        <p className="text-xs font-bold text-olive-green opacity-70 font-gmarket uppercase tracking-widest">
          © {new Date().getFullYear()} 씨마스고등학교 급식
        </p>
        <p className="text-[11px] text-text-dark/50 leading-relaxed font-semibold">
          건강하고 맛있는 학교 식단을 지원합니다.<br/>교사, 학부모, 학생이 함께 참여하는 영양 가득 급식 파트너
        </p>
      </footer>
    </div>
  );
};
