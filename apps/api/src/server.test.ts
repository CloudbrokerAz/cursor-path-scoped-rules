import { describe, expect, it } from "vitest";
import { createUserHandler } from "./routes/users";

describe("createUserHandler", () => {
  it("rejects an empty body", () => {
    const result = createUserHandler({});
    expect(result).toMatchObject({ code: "INVALID_BODY" });
  });
});
