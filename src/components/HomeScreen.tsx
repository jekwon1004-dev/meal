import React, { useState, useEffect } from "react";
import { Heart, Sun, Moon, CheckCircle, ArrowRight, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { MealData } from "../types";
import { cleanDishName, formatKoreanDate } from "../utils";

interface HomeScreenProps {
  selectedDate: Date;
  meals: MealData[];
  onNavigateToTab: (tab: "홈" | "식단표" | "영양계산" | "프로필") => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedDate,
  meals,
  onNavigateToTab
}) => {
  const [likeState, setLikeState] = useState<boolean>(() => {
    return localStorage.getItem("like_치즈돈까스") === "true";
  });
  
  const [showHeartPop, setShowHeartPop] = useState(false);

  const toggleLike = () => {
    const newState = !likeState;
    setLikeState(newState);
    localStorage.setItem("like_치즈돈까스", String(newState));
    if (newState) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
  };

  // Find lunch & dinner for selected date
  const dateStr = selectedDate.toISOString().split("T")[0];
  const todayLunch = meals.find(m => m.date === dateStr && m.mealType === "lunch");
  const todayDinner = meals.find(m => m.date === dateStr && m.mealType === "dinner");

  const hasMeals = todayLunch || todayDinner;

  return (
    <div className="flex flex-col gap-6 select-none pb-8">
      {/* 1. Hero Card Area */}
      <section className="relative overflow-hidden rounded-3xl bg-card-white shadow-xl shadow-deep-olive/5 border border-soft-gray/30 group">
        {/* Responsive Desktop Wrapper (Flex on large) */}
        <div className="flex flex-col lg:flex-row">
          
          {/* Image side */}
          <div className="h-56 sm:h-64 lg:h-auto lg:w-1/2 relative overflow-hidden shrink-0">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1jS_3V53NeXTsZKLp3TpldIL3yrB9e2zJwiYE50uouRZn8bYj2EiAJE7HCqWQZBEg5rCf9-mKUdgUHA-0xCiHvYcpFBrt9qoUSts2VDRiJFu7VsxIBbL_Hk5rMkCyG8Bil_-5KgVnM1jTO2ZBHzYnUxZBmrXyRIzAeO2rR5GACok3fcfSWHpqP5SCstnaVb_WAY9JGgFohSaB7FRkIiijS3MhDavjYg9j5VaGkjW89zEwdmNzrkR7ZXEv1QYMTbZfyO6l1FYpKVNY"
              alt="씨마스고등학교 모범 Cheese Tonkatsu Plate"
              referrerPolicy="no-referrer"
            />
            {/* Dark contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Recommendation badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 bg-sage-green text-deep-olive text-xs font-bold rounded-full border border-deep-olive/25 shadow-md">
                오늘의 추천 급식 👑
              </span>
            </div>
            
            {/* Heart state controller with pop text */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {showHeartPop && (
                <motion.span 
                  initial={{ opacity: 0, x: 10, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card-white/95 text-deep-olive text-xs font-bold px-2 py-1 rounded-lg"
                >
                  맛있어요! 💛
                </motion.span>
              )}
              <button 
                onClick={toggleLike}
                className="w-10 h-10 bg-card-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 active:scale-90 transition-all shadow-md cursor-pointer"
              >
                <Heart 
                  size={20} 
                  className={`transition-all ${likeState ? "fill-red-500 stroke-red-500 scale-110" : "text-text-dark"}`} 
                />
              </button>
            </div>
          </div>

          {/* Text details side */}
          <div className="p-6 flex flex-col justify-between flex-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-olive-green font-bold tracking-wider uppercase font-mono">
                  {formatKoreanDate(selectedDate)}
                </span>
                {(new Date().getDay() === 0 || new Date().getDay() === 6) && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-extrabold rounded-md border border-orange-200">
                    다음 급식일 📅
                  </span>
                )}
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl font-bold text-deep-olive tracking-tight font-gmarket">
                  치즈돈까스 정식
                </h2>
                <span className="text-lg font-extrabold text-olive-green font-mono">845 kcal</span>
              </div>
              <p className="text-sm text-text-dark/80 font-medium leading-relaxed">
                겉은 유기농 연밀가루로 바삭하게 튀겨내고, 속은 고소한 천연 모짜렐라 치즈가 듬뿍 늘어나는 수제 치즈돈까스 정식입니다. 아삭한 양배추 레몬 샐러드가 식욕을 돋우어 줍니다.
              </p>
            </div>

            <div className="flex justify-between items-center bg-cream-bg/60 p-3.5 rounded-2xl border border-soft-gray/50 text-xs">
              <div className="flex items-center gap-2 text-text-dark/90 font-medium">
                <UserCheck size={15} className="text-deep-olive" />
                <span>학생 선호도 최고 등급</span>
              </div>
              <span className="text-xs text-deep-olive font-extrabold bg-[#DDE8B2] px-2.5 py-1 rounded-full border border-deep-olive/20">
                인기폭발
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Today's Summary Cards container */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-deep-olive font-gmarket tracking-tight">
            오늘의 급식 요약
          </h3>
          <button 
            onClick={() => onNavigateToTab("식단표")}
            className="text-olive-green text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            전체 식단표 보기 <ArrowRight size={14} />
          </button>
        </div>

        {hasMeals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Lunch Card */}
            {todayLunch && (
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-card-white p-5 rounded-3xl border border-soft-gray/40 shadow-sm relative overflow-hidden group/card"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Sun size={18} className="animate-spin-slow stroke-[2.5]" />
                    </div>
                    <span className="font-bold text-deep-olive text-base font-gmarket">중식</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-cream-bg rounded-lg text-olive-green font-mono border border-soft-gray/50">
                    {todayLunch.totalCalories} kcal
                  </span>
                </div>
                
                <p className="text-sm text-text-dark font-medium leading-relaxed mb-4 min-h-[50px]">
                  {todayLunch.dishes.map(cleanDishName).join(", ")}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {todayLunch.allergens.map((allergen, i) => (
                    <span key={i} className="px-2 py-0.5 bg-soft-gray text-text-dark/80 text-[10px] font-bold rounded-md">
                      {allergen}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Dinner Card */}
            {todayDinner && (
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-card-white p-5 rounded-3xl border border-soft-gray/40 shadow-sm relative overflow-hidden group/card"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-indigo-600 rounded-lg">
                      <Moon size={18} className="stroke-[2.5]" />
                    </div>
                    <span className="font-bold text-[#485229] text-base font-gmarket">석식</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-cream-bg rounded-lg text-olive-green font-mono border border-soft-gray/50">
                    {todayDinner.totalCalories} kcal
                  </span>
                </div>

                <p className="text-sm text-text-dark font-medium leading-relaxed mb-4 min-h-[50px]">
                  {todayDinner.dishes.map(cleanDishName).join(", ")}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {todayDinner.allergens.map((allergen, i) => (
                    <span key={i} className="px-2 py-0.5 bg-soft-gray text-text-dark/80 text-[10px] font-bold rounded-md">
                      {allergen}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        ) : (
          <div className="bg-card-white p-8 rounded-3xl text-center border border-soft-gray/30 shadow-sm">
            <p className="text-sm text-text-dark/60 font-medium">
              해당 날짜의 급식 정보가 아직 없습니다. 😊
            </p>
          </div>
        )}
      </section>

      {/* 3. Asymmetric Nutrition Insight Card */}
      <section className="bg-deep-olive hover:bg-opacity-95 text-on-primary p-5 rounded-3xl flex items-center justify-between overflow-hidden relative shadow-lg shadow-deep-olive/15 cursor-pointer" onClick={() => onNavigateToTab("영양계산")}>
        <div className="z-10 relative">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
            성장기 필수 영양 분석
          </p>
          <h4 className="text-lg font-bold font-gmarket mt-1">
            오늘 단백질 섭취 만족도 최상!
          </h4>
          <p className="text-[11px] opacity-75 mt-0.5">치즈돈까스로 근성장에 필요한 아미노산을 모두 챙겼어요.</p>
        </div>
        <div className="z-10 flex items-center gap-1.5 bg-card-white/20 px-3.5 py-2 rounded-full border border-card-white/15">
          <CheckCircle size={16} className="text-sage-green fill-deep-olive" />
          <span className="text-xs font-bold text-card-white font-mono">120% 만족</span>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sage-green/10 rounded-full blur-xl"></div>
      </section>
    </div>
  );
};
