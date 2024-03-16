import { FishingGrade, type Ingredients, type Item, type Money } from "./model";

export type Result<T, F> = { ok: true; data: T } | { ok: false; error: F };
export const parse = (text: string | null) => new Parser(text);
export class Parser<T = never> {
  #result: Result<T, string | null>;
  constructor(text: string | null) {
    this.#result = { ok: false, error: text };
  }
  money(): Parser<T | Money> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;
    const m = text.match(/(?<type>칩|토큰)\s*(?<quantity>-?\d+)/);
    if (m == null) return this;

    this.#result = {
      ok: true,
      data: {
        type: m.groups!.type === "칩" ? "chips" : "tokens",
        quantity: Number(m.groups!.quantity),
      } as T,
    };

    return this;
  }
  date(): Parser<T | Date> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) {
      this.#result = {
        ok: true,
        data: date as T,
      };
      return this;
    }

    const m = text.match(
      /(?<month>1?\d+)월\s*(?<date>[123]?\d)일\s*(?<h12>오전|오후)\s*(?<hour>[12]?\d):(?<minute>[0123456]\d)/,
    );
    if (m == null) return this;

    date.setDate(0);
    date.setFullYear(2024, Number(m.groups!.month) - 1, Number(m.groups!.date));
    date.setHours(
      Number(m.groups!.hour) + (m.groups!.h12 === "오전" ? 0 : 12),
      Number(m.groups!.minute),
      0,
      0,
    );
    this.#result = {
      ok: true,
      data: date as T,
    };
    return this;
  }
  item(): Parser<T | Item> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    const item: Item = {
      type: "item",
      id: text,
    };

    this.#result = {
      ok: true,
      data: item as T,
    };
    return this;
  }
  number(): Parser<T | number> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    const m = text.match(/^(?<number>[-+]?\d+(?:\.\d+)?)(?<unit>%)?/);
    if (m == null) return this;

    let number = Number(m.groups!.number);
    const unit = m.groups!.unit;

    if (unit === "%") number /= 100;
    this.#result = {
      ok: true,
      data: number as T,
    };
    return this;
  }
  grade(): Parser<T | FishingGrade> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    switch (text) {
      case "전설": {
        this.#result = {
          ok: true,
          data: FishingGrade.Legendary as T,
        };
        break;
      }
      case "희귀": {
        this.#result = {
          ok: true,
          data: FishingGrade.Epic as T,
        };
        break;
      }
      case "레어": {
        this.#result = {
          ok: true,
          data: FishingGrade.Rare as T,
        };
        break;
      }
      case "일반": {
        this.#result = {
          ok: true,
          data: FishingGrade.Common as T,
        };
        break;
      }
      default: {
        this.#result = {
          ok: true,
          data: FishingGrade.Uncommon as T,
        };
        break;
      }
    }
    return this;
  }
  ingredients(): Parser<T | Ingredients> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    const ingredients = text.trim().split(/\s*,\s*/g);

    this.#result = {
      ok: true,
      data: ingredients.reduce(
        (o, x) => {
          if (x.startsWith("(")) {
            o.oneOf.push(x.slice(1, -1).split(/\s*\|\s*/g));
          } else {
            o.required.push(x);
          }
          return o;
        },
        {
          required: [],
          oneOf: [],
        } as Ingredients,
      ) as T,
    };

    return this;
  }
  boolean(): Parser<T | boolean> {
    if (this.#result.ok) return this;
    if (this.#result.error == null) return this;
    const text = this.#result.error;

    this.#result = {
      ok: true,
      data: (text === "TRUE") as T,
    };
    return this;
  }
  unwrap() {
    if (this.#result.ok) return this.#result.data;
    return null;
  }
}
