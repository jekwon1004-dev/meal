import React from "react";
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { MealData } from "../types";
import { cleanDishName, getWeekOfMonth, getWeekDates } from "../utils";

interface WeeklyMenuScreenProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  meals: MealData[];
}

export const WeeklyMenuScreen: React.FC<WeeklyMenuScreenProps> = ({
  selectedDate,
  onChangeDate,
  meals
}) => {
  // Current Mon-Fri dates for the week containing selectedDate
  const currentWeekDates = getWeekDates(selectedDate);
  const weekLabel = getWeekOfMonth(selectedDate);
  const daysOfWeek = ["월", "화", "수", "목", "금"];

  // Helper to shift selection date by weeks
  const changeWeek = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset * 7);
    onChangeDate(newDate);
  };

  // Find meals matching selected date
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedLunch = meals.find(m => m.date === selectedDateStr && m.mealType === "lunch");
  const selectedDinner = meals.find(m => m.date === selectedDateStr && m.mealType === "dinner");

  const hasMeals = selectedLunch || selectedDinner;

  return (
    <div className="flex flex-col gap-6 select-none pb-8 h-full">
      {/* 1. Header with dynamic Month & Week info */}
      <section className="flex flex-col gap-2 bg-card-white p-5 rounded-3xl border border-soft-gray/40 shadow-sm">
        <span className="text-xs font-bold text-deep-olive tracking-widest uppercase">
          씨마스고등학교 주간 식단표
        </span>
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-2xl font-bold text-text-dark font-gmarket tracking-tight">
            {weekLabel}
          </h2>
          
          <div className="flex items-center gap-1 bg-cream-bg p-1 rounded-xl border border-soft-gray/60">
            <button 
              onClick={() => changeWeek(-1)}
              className="p-1.5 hover:bg-card-white rounded-lg active:scale-95 transition-all cursor-pointer text-deep-olive"
              title="이전 주"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold px-2 text-olive-green flex items-center gap-1 font-mono">
              <Calendar size={13} /> WEEK
            </span>
            <button 
              onClick={() => changeWeek(1)}
              className="p-1.5 hover:bg-card-white rounded-lg active:scale-95 transition-all cursor-pointer text-deep-olive"
              title="다음 주"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Date Selection Grid/Scroll Area */}
      <section className="flex items-center gap-2 overflow-x-auto py-2 hide-scrollbar w-full">
        <div className="flex gap-2 w-full justify-between sm:grid sm:grid-cols-5">
          {currentWeekDates.map((dateObj, idx) => {
            const isSelected = dateObj.toISOString().split("T")[0] === selectedDateStr;
            const dayNum = dateObj.getDate();
            const dayName = daysOfWeek[idx];

            return (
              <button
                key={idx}
                onClick={() => onChangeDate(dateObj)}
                className={`flex-1 min-w-[64px] flex flex-col items-center py-3 px-2 rounded-2xl cursor-pointer active:scale-95 transition-all duration-200 ${
                  isSelected 
                    ? "bg-deep-olive text-on-primary card-shadow scale-105 font-bold" 
                    : "bg-card-white hover:bg-soft-gray/70 text-text-dark border border-soft-gray/30 shadow-sm"
                }`}
                id={`date-selector-${dayNum}`}
              >
                <span className={`text-[11px] font-bold tracking-tight uppercase ${isSelected ? "text-on-primary/80" : "text-olive-green"}`}>
                  {dayName}
                </span>
                <span className="text-base font-extrabold mt-1 font-mono">
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Meal Items Container */}
      <section className="flex-1">
        {hasMeals ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Lunch Lunch Card */}
            {selectedLunch && (
              <div className="bg-card-white p-6 rounded-3xl border border-soft-gray/30 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-soft-gray/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#DDE8B2] text-deep-olive text-xs font-extrabold px-3 py-1 rounded-full border border-deep-olive/20 font-gmarket">
                        중식
                      </span>
                    </div>
                    <span className="text-sm font-bold text-olive-green font-mono">
                      {selectedLunch.totalCalories} kcal
                    </span>
                  </div>

                  <p className="text-base text-text-dark font-medium leading-relaxed tracking-tight">
                    {selectedLunch.dishes.map(cleanDishName).join(", ")}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Allergens */}
                  <div className="flex flex-wrap gap-1">
                    {selectedLunch.allergens.map((aller, i) => (
                      <span key={i} className="text-[10px] font-bold bg-[#FAF7EF] text-olive-green px-2 py-0.5 rounded-md border border-soft-gray/40">
                        {aller}
                      </span>
                    ))}
                  </div>

                  {/* Protein progress */}
                  <div className="space-y-1 bg-cream-bg/40 p-3 rounded-2xl border border-soft-gray/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-dark/80 font-bold">
                        단백질 달성률 {selectedLunch.proteinProgress}%
                      </span>
                      <span className="text-deep-olive font-extrabold font-mono">
                        {selectedLunch.proteinProgress >= 80 ? "Excellent" : "Good"}
                      </span>
                    </div>
                    <div className="w-full bg-soft-gray h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-deep-olive h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(selectedLunch.proteinProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dinner Dinner card */}
            {selectedDinner && (
              <div className="bg-card-white p-6 rounded-3xl border border-soft-gray/30 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-soft-gray/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FFE7DD] text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full border border-orange-200 font-gmarket">
                        석식
                      </span>
                    </div>
                    <span className="text-sm font-bold text-olive-green font-mono">
                      {selectedDinner.totalCalories} kcal
                    </span>
                  </div>

                  <p className="text-base text-text-dark font-medium leading-relaxed tracking-tight">
                    {selectedDinner.dishes.map(cleanDishName).join(", ")}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Allergens */}
                  <div className="flex flex-wrap gap-1">
                    {selectedDinner.allergens.map((aller, i) => (
                      <span key={i} className="text-[10px] font-bold bg-[#FAF7EF] text-olive-green px-2 py-0.5 rounded-md border border-soft-gray/40">
                        {aller}
                      </span>
                    ))}
                  </div>

                  {/* Protein progress */}
                  <div className="space-y-1 bg-cream-bg/40 p-3 rounded-2xl border border-soft-gray/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-dark/80 font-bold">
                        단백질 달성률 {selectedDinner.proteinProgress}%
                      </span>
                      <span className="text-olive-green font-extrabold font-mono">
                        {selectedDinner.proteinProgress >= 80 ? "Excellent" : "Good"}
                      </span>
                    </div>
                    <div className="w-full bg-soft-gray h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-olive-green h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(selectedDinner.proteinProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-card-white border border-soft-gray/30 rounded-3xl text-center shadow-sm">
            <div className="w-16 h-16 bg-cream-bg rounded-full flex items-center justify-center text-olive-green mb-4 border border-soft-gray/60">
              <AlertCircle size={28} />
            </div>
            <p className="text-sm text-text-dark/80 font-bold mb-1">
              해당 날짜의 급식 정보가 아직 없습니다.
            </p>
            <p className="text-xs text-text-dark/60 leading-relaxed font-semibold">
              씨마스고등학교 영양교사실에서 제공하는 최신 일정이 수립되면<br/>즉시 급식 정보가 업데이트됩니다.
            </p>
          </div>
        )}
      </section>

      {/* TODO: Use dateKey to request meal data from the NEIS API. */}
      {/* TODO: Replace dynamic mock data with real NEIS meal data. */}
      {/* TODO: Handle weekends and school holidays from NEIS calendar data. */}
    </div>
  );
};
