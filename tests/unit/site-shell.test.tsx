import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";
import { SiteHeader } from "@/components/layout/site-header";

describe("site shell", () => {
  it("sets the document language to Brazilian Portuguese", () => {
    const layout = RootLayout({ children: <div /> });
    expect(layout.props.lang).toBe("pt-BR");
  });

  it("presents Portuguese navigation and theme controls accessibly", async () => {
    window.localStorage.setItem("portfolio-theme", "light");
    const user = userEvent.setup();
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "/projetos");
    expect(screen.getByRole("button", { name: /alternar tema/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /alternar tema/i }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("portfolio-theme")).toBe("dark");
  });
});
