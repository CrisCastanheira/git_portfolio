import { describe, expect, it } from "vitest";
import { buildGrid, resolveSkylineData } from "@/components/ui/contribution-skyline";

describe("Contribution Skyline data", () => {
  it("keeps an explicit empty data set empty instead of substituting a demo year", () => {
    const data = resolveSkylineData([], Date.UTC(2026, 10, 13), 7, "development");
    expect(data).toEqual([]);
    const grid = buildGrid(data, Date.UTC(2026, 10, 13));
    expect(grid.cells.every((cell) => cell.count === 0)).toBe(true);
  });

  it("does not generate demo contributions in production when data is omitted", () => {
    expect(resolveSkylineData(undefined, Date.UTC(2026, 10, 13), 7, "production")).toEqual([]);
  });
});
