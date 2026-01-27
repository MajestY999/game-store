// Главная: теперь показывает постранично (как каталог), но без поиска (показывает все или «популярные»)
import React, { useMemo, useState } from "react";
import { useStore } from "../store/store";
import GameCard from "../components/GameCard";

export default function Home() {
  const { games = [] } = useStore();
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const items = useMemo(() => games || [], [games]);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Главная</h2>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {pageItems.map((game) => (
          <GameCard key={game.id || game.slug} game={game} />
        ))}
      </div>

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