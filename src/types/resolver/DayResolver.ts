import { Food } from "./FoodResolver";

export interface DayInputData {
  date: string;
  foodId: string[];
}

export interface Day {
  meals: Food[];
  date: string;
}

export interface PatchDayResolver {
  dayInputs: DayInputData[];
}

export interface GetDaysResolver {
  date: string;
}

export interface RandomizeDaysResolver {
  date: string;
}