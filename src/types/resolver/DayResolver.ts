import { Food } from "./FoodResolver";

export interface DayInputData {
  date: string;
  foodId: string[];
}

export interface Day {
  meals: Food[];
  date: string;
}

interface DayResolver {
  dayInputs: DayInputData[];
}

export interface GetDaysResolver {
  date: string;
}

export interface RandomizeDaysResolver extends DayResolver {}
export interface PatchDayResolver extends DayResolver {}
