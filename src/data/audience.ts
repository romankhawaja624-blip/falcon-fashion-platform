// src/data/audience.ts

export type Audience = "men" | "women" | "kids" | "youngAdults" | "adults";

export const audiences: Audience[] = ["men", "women", "kids", "youngAdults", "adults"];

export const audienceLabels: Record<Audience, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  kids: "Kids & Children",
  youngAdults: "Young Adults",
  adults: "Adults Edition",
};
