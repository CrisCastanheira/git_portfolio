import { expect, test } from "@playwright/test";

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fixtureSnapshot() {
  const today = dateKey(new Date());
  const yesterdayDate = new Date(`${today}T00:00:00.000Z`);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = dateKey(yesterdayDate);
  const fromDate = new Date(`${today}T00:00:00.000Z`);
  fromDate.setUTCDate(fromDate.getUTCDate() - 364);
  const from = dateKey(fromDate);
  const accounts = ["CrisCastanheira", "CristianoDazum"].map((login, index) => ({
    login,
    status: "available",
    days: [{ date: yesterday, count: index + 1 }],
  }));
  return {
    generatedAt: new Date().toISOString(),
    from,
    to: today,
    quality: "complete",
    accounts,
    days: [{ date: yesterday, count: 3 }],
    metrics: { total: 3, activeDays: 1, currentStreak: 1, longestStreak: 1 },
  };
}

test("navega pelas páginas profissionais e explica coleções vazias", async ({ page }) => {
  await page.route("**/api/activity", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ quality: "unavailable", snapshot: null, message: "Ainda não há uma sincronização válida." }),
  }));
  await page.route("**/api/organization", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ organization: "Dazum-Digital", repositories: [] }),
  }));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /código, projetos e trajetória em um só lugar/i })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText("Atividade ainda não sincronizada.")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);

  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await navigation.getByRole("link", { name: "Projetos" }).click();
  await expect(page.getByRole("heading", { name: "Projetos e repositórios." })).toBeVisible();
  await expect(page.getByText(/Nenhum projeto pessoal foi cadastrado/)).toBeVisible();
  await expect(page.getByText(/A organização não possui repositórios públicos/)).toBeVisible();

  await navigation.getByRole("link", { name: "Certificados" }).click();
  await expect(page.getByText("Nenhum certificado foi cadastrado ainda.")).toBeVisible();
  await navigation.getByRole("link", { name: "Trabalhos" }).click();
  await expect(page.getByText("Nenhum trabalho foi cadastrado ainda.")).toBeVisible();
  await navigation.getByRole("link", { name: "Sobre" }).click();
  await expect(page.getByText("O perfil ainda não possui uma biografia cadastrada.")).toBeVisible();
  await navigation.getByRole("link", { name: "Contato" }).click();
  await expect(page.getByText("Nenhum e-mail de contato foi cadastrado.")).toBeVisible();
});

test("alterna tema e filtra uma atividade carregada nos modos 2D e 3D", async ({ page }) => {
  await page.route("**/api/activity", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ quality: "complete", snapshot: fixtureSnapshot() }),
  }));
  await page.goto("/");

  const themeButton = page.getByRole("button", { name: "Alternar tema claro ou escuro" });
  await expect.poll(() => page.locator("html").getAttribute("data-theme")).toMatch(/^(light|dark)$/);
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", initialTheme === "dark" ? "light" : "dark");

  await expect(page.getByText("Cobertura completa", { exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Conta" }).selectOption("CrisCastanheira");
  await page.getByRole("combobox", { name: "Período" }).selectOption("30");
  await expect(page.getByRole("button", { name: "Mapa de contribuições" })).toBeVisible();
  await page.getByRole("button", { name: "Mapa de contribuições" }).click();
  await expect(page.getByRole("button", { name: "Mapa de contribuições" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Skyline 3D" }).click();
  await expect(page.getByRole("button", { name: "Skyline 3D" })).toHaveAttribute("aria-pressed", "true");
});
