"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/content/schemas";

export function ImageGallery({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeIndex !== null && dialog && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog?.open) dialog.close();
  }, [activeIndex]);

  if (!items.length) return <p className="empty-state">Nenhuma imagem adicional cadastrada.</p>;

  const active = activeIndex === null ? undefined : items[activeIndex];
  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <button className="gallery-thumb" key={item.src} onClick={() => setActiveIndex(index)} type="button">
            <Image alt={item.alt} height={360} src={item.src} unoptimized width={520} />
            {item.caption && <span>{item.caption}</span>}
          </button>
        ))}
      </div>
      <dialog aria-label="Visualização da galeria" className="gallery-dialog" onClose={() => setActiveIndex(null)} ref={dialogRef}>
        {active && (
          <div className="gallery-dialog-inner">
            <button aria-label="Fechar galeria" className="gallery-close" onClick={() => setActiveIndex(null)} type="button"><X size={20} /></button>
            {items.length > 1 && <button aria-label="Imagem anterior" className="gallery-nav gallery-prev" onClick={() => setActiveIndex((activeIndex! - 1 + items.length) % items.length)} type="button"><ArrowLeft size={20} /></button>}
            <Image alt={active.alt} className="gallery-large" height={900} src={active.src} unoptimized width={1400} />
            {active.caption && <p>{active.caption}</p>}
            {items.length > 1 && <button aria-label="Próxima imagem" className="gallery-nav gallery-next" onClick={() => setActiveIndex((activeIndex! + 1) % items.length)} type="button"><ArrowRight size={20} /></button>}
          </div>
        )}
      </dialog>
    </>
  );
}
