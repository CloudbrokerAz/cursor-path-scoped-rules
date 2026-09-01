import { describe, expect, it } from "vitest";
import { labelForVariant } from "./ui";

describe("labelForVariant", () => {
  it("returns Continue for primary", () => {
    expect(labelForVariant("primary")).toBe("Continue");
  });
});
