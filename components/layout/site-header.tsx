import Link from "next/link";
import { GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/certificados", label: "Certificados" },
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link aria-label="GitHub Unificado, página inicial" className="brand" href="/">
          <span className="brand-mark"><GitBranch aria-hidden="true" size={19} /></span>
          <span>GitHub <strong>Unificado</strong></span>
        </Link>
        <nav aria-label="Navegação principal" className="main-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
