"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export type ContentCardData = {
  title: string;
  summary?: string;
  href?: string;
  external?: boolean;
  group?: string;
  date?: string;
  tags?: string[];
};

export function ContentCollection({
  items,
  emptyMessage,
}: {
  items: ContentCardData[];
  emptyMessage: string;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState("title");
  const groups = useMemo(() => [...new Set(items.map((item) => item.group).filter((value): value is string => Boolean(value)))].sort(), [items]);
  const visibleItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return items
      .filter((item) => group === "all" || item.group === group)
      .filter((item) => !needle || `${item.title} ${item.summary ?? ""} ${item.tags?.join(" ") ?? ""}`.toLocaleLowerCase("pt-BR").includes(needle))
      .sort((left, right) => sort === "recent"
        ? (right.date ?? "").localeCompare(left.date ?? "")
        : sort === "oldest"
          ? (left.date ?? "").localeCompare(right.date ?? "")
          : left.title.localeCompare(right.title, "pt-BR"));
  }, [group, items, query, sort]);

  if (!items.length) return <p className="empty-state">{emptyMessage}</p>;

  return (
    <div className="content-browser">
      <div className="content-filters" aria-label="Filtros da coleção">
        <label className="search-field">
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">Buscar nesta coleção</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou palavra-chave" />
        </label>
        <label className="filter-field">
          <span>Categoria</span>
          <select value={group} onChange={(event) => setGroup(event.target.value)}>
            <option value="all">Todas</option>
            {groups.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="filter-field">
          <span>Ordenar</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="title">Nome</option>
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
          </select>
        </label>
      </div>
      {visibleItems.length ? (
        <div className="content-grid">
          {visibleItems.map((item) => {
            const content = (
              <>
                <span className="content-card-meta">{item.group ?? "Portfólio"}{item.date ? ` · ${item.date}` : ""}</span>
                <h2>{item.title}</h2>
                {item.summary && <p>{item.summary}</p>}
                {!!item.tags?.length && <span className="content-tags">{item.tags.join(" · ")}</span>}
                {item.href && <span className="card-link">{item.external ? "Abrir referência" : "Ver detalhes"} <ArrowUpRight aria-hidden="true" size={15} /></span>}
              </>
            );
            return item.href
              ? item.external
                ? <a className="content-card" href={item.href} key={`${item.title}-${item.href}`} rel="noreferrer" target="_blank">{content}</a>
                : <Link className="content-card" href={item.href} key={`${item.title}-${item.href}`}>{content}</Link>
              : <article className="content-card" key={item.title}>{content}</article>;
          })}
        </div>
      ) : <p className="empty-state">Nenhum item corresponde aos filtros selecionados.</p>}
    </div>
  );
}
