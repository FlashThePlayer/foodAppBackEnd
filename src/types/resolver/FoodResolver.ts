import { User } from "./UserResolver";

export interface Food {
  _id?: string;
  name: string;
  link?: string;
  pictureLink?: string;
  favorite: boolean;
  rating: number;
  difficulty: string;
  creator: User;
  keywords: string[];
  recipe?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodInputData {
  name: string;
  link?: string;
  pictureLink?: string;
  recipe?: string;
  favorite: boolean;
  rating: number;
  difficulty: string;
  keywords: string[];
}

export interface FoodData {
  foods: Food[];
  totalPages: number;
}

export interface FoodQuery {
  name?: string;
  favorite?: boolean;
  rating?: number;
  difficulty?: string;
}

interface FoodResolver {
  id: string;
}

export interface CreateFoodResolver {
  foodInput: FoodInputData;
}

export interface GetFoodsResolver {
  page: number;
  query: FoodQuery;
}

export interface GetRandomFoodsResolver {
  tags?: string[];
}

export interface SearchFoodResolver {
  name: string;
}

export interface GetFoodResolver extends FoodResolver {}

export interface DeleteFoodResolver extends FoodResolver {}
