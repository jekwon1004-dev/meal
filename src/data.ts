import { MealData, MenuItemField } from "./types";
import { formatDateKey, getWeekDates } from "./utils";

/**
 * 주어진 기준 날짜 주차의 월~금 5일치 급식 데이터를 dynamically 생성합니다.
 */
export function generateMealsForWeek(baseDate: Date): MealData[] {
  const weekDates = getWeekDates(baseDate);
  const daysOfWeek = ["월", "화", "수", "목", "금"];
  
  const mockMenus: Array<{
    lunch: { dishes: string[]; cal: number; proteinPct: number; allergens: string[] };
    dinner: { dishes: string[]; cal: number; proteinPct: number; allergens: string[] };
  }> = [
    // 월요일
    {
      lunch: {
        dishes: ["친환경현미밥*", "수제한우불고기비빔밥.", "얼큰무국", "바삭감자고로케ㆍ", "아삭부추생채", "열무김치(9)"],
        cal: 810,
        proteinPct: 75,
        allergens: ["밀", "대두", "쇠고기", "알레르기코드"]
      },
      dinner: {
        dishes: ["베이컨계란볶음밥(1.5)", "팽이버섯맑은국", "치즈국물떡볶이", "나막김치", "오렌지주스"],
        cal: 740,
        proteinPct: 55,
        allergens: ["난류", "우유", "대두", "돼지고기"]
      }
    },
    // 화요일
    {
      lunch: {
        dishes: ["혼합잡곡밥(5)", "돈육김치찌개(10.13)", "수제함박스테이크*(1.2.5.6)", "숙주미나리무침", "깍두기(9)", "콘드레싱"],
        cal: 850,
        proteinPct: 85,
        allergens: ["돼지고기", "쇠고기", "대두", "밀", "우유"]
      },
      dinner: {
        dishes: ["참치마요덮밥(1.5)", "미니우동(1.5.6)", "단무지무침", "배추김치(9)", "요구르트(2)"],
        cal: 720,
        proteinPct: 60,
        allergens: ["난류", "대두", "밀", "우유"]
      }
    },
    // 수요일 (수다날: 수요일은 다 먹는 날)
    {
      lunch: {
        dishes: ["뿌리채소영양밥", "달래양념장(5.6)", "근대된장국", "매콤돈육강정(10)", "오이양파생채", "배추김치(9)", "사과음료"],
        cal: 830,
        proteinPct: 80,
        allergens: ["대두", "밀", "돼지고기"]
      },
      dinner: {
        dishes: ["치킨마요조림밥(1.5.15)", "맑은유부장국", "바삭김말이튀김", "섞박지(9)", "사과에이드"],
        cal: 750,
        proteinPct: 50,
        allergens: ["난류", "대두", "밀", "닭고기"]
      }
    },
    // 목요일 (치즈돈까스 대표 메뉴)
    {
      lunch: {
        dishes: ["친환경현미밥.", "쇠고기미역국(16)", "매콤돈육강정(10)*", "숙주미나리무침.", "배추김치(9)"],
        cal: 845,
        proteinPct: 120, // 120% 단백질 달성!
        allergens: ["대두", "밀", "쇠고기", "돼지고기"]
      },
      dinner: {
        dishes: ["참치마요덮밥(1.5.13)", "유부장국(5.6)", "매콤떡볶이", "깍두기(9)", "요구르트(2)"],
        cal: 720,
        proteinPct: 68,
        allergens: ["난류", "우유", "대두", "밀"]
      }
    },
    // 금요일
    {
      lunch: {
        dishes: ["오색조밥", "해물순두부찌개(5.18)", "바싹갈비구이*(10)", "새콤도라지오이무침.", "석박지(9)"],
        cal: 820,
        proteinPct: 92,
        allergens: ["대두", "밀", "조개류", "돼지고기"]
      },
      dinner: {
        dishes: ["고소한새우볶음밥(9)", "가쓰오장국", "매콤군만두", "단무지", "짜요짜요(2)"],
        cal: 710,
        proteinPct: 58,
        allergens: ["난류", "우유", "대두", "새우", "밀"]
      }
    }
  ];

  return weekDates.map((dateObj, idx) => {
    const dishesRaw = mockMenus[idx];
    const key = formatDateKey(dateObj);
    const dateStr = dateObj.toISOString().split("T")[0];
    
    // Create lunchtime MealData
    const lunchMeal: MealData = {
      id: `${key}_lunch`,
      schoolName: "씨마스고등학교",
      date: dateStr,
      dateKey: key,
      dayOfWeek: daysOfWeek[idx],
      mealType: "lunch",
      title: "중식",
      dishes: dishesRaw.lunch.dishes,
      totalCalories: dishesRaw.lunch.cal,
      nutrition: {
        protein: Math.round(dishesRaw.lunch.cal * 0.038), // 32g level
        carbs: Math.round(dishesRaw.lunch.cal * 0.13), // 110g level
        fat: Math.round(dishesRaw.lunch.cal * 0.03), // 25g level
      },
      allergens: dishesRaw.lunch.allergens,
      proteinProgress: dishesRaw.lunch.proteinPct
    };

    // Create dinnertime MealData
    const dinnerMeal: MealData = {
      id: `${key}_dinner`,
      schoolName: "씨마스고등학교",
      date: dateStr,
      dateKey: key,
      dayOfWeek: daysOfWeek[idx],
      mealType: "dinner",
      title: "석식",
      dishes: dishesRaw.dinner.dishes,
      totalCalories: dishesRaw.dinner.cal,
      nutrition: {
        protein: Math.round(dishesRaw.dinner.cal * 0.034),
        carbs: Math.round(dishesRaw.dinner.cal * 0.125),
        fat: Math.round(dishesRaw.dinner.cal * 0.028),
      },
      allergens: dishesRaw.dinner.allergens,
      proteinProgress: dishesRaw.dinner.proteinPct
    };

    return [lunchMeal, dinnerMeal];
  }).flat();
}

/**
 * 영양계산용 기본 메뉴 항목 리스트
 */
export const DEFAULT_NUTRITION_MENU_ITEMS: MenuItemField[] = [
  {
    id: "m_1",
    name: "현미밥",
    category: "밥류",
    description: "탄수화물 60g / 식이섬유 풍부",
    calories: 300,
    protein: 6,
    carbs: 60,
    fat: 2,
    allergens: [],
    selected: false
  },
  {
    id: "m_2",
    name: "혼합잡곡밥",
    category: "밥류",
    description: "식이섬유가 가득한 고소한 잡곡밥",
    calories: 280,
    protein: 5,
    carbs: 56,
    fat: 2,
    allergens: [],
    selected: false
  },
  {
    id: "m_3",
    name: "돼지고기 김치찌개",
    category: "국/찌개",
    description: "돼지고기 함유 / 비타민 B1",
    calories: 250,
    protein: 20,
    carbs: 5,
    fat: 15,
    allergens: ["돼지고기"],
    selected: false
  },
  {
    id: "m_4",
    name: "쇠고기 미역국",
    category: "국/찌개",
    description: "한우 양지로 맑게 우려낸 미역국",
    calories: 160,
    protein: 12,
    carbs: 4,
    fat: 10,
    allergens: ["쇠고기"],
    selected: false
  },
  {
    id: "m_5",
    name: "시금치 나물",
    category: "반찬",
    description: "식이섬유 3g / 엽산, 철분 풍부",
    calories: 45,
    protein: 2,
    carbs: 3,
    fat: 1,
    allergens: [],
    selected: false
  },
  {
    id: "m_6",
    name: "고등어 구이",
    category: "반찬",
    description: "오메가-3 / 단백질 25g",
    calories: 250,
    protein: 25,
    carbs: 0,
    fat: 18,
    allergens: ["고등어"],
    selected: false
  },
  {
    id: "m_7",
    name: "치즈돈까스",
    category: "반찬",
    description: "바삭바삭한 생등심 속 모짜렐라 치즈",
    calories: 380,
    protein: 18,
    carbs: 25,
    fat: 24,
    allergens: ["돼지고기", "밀", "우유"],
    selected: false
  },
  {
    id: "m_8",
    name: "매콤돈육강정",
    category: "반찬",
    description: "돼지고기에 매콤콤달콤 강정소스 코팅",
    calories: 290,
    protein: 16,
    carbs: 15,
    fat: 19,
    allergens: ["돼지고기", "밀", "대두"],
    selected: false
  },
  {
    id: "m_9",
    name: "요구르트",
    category: "디저트",
    description: "유산균이 살아있는 달콤 시원한 요구르트",
    calories: 80,
    protein: 1,
    carbs: 18,
    fat: 0.5,
    allergens: ["우유"],
    selected: false
  },
  {
    id: "m_10",
    name: "초코 마카롱",
    category: "디저트",
    description: "달콤 쫀득한 수제 초콜릿 마카롱",
    calories: 140,
    protein: 2,
    carbs: 20,
    fat: 6,
    allergens: ["난류", "우유", "대두"],
    selected: false
  }
];
