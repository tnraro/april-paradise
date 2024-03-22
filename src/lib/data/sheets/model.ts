export interface Money {
  type: "chips" | "tokens";
  quantity: number;
}

export interface Item {
  type: "item";
  id: string;
}
export interface Ingredients {
  required: string[];
  oneOf: string[][];
}
export interface Cocktail {
  name: string;
  ingredients: Ingredients;
}

export interface IndexData {
  key: string;
  name: string;
}

export interface ScheduleData {
  key: string;
  pathname: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

export interface RouletteData {
  key: string;
  result: Money | Item;
  probability: number;
}

export interface AchievementData {
  key: string;
  name: string;
  condition: string;
  reward: Money;
  isHidden: boolean;
}
export const enum FishingGrade {
  Common,
  Uncommon,
  Heroic,
  Legendary,
  Mythic,
}
export interface FishingData {
  key: string;
  lure: string;
  name: string;
  grade: FishingGrade;
  probability: number;
  hp: number;
  power: number;
  rampancy: number;
  endurance: number;
  catchphrase: string;
  description: string;
  exception: string;
}
export interface LureData {
  key: string;
  name: string;
  price: Money;
}
export interface CocktailNpcData {
  key: string;
  npc: string;
  love: Cocktail;
  like: Cocktail;
}
export interface CocktailStoreData {
  key: string;
  name: string;
  isSpecial: boolean;
  price: Money;
}
