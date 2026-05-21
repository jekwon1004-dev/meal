import { useState, useMemo } from "react";
import { AppHeader } from "./components/AppHeader";
import { Navigation } from "./components/Navigation";
import { HomeScreen } from "./components/HomeScreen";
import { WeeklyMenuScreen } from "./components/WeeklyMenuScreen";
import { NutritionCalculatorScreen } from "./components/NutritionCalculatorScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { generateMealsForWeek } from "./data";
import { getTodayKST, getDefaultSelectedDate } from "./utils";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"홈" | "식단표" | "영양계산" | "프로필">("홈");
  
  // Initialize to KST standard today date, adjusted for weekends
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return getDefaultSelectedDate(getTodayKST());
  });

  // Dynamically generate 5 days of meals matching the selected date's week
  // This automatically refreshes mock data if the user navigates weeks!
  const meals = useMemo(() => {
    return generateMealsForWeek(selectedDate);
  }, [selectedDate]);

  return (
    <div className="app-shell min-h-screen bg-[#FAF7EF] text-[#2A241A] font-sans antialiased flex flex-col sm:flex-row">
      
      {/* Sidebar (Desktop) / BottomNav (Mobile) Shared Controller */}
      <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Main Core View Area with Sidebar offset */}
      <div className="flex-1 flex flex-col sm:pl-60 min-h-screen relative">
        
        {/* Unified Sticky Header */}
        <AppHeader activeTab={activeTab} onSettingsClick={() => setActiveTab("프로필")} />
        
        {/* Responsive Content Container */}
        <main className="app-content flex-grow w-full max-w-[1240px] mx-auto px-5 py-6 pb-28 sm:pb-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="screen h-full"
            >
              {activeTab === "홈" && (
                <HomeScreen
                  selectedDate={selectedDate}
                  meals={meals}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === "식단표" && (
                <WeeklyMenuScreen
                  selectedDate={selectedDate}
                  onChangeDate={setSelectedDate}
                  meals={meals}
                />
              )}

              {activeTab === "영양계산" && (
                <NutritionCalculatorScreen
                  selectedDate={selectedDate}
                  meals={meals}
                />
              )}

              {activeTab === "프로필" && (
                <ProfileScreen />
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* TODO: Prepare GitHub and Vercel deployment. */}
    </div>
  );
}
