"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const nextDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextDark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem("portfolio-theme", nextDark ? "dark" : "light");
  }

  return (
    <button
      aria-label="Alternar tema claro ou escuro"
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <Sun aria-hidden="true" size={17} />
      <Moon aria-hidden="true" size={17} className="theme-toggle-moon" />
      <span className="sr-only">Alternar tema claro ou escuro</span>
    </button>
  );
}
