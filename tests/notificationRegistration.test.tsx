import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { NotificationRegistration } from "../src/components/NotificationRegistration";

describe("NotificationRegistration", () => {
  it("renders notification controls", () => {
    const markup = renderToString(<NotificationRegistration />);
    expect(markup).toContain("Notifications");
    expect(markup).toContain("Enable notifications");
  });
});
