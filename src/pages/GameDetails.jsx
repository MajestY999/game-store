// Детальная страница игры: показывает полную информацию и кнопку Купить.
// Источник правды о том, куплена ли игра — запись в library текущего пользователя.
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function GameDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { games = [], addToCart, user, library = [], cart = [] } = useStore();

  const param = id ? decodeURIComponent(id) : id;
  const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);

  // Находим игру по id или slug
  const game = games.find((g) => matchId(g.id, param) || matchId(g.slug, param));
  if (!game) return <div className="empty">Игра не найдена</div>;

  // Находим запись в library текущего пользователя — если есть, это значит что игра куплена
  const libEntry = library.find(
    (entry) =>
      String(entry.userId) === String(user?.id) &&
      (matchId(entry.id, game.id) ||
        matchId(entry.gameId, game.id) ||
        matchId(entry.gameId, game.slug) ||
        matchId(entry.id, game.slug) ||
        matchId(entry.gameId, param) ||
        matchId(entry.id, param))
  );

  const isPurchased = !!libEntry;
  const inCart = (cart || []).some((c) => matchId(c, game.id) || matchId(c, game.slug) || matchId(c, param));

  const handleBuy = () => {
    if (!user) {
      if (window.confirm("Вы не вошли в аккаунт. Перейти на страницу входа?")) nav("/login", { state: { from: `/game/${game.slug || game.id}` } });
      return;
    }
    if (isPurchased) {
      window.alert("Эта игра уже у вас в библиотеке.");
      return;
    }
    if (inCart) {
      window.alert("Игра уже в корзине.");
      return;
    }
    const res = addToCart ? addToCart(game.id ?? game.slug) : { ok: false };
    if (res && res.ok) nav("/cart");
    else window.alert(res?.message || "Ошибка добавления в корзину");
  };

  return (
    <div className="container">
      <div className="card product-details">
        <div className="left">
          {/* Показываем картинку (если есть) */}
          <img src={game.image || (game.images && game.images[0]) || ""} alt={game.title || game.name} style={{ maxWidth: "100%" }} onError={(e)=>{e.currentTarget.style.display='none'}}/>
        </div>

        <div className="right">
          <h1>{game.title || game.name}</h1>
          <div className="product-meta">
            <div className="price">{game.price ? `${game.price} ${game.currency || "RUB"}` : "Бесплатно"}</div>
            <div className="text-muted">{(game.categories || []).join(", ")}</div>
          </div>

          {/* Если игра куплена — показываем часы из library */}
          {isPurchased && <div style={{ marginTop: 8, marginBottom: 8 }}><strong>Отыгранно часов:</strong> {(libEntry?.hours || 0).toFixed(2)}</div>}

          <p style={{ marginTop: 12 }}>{game.description || game.shortDescription}</p>

          <div className="product-actions">
            <button className="btn primary" type="button" onClick={handleBuy} disabled={isPurchased}>
              {isPurchased ? "Уже куплено" : inCart ? "В корзине" : "Купить"}
            </button>

            {/* Кнопка избранного (toggleFlag из Store доступна в компонентах) */}
            <button className="btn secondary" type="button" onClick={() => {
              // используем глобальный toggle через window.__STORE__ (есть в store.useEffect)
              try {
                if (window.__STORE__ && typeof window.__STORE__.toggleFlag === "function") {
                  window.__STORE__.toggleFlag(game.id ?? game.slug, "wishlist");
                }
              } catch (e) {}
            }}>
              {game.wishlist ? "Убрать из избранного" : "В избранное"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}