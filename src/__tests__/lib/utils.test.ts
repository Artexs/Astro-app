import { cn } from "~/lib/utils";
import { describe, it, expect } from "vitest";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("text-red-500", "bg-blue-200")).toBe("text-red-500 bg-blue-200");
  });

  it("should handle conditional class names", () => {
    expect(cn("text-red-500", true && "bg-blue-200", false && "hidden")).toBe("text-red-500 bg-blue-200");
  });

  it("should override conflicting class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle mixed input types", () => {
    expect(cn("p-4", ["m-2", "block"], { "text-lg": true, "font-bold": false })).toBe("p-4 m-2 block text-lg");
  });

  it("should return an empty string if no inputs are provided", () => {
    expect(cn()).toBe("");
  });

  it("should handle null and undefined inputs", () => {
    expect(cn(null, "text-red-500", undefined)).toBe("text-red-500");
  });
});
