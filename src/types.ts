/**
 * 씨마스고등학교 급식 - TypeScript 타입 정의 및 영양성분 스키마
 */

export interface MealData {
  id: string;
  schoolName: "씨마스고등학교";
  date: string; // YYYY-MM-DD
  dateKey: string; // YYYYMMDD (formatDateKey 반환형태)
  dayOfWeek: string; // "월", "화", "수", "목", "금"
  mealType: "lunch" | "dinner"; // "lunch" = 중식, "dinner" = 석식
  title: string; // "중식" 또는 "석식"
  dishes: string[]; // 정제 전/후 메뉴명 리스트
  totalCalories: number; // 칼로리 수치 (kcal)
  nutrition: {
    protein: number; // 단백질 (g)
    carbs: number; // 탄수화물 (g)
    fat: number; // 지방 (g)
  };
  allergens: string[]; // 알레르기 성분 리스트
  proteinProgress: number; // 단백질 달성률 (%)
}

export interface MenuItemField {
  id: string;
  name: string;
  category: "밥류" | "국/찌개" | "반찬" | "디저트";
  description: string;
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  allergens: string[];
  selected: boolean;
}
