import { describe, expect, it } from "vitest";
import { getLimitServingsFromWeeklyLog } from "../src/lib/weeklyLogReader";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";

describe("weeklyLogReader", () => {
  it("reads limit servings from weekly log", () => {
    const log = buildZeroWeeklyLog();
    const limits = getLimitServingsFromWeeklyLog(log);
    expect(limits.red_meat).toBe(0);
    expect(limits.fried_food).toBe(0);
  });
});
