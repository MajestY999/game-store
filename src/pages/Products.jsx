// Каталог: поиск + пагинация.
// Поиск фильтрует по title/name/slug, description/shortDescription и categories.
import React, { useMemo, useState } from "react";
import { useStore } from "../store/store";
import GameCard from "../components/GameCard";

export default function Products() {
  const { games = [] } = useStore();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Фильтрация: приведение полей к строкам + toLowerCase() для корректного поиска
  const filtered = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    if (!term) return games;
    return (games || []).filter((g) => {
      const title = String(g.title || g.name || g.slug || "").toLowerCase();
      const descr = String(g.description || g.shortDescription || "").toLowerCase();
      const cats = Array.isArray(g.categories) ? g.categories.join(" ").toLowerCase() : String(g.categories || "").toLowerCase();
      return title.includes(term) || descr.includes(term) || cats.includes(term) || String(g.slug || "").toLowerCase().includes(term);
    });
  }, [games, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Каталог игр</h2>

      {/* Поле поиска (локальное) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Поиск по названию, описанию, категориям..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1); // при изменении поиска возвращаемся на первую страницу
          }}
          style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <div className="text-muted" style={{ alignSelf: "center" }}>Найдено: {total}</div>
      </div>

      {/* Сетка карточек */}
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {pageItems.map((g) => (
          <GameCard key={g.id || g.slug} game={g} />
        ))}
      </div>

      {/* Пагинация */}
      {pages > 1 && (
        <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <button className="btn secondary" disabled={current <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Назад</button>
          <span style={{ alignSelf: "center" }}>{current} / {pages}</span>
          <button className="btn secondary" disabled={current >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>Вперёд →</button>
        </div>
      )}
    </div>
  );
}