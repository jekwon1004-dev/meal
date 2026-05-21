/**
 * 씨마스고등학교 급식 - 날짜 및 식단 전처리 유틸리티 함수
 */

/**
 * 한국 표준시(KST) 기준의 오늘 Date 객체를 반환합니다.
 */
export function getTodayKST(): Date {
  const now = new Date();
  // 브라우저의 시간대 설정을 보완하며 한국 시간으로 조절합니다.
  // 한국은 UTC+9 이므로, 브라우저 로컬 시간을 한국 시간대로 전환하기 쉬운 보편적 방식 사용
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kstOffset = 9 * 60 * 60000;
  return new Date(utc + kstOffset);
}

/**
 * Date 객체를 "M월 D일 요일" 형식의 한국어 문자열로 포맷팅합니다.
 */
export function formatKoreanDate(date: Date): string {
  const months = date.getMonth() + 1;
  const days = date.getDate();
  const dayNameList = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dayName = dayNameList[date.getDay()];
  return `${months}월 ${days}일 ${dayName}`;
}

/**
 * Date 객체를 "YYYYMMDD" 형식의 문자열 키로 변환합니다.
 */
export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

/**
 * 주어진 날짜가 포함된 주의 월요일부터 금요일까지의 Date 객체 배열을 구합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0(일) - 6(토)
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    weekDates.push(nextDay);
  }
  return weekDates;
}

/**
 * 날짜의 주차를 계산하여 "M월 N주차" 문자열로 반환합니다.
 */
export function getWeekOfMonth(date: Date): string {
  const d = new Date(date);
  const dateNum = d.getDate();
  
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)
  
  // 첫째 주의 요일에 따른 오프셋 반영하여 주차 계산
  const week = Math.ceil((dateNum + (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)) / 7);
  return `${d.getMonth() + 1}월 ${week}주차`;
}

/**
 * 기본 선택 날짜를 가져옵니다. 
 * 오늘이 주말(토/일)이라면 다음 주 월요일의 Date 객체를 반환하고, 아니면 오늘을 반환합니다.
 */
export function getDefaultSelectedDate(today: Date): Date {
  const dayOfW = today.getDay();
  if (dayOfW === 0) { // 일요일
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 1);
    return nextMonday;
  } else if (dayOfW === 6) { // 토요일
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 2);
    return nextMonday;
  }
  return today;
}

/**
 * NEIS 식단데이터 등의 원본 요리명에 포함된 불필요한 번호, 알레르기 유발 정보, 특수 기호 등을 깨끗하게 청소합니다.
 */
export function cleanDishName(dish: string): string {
  if (!dish) return "";
  let cleaned = dish;
  
  // HTML <br> 태그 제거
  cleaned = cleaned.replace(/<br\s*\/?>/gi, " ");
  
  // 괄호 안에 있는 알레르기 숫자 및 기타 문자 제거, 예: (5.6.13) (5) (밀/대두)
  cleaned = cleaned.replace(/\([^)]*\)/g, "");
  
  // 숫자 코드 제거 (예: *1.2.3.4, @13.5)
  cleaned = cleaned.replace(/[*@~]\d+[\d.]*/g, "");
  
  // 불필요한 마침표, 별표, 특수 기호들 정리
  cleaned = cleaned.replace(/[.*ㆍ•·\s\-]+/g, " ");
  
  // 급식코드 등의 괄호 및 숫자 제거 잔해물 정리
  cleaned = cleaned.replace(/\s\d+\s/g, " ");
  
  // 꼬리 숫자 정리
  cleaned = cleaned.replace(/\s\d+$/g, "");
  
  // 과도한 공백 병합 및 다듬기
  cleaned = cleaned.replace(/\s+/g, " ");
  
  return cleaned.trim();
}
