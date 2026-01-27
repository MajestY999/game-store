/*
  Страница библиотеки:
  - требует авторизации (проверка user).
  - получает все записи library и фильтрует по current user.
  - Для каждой записи находим соответствующую игру в games (по id/slug).
  - Каждая карточка:
    * кликабельная ссылка на /game/:id (используйте encodeURIComponent, если id могут содержать спецсимволы).
    * показывает изображение (entry.image || game.image), дату покупки и часы.
    * кнопки: +1ч / +0.5ч (addPlaytime), В избранное (safeToggle -> toggleFlag),
      Отметить как пройдено (safeToggle/togglePlayed), Открыть (/game/:id).
  - safeToggle: обёртка — применяет результат toggleFlag или делает оптимистичный апдейт локально.
*/
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Library() {
  const { user, library = [], games = [], toggleFlag, addPlaytime, setLibrary, setGames } = useStore();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Библиотека</h2>
          <div className="empty">Вы не авторизованы</div>
        </div>
      </div>
    );
  }

  const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);
  const my = (library || []).filter((e) => String(e.userId) === String(user.id));

  const safeToggle = (id, flag) => {
    const res = typeof toggleFlag === "function" ? toggleFlag(id, flag) : undefined;
    if (!res || !res.games) {
      setGames && setGames((prev) => prev.map((g) => (matchId(g.id, id) || matchId(g.slug, id) ? { ...g, [flag]: !g[flag] } : g)));
    } else {
      setGames && setGames(res.games);
    }
    if (!res || !res.library) {
      setLibrary && setLibrary((prev) => prev.map((entry) => ((matchId(entry.id, id) || matchId(entry.gameId, id)) && String(entry.userId) === String(user.id) ? { ...entry, [flag]: !entry[flag] } : entry)));
    } else {
      setLibrary && setLibrary(res.library);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Ваша библиотека</h2>

        {my.length === 0 ? (
          <div className="empty">У вас нет покупок</div>
        ) : (
          <div className="grid" style={{ marginTop: 12 }}>
            {my.map((entry) => {
              const game =
                (games || []).find(
                  (g) =>
                    matchId(g.id, entry.gameId) ||
                    matchId(g.slug, entry.gameId) ||
                    matchId(g.id, entry.id) ||
                    matchId(g.slug, entry.id)
                ) || {};

              const gameId = game.id || entry.gameId || entry.id;
              const img = entry.image || game.image || (game.images && game.images[0]) || "";
              const hours = entry.hours || 0;
              const isWishlist = !!(entry.wishlist ?? game.wishlist);

              return (
                <div key={`${entry.id}_${gameId}`} className="game-card" style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
                  <Link to={`/game/${gameId}`} style={{ display: "block", width: 120, flexShrink: 0 }}>
                    {img ? (
                      <img src={img} alt={entry.title || game.title || game.name || "Игра"} style={{ width: 120, height: 72, objectFit: "cover", borderRadius: 6 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <div style={{ width: 120, height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4", borderRadius: 6 }}>Нет изображения</div>
                    )}
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Link to={`/game/${gameId}`} style={{ fontWeight: 700, overflowWrap: "break-word", color: "inherit", textDecoration: "none" }}>
                        {entry.title || game.title || game.name}
                      </Link>

                      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                        {isWishlist && <span style={{ background: "#8e8e96ff", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>В избранном</span>}
                      </div>
                    </div>

                    <div className="text-muted">Куплено: {entry.purchasedAt ? new Date(entry.purchasedAt).toLocaleDateString() : "-"}</div>
                    <div style={{ marginTop: 8 }}>Часы: {Number(hours).toFixed(2)}</div>

                    <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <button className="btn primary" type="button" onClick={() => addPlaytime && addPlaytime(entry.id ?? entry.gameId ?? gameId, 60)}>+1 ч</button>
                      <button className="btn secondary" type="button" onClick={() => addPlaytime && addPlaytime(entry.id ?? entry.gameId ?? gameId, 30)}>+0.5 ч</button>

                      <button className="btn ghost" type="button" onClick={() => safeToggle(gameId, "wishlist")}>
                        {isWishlist ? "Убрать из избранного" : "В избранное"}
                      </button>

                      <button className="btn ghost" type="button" onClick={() => safeToggle(gameId, "played")}>
                        {(entry.played ?? game.played) ? "Отметить как не пройдено" : "Отметить как пройдено"}
                      </button>

                      <button className="btn secondary" style={{ marginLeft: "auto" }} type="button" onClick={() => nav(`/game/${gameId}`)}>Открыть</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}