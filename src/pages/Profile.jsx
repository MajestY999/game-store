// ...existing code...
/*
  Страница профиля:
  - Показывает информацию о текущем пользователе.
  - Выводит его библиотеку (записи из library, фильтрованные по userId).
  - Для каждой записи:
    * отображаем картинку, название, дату покупки, часы;
    * кнопки: +1ч / +0.5ч (addPlaytime), В избранное (toggleFlag через safeToggle),
      Отметить как пройдено (togglePlayed), Открыть (nav -> /game/:id).
  - safeToggle: обёртка для toggleFlag, применяет результат или делает локальный оптимистичный апдейт
    как для games, так и для library (чтобы UI сразу реагировал).
  - Все handler'ы предотвращают всплытие, чтобы клик по кнопке не перешёл в навигацию карточки.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Profile() {
  const {
    user,
    library = [],
    games = [],
    addPlaytime,
    toggleFlag,
    togglePlayed,
    logout,
    setGames,
    setLibrary,
  } = useStore();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Профиль</h2>
          <div className="empty">Вы не авторизованы</div>
        </div>
      </div>
    );
  }

  const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);

  // мои покупки (только записи, принадлежащие текущему user)
  const my = (library || []).filter((e) => String(e.userId) === String(user.id));

  // safeToggle: вызывает toggleFlag и применяет результат к локальным setGames/setLibrary,
  // либо делает оптимистичный апдейт если toggleFlag не вернул новые снэпшоты.
  const safeToggle = (id, flag) => {
    const res = toggleFlag ? toggleFlag(id, flag) : undefined;
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

  // Обработчики кнопок (предотвращают всплытие)
  const handleToggle = (e, entry, game, flag) => {
    e.preventDefault();
    e.stopPropagation();
    const id = game?.id ?? entry.gameId ?? entry.id ?? game?.slug;
    safeToggle(id, flag);
  };

  const handleTogglePlayed = (e, entry, game) => {
    e.preventDefault();
    e.stopPropagation();
    const id = game?.id ?? entry.gameId ?? entry.id ?? game?.slug;
    if (typeof togglePlayed === "function") {
      const res = togglePlayed(id);
      if (!res || !res.games) safeToggle(id, "played");
      else {
        setGames && setGames(res.games);
        setLibrary && setLibrary(res.library);
      }
    } else {
      safeToggle(id, "played");
    }
  };

  const handleAddPlay = (e, entry, game, minutes) => {
    e.preventDefault();
    e.stopPropagation();
    const id = entry.id ?? entry.gameId ?? game?.id ?? game?.slug;
    const res = typeof addPlaytime === "function" ? addPlaytime(id, minutes) : undefined;
    if (!res || !res.library) {
      // оптимистично инкрементим часы в local copy
      setLibrary && setLibrary((prev) => prev.map((en) => ((matchId(en.id, id) || matchId(en.gameId, id)) && String(en.userId) === String(user.id) ? { ...en, hours: Math.round(((en.hours || 0) + minutes / 60) * 100) / 100 } : en)));
    } else {
      setLibrary && setLibrary(res.library);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Профиль — {user.name || user.email}</h2>
        <div className="text-muted">Email: {user.email}</div>
        <div style={{ marginTop: 12 }}>
          <button className="btn secondary" onClick={() => { logout(); nav("/"); }} type="button">Выйти</button>
        </div>

        <h3 style={{ marginTop: 18 }}>Ваша библиотека</h3>

        {my.length === 0 ? (
          <div className="empty">У вас нет покупок</div>
        ) : (
          <div className="grid" style={{ marginTop: 12 }}>
            {my.map((entry) => {
              const game = (games || []).find((g) =>
                matchId(g.id, entry.gameId) ||
                matchId(g.slug, entry.gameId) ||
                matchId(g.id, entry.id) ||
                matchId(g.slug, entry.id)
              ) || {};
              const gameId = game.id || entry.gameId || entry.id;
              const isWishlist = !!(entry.wishlist ?? game.wishlist);
              const isPlayed = !!(entry.played ?? game.played);

              const img = entry.image || game.image || (game.images && game.images[0]) || "";

              return (
                <div key={`${entry.id}_${gameId}`} className="game-card" style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
                  <img
                    src={img}
                    alt={entry.title || game.title || game.name || "Игра"}
                    style={{ width: 120, height: 72, objectFit: "cover", borderRadius: 6 }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 700, overflowWrap: "break-word" }}>{entry.title || game.title || game.name}</div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        {isWishlist && <span style={{ background: "#8f9096ff", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>В избранном</span>}
                        {isPlayed && <span style={{ background: "#aaabacff", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>Пройдено</span>}
                      </div>
                    </div>

                    <div className="text-muted">Куплено: {entry.purchasedAt ? new Date(entry.purchasedAt).toLocaleDateString() : "-"}</div>
                    <div style={{ marginTop: 8 }}>Часы: {(entry.hours || 0).toFixed(2)}</div>

                    <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <button className="btn primary" type="button" onClick={(e) => handleAddPlay(e, entry, game, 60)}>+1 ч</button>
                      <button className="btn secondary" type="button" onClick={(e) => handleAddPlay(e, entry, game, 30)}>+0.5 ч</button>

                      <button className="btn ghost" type="button" onClick={(e) => handleToggle(e, entry, game, "wishlist")}>
                        {isWishlist ? "Убрать из избранного" : "В избранное"}
                      </button>

                      <button className="btn ghost" type="button" onClick={(e) => handleTogglePlayed(e, entry, game)}>
                        {isPlayed ? "Отметить как не пройдено" : "Отметить как пройдено"}
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
