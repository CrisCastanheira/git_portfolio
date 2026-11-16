import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActivityPanel } from "@/components/activity/activity-panel";

describe("activity panel empty state", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("explains unavailable data without rendering a simulated calendar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      quality: "unavailable",
      snapshot: null,
      message: "Ainda não há uma sincronização válida.",
    }), { status: 200, headers: { "content-type": "application/json" } })));

    render(<ActivityPanel />);
    expect(await screen.findByText("Atividade ainda não sincronizada.")).toBeInTheDocument();
    expect(screen.getByText("Ainda não há uma sincronização válida.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
