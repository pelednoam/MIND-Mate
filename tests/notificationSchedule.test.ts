import { describe, expect, it } from "vitest";
import {
  DEFAULT_NUDGE_SCHEDULE,
  buildNotificationPayload
} from "../src/lib/notificationSchedule";

describe("notificationSchedule", () => {
  it("defines the default nudge schedule", () => {
    expect(DEFAULT_NUDGE_SCHEDULE).toHaveLength(4);
    expect(DEFAULT_NUDGE_SCHEDULE[0].cron).toBe("0 8 * * *");
  });

  it("builds notification payloads from nudges", () => {
    const payload = buildNotificationPayload({
      time: "morning",
      title: "Morning booster",
      body: "Add walnuts today.",
      tags: ["breakfast"]
    });

    expect(payload.title).toBe("Morning booster");
    expect(payload.tags).toEqual(["breakfast"]);
  });
});
