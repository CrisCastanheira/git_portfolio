import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ImageGallery } from "@/components/content/image-gallery";

describe("accessible image gallery", () => {
  it("shows an explicit empty state when no images were supplied", () => {
    render(<ImageGallery items={[]} />);
    expect(screen.getByText("Nenhuma imagem adicional cadastrada.")).toBeInTheDocument();
  });

  it("opens a dialog and navigates images with keyboard and buttons", async () => {
    const user = userEvent.setup();
    render(<ImageGallery items={[
      { src: "/media/capa.png", alt: "Capa do projeto", caption: "Capa" },
      { src: "/media/tela.png", alt: "Tela do projeto", caption: "Tela" },
    ]} />);

    await user.click(screen.getByRole("button", { name: /abrir imagem 1/i }));
    expect(screen.getByRole("dialog", { name: "Visualização da galeria" })).toBeInTheDocument();
    expect(within(screen.getByRole("dialog", { name: "Visualização da galeria" })).getByRole("img", { name: "Capa do projeto" })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(screen.getByRole("dialog", { name: "Visualização da galeria" })).getByRole("img", { name: "Tela do projeto" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Visualização da galeria" })).not.toBeInTheDocument();
  });
});
