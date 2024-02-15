import type { RateLimitManager } from "../types";

export class RateLimitManagerClass implements RateLimitManager {
  private rateLimits: Map<string, number>;

  constructor() {
    this.rateLimits = new Map();
  }

  check(key: string): boolean {
    return this.rateLimits.has(key);
  }

  consume(key: string, points: number = 1, time: number = 60000): void {
    this.rateLimits.set(key, points);

    setTimeout(() => {
      this.rateLimits.delete(key);
    }, time);
  }
}
