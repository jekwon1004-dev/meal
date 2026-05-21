import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, RotateCcw, Save, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MealData, MenuItemField } from "../types";
import { DEFAULT_NUTRITION_MENU_ITEMS } from "../data";
import { cleanDishName } from "../utils";

interface NutritionCalculatorScreenProps {
  selectedDate: Date;
  meals: MealData[];
}

export const NutritionCalculatorScreen: React.FC<NutritionCalculatorScreenProps> = ({
  selectedDate,
  meals
}) => {
  // Healthy daily reference targets
  const targets = {
    calories: 2000,
    protein: 60, // g
    carbs: 300,  // g
    fat: 60      // g
  };

  // State: Selectable items
  const [menuItems, setMenuItems] = useState<MenuItemField[]>(() => {
    // Try to load any previously saved selections or default items
    const saved = localStorage.getItem("saved_calculator_items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_NUTRITION_MENU_ITEMS.map(item => ({ ...item, selected: false }));
  });

  // Track active filter chips
  const [activeFilter, setActiveFilter] = useState<string>("전체");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync today's actual lunch items as quick adds if user wants!
  const dateStr = selectedDate.toISOString().split("T")[0];
  const selectedLunch = meals.find(m => m.date === dateStr && m.mealType === "lunch");

  // Load today's lunch menu as custom items if the user clicks a quick-add button!
  const loadTodaysLunch = () => {
    if (!selectedLunch) return;
    
    // Create new items for today's lunch dishes that aren't already represented
    const cleanDishes = selectedLunch.dishes.map(cleanDishName);
    
    const newItems: MenuItemField[] = cleanDishes.map((dish, i) => {
      // Categorize roughly based on keywords
      let category: "밥류" | "국/찌개" | "반찬" | "디저트" = "반찬";
      if (dish.indexOf("밥") >= 0 || dish.indexOf("필라프") >= 0) category = "밥류";
      else if (dish.indexOf("국") >= 0 || dish.indexOf("찌개") >= 0 || dish.indexOf("탕") >= 0) category = "국/찌개";
      else if (dish.indexOf("요구르트") >= 0 || dish.indexOf("쥬스") >= 0 || dish.indexOf("과일") >= 0 || dish.indexOf("푸딩") >= 0 || dish.indexOf("에이드") >= 0) category = "디저트";

      // Approx values
      let calories = 150;
      let protein = 5;
      let carbs = 20;
      let fat = 3;

      if (category === "밥류") {
        calories = 300; protein = 6; carbs = 65; fat = 1;
      } else if (category === "국/찌개") {
        calories = 140; protein = 8; carbs = 8; fat = 6;
      } else if (category === "디저트") {
        calories = 90; protein = 1; carbs = 20; fat = 0.5;
      }

      return {
        id: `today_${i}_${dish}`,
        name: dish,
        category,
        description: `오늘의 ${category} 식단`,
        calories,
        protein,
        carbs,
        fat,
        allergens: [],
        selected: true // Auto select today's meals
      };
    });

    // Merge with existing but prevent duplication in list
    setMenuItems(prev => {
      // Filter out previous custom items
      const baseStandard = prev.filter(p => !p.id.startsWith("today_"));
      // Mark default items matching name as selected as well
      const updatedStandard = baseStandard.map(item => {
        if (cleanDishes.includes(item.name)) {
          return { ...item, selected: true };
        }
        return item;
      });

      // Filter out duplicate names from dynamic new items
      const uniqueNewItems = newItems.filter(n => !updatedStandard.some(u => u.name === n.name));
      return [...updatedStandard, ...uniqueNewItems];
    });
  };

  // Toggle selection state
  const toggleItem = (id: string) => {
    setMenuItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      localStorage.setItem("saved_calculator_items", JSON.stringify(updated));
      return updated;
    });
  };

  // Reset selections
  const resetAll = () => {
    setMenuItems(prev => {
      const reset = prev.map(item => ({ ...item, selected: false })).filter(item => !item.id.startsWith("today_"));
      localStorage.setItem("saved_calculator_items", JSON.stringify(reset));
      return reset;
    });
  };

  // Save selection result
  const saveResult = () => {
    const selectedList = menuItems.filter(m => m.selected);
    if (selectedList.length === 0) {
      setSuccessMessage("선택하신 급식 메뉴가 없습니다! 메뉴를 먼저 선택해 주세요.");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    const calculated = selectedList.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fat: acc.fat + curr.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Persist calculation result log
    const history = JSON.parse(localStorage.getItem("nutrition_logs") || "[]");
    history.unshift({
      date: new Date().toISOString(),
      items: selectedList.map(s => s.name),
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat
    });
    localStorage.setItem("nutrition_logs", JSON.stringify(history.slice(0, 5)));

    setSuccessMessage(`계산 결과가 저장되었습니다! 📝\n총 칼로리: ${calculated.calories} kcal (단백질 ${calculated.protein}g)`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Compute total sums of selected menu items
  const totals = menuItems
    .filter(item => item.selected)
    .reduce(
      (acc, curr) => {
        return {
          calories: acc.calories + curr.calories,
          protein: acc.protein + curr.protein,
          carbs: acc.carbs + curr.carbs,
          fat: acc.fat + curr.fat
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  const categories = ["전체", "밥류", "국/찌개", "반찬", "디저트"];
  const filteredItems = menuItems.filter(
    item => activeFilter === "전체" || item.category === activeFilter
  );

  return (
    <div className="flex flex-col gap-6 select-none pb-8 h-full">
      {/* Dynamic Saving Notification Status Banner */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-deep-olive text-on-primary p-4 rounded-2xl shadow-xl z-50 border border-sage-green/20"
          >
            <div className="flex items-start gap-2 text-xs font-semibold leading-relaxed whitespace-pre-line">
              <CheckCircle2 className="shrink-0 text-sage-green mt-0.5" size={17} />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start">
        
        {/* LEFT PANEL: Results Summary Card (cols 2 on large) */}
        <section className="bg-card-white p-5 rounded-3xl border border-soft-gray/40 shadow-sm flex flex-col gap-5 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-text-dark font-gmarket tracking-tight">
                오늘의 선택 영양
              </h2>
              <p className="text-xs text-text-dark/60 font-semibold mt-1">
                선택한 메뉴의 총 영양성분입니다.
              </p>
            </div>
            
            <button 
              onClick={resetAll}
              className="text-xs font-bold text-olive-green hover:text-red-600 hover:bg-red-50 flex items-center gap-1 bg-[#EEF0EA]/60 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
              title="선택 초기화"
            >
              <RotateCcw size={13} /> 초기화
            </button>
          </div>

          {/* Large display energy */}
          <div className="flex items-baseline gap-1 py-1.5 bg-cream-bg/50 px-4 rounded-2xl border border-soft-gray/30">
            <span className="text-3xl font-extrabold text-deep-olive font-mono">
              {totals.calories}
            </span>
            <span className="text-sm font-bold text-deep-olive">kcal</span>
            <span className="text-xs font-semibold text-text-dark/50 ml-auto bg-card-white px-2 py-0.5 rounded-md">
              하루 권장량 {Math.round((totals.calories / targets.calories) * 100)}%
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Protein Card */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-dark/95">단백질</span>
                <span className="text-olive-green font-bold">
                  {totals.protein}g / <span className="text-text-dark/50 font-normal">목표 {targets.protein}g</span>
                </span>
              </div>
              <div className="h-2 bg-[#EEF0EA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-deep-olive rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totals.protein / targets.protein) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-dark/95">탄수화물</span>
                <span className="text-olive-green font-bold">
                  {totals.carbs}g / <span className="text-text-dark/50 font-normal">목표 {targets.carbs}g</span>
                </span>
              </div>
              <div className="h-2 bg-[#EEF0EA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-olive-green rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totals.carbs / targets.carbs) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fat Card */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-dark/95">지방</span>
                <span className="text-olive-green font-bold">
                  {totals.fat}g / <span className="text-text-dark/50 font-normal">목표 {targets.fat}g</span>
                </span>
              </div>
              <div className="h-2 bg-[#EEF0EA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#606a3f] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totals.fat / targets.fat) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button 
            onClick={saveResult}
            className="w-full h-12 bg-deep-olive hover:bg-opacity-95 text-on-primary rounded-2xl font-bold text-sm tracking-wide shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <Save size={16} /> 계산 결과 저장하기
          </button>
        </section>

        {/* RIGHT PANEL: Category selections area (cols 3 on large) */}
        <section className="flex flex-col gap-4 lg:col-span-3">
          
          <div className="flex flex-col gap-2 bg-card-white p-4 rounded-2xl border border-soft-gray/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-deep-olive flex items-center gap-1.5">
                <Filter size={15} /> 카테고리 필터
              </span>
              
              {selectedLunch && (
                <button
                  onClick={loadTodaysLunch}
                  className="text-xs font-bold text-deep-olive hover:underline bg-[#DDE8B2]/50 border border-deep-olive/15 px-3 py-1 rounded-xl active:scale-95 transition-all text-right flex items-center gap-1"
                >
                  <Sparkles size={11} className="text-deep-olive shrink-0" /> 오늘의 식단 추가
                </button>
              )}
            </div>

            {/* Filter Chips Scroll Block */}
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeFilter === cat
                      ? "bg-deep-olive text-on-primary font-extrabold border border-deep-olive"
                      : "bg-[#EEF0EA] hover:bg-soft-gray text-text-dark border border-soft-gray/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Selection List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
            {filteredItems.map((item) => {
              const isSelected = item.selected;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`menu-item p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5 active:scale-98 ${
                    isSelected 
                      ? "bg-sage-green/10 border-deep-olive" 
                      : "bg-card-white border-soft-gray/40 hover:bg-[#EEF0EA]/30"
                  }`}
                >
                  {/* Selector Circle Check Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? "bg-deep-olive border-deep-olive text-on-primary" : "border-soft-gray"
                  }`}>
                    {isSelected && <Check size={12} className="stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1">
                      <h4 className="font-bold text-sm text-text-dark truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-deep-olive shrink-0 bg-[#DDE8B2]/50 px-2.5 py-0.5 rounded-lg font-mono">
                        {item.calories} kcal
                      </span>
                    </div>
                    <p className="text-xs text-text-dark/65 mt-1 font-semibold truncate">
                      {item.description || "단백질, 탄수화물, 지방 필수 성분 포함"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </div>
    </div>
  );
};
