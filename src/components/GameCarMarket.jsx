/*
  GameCarMarket.jsx (в проекте реализует страницу детали игры — GameDetails)
  Назначение:
  - Показывает подробную информацию об одной игре (картинка, описание, цена, категории).
  - Обрабатывает логику покупки (проверка авторизации, проверка уже куплено/в корзине, вызов addToCart).
  - Управляет "избранным" через toggleFlag (wishlist) и обновляет локальный стейт игр при необходимости.
  - Отображает часы, если в library есть запись для текущего пользователя (libEntry).
  Ключевые моменты к объяснению:
  - useParams() читает id из URL; matchId безопасно сравнивает id/slug как строки.
  - Поиск игры: game = games.find(g => matchId(g.id, id) || matchId(g.slug, id))
    (учитываются оба поля — id и slug — чтобы ссылки работали при разных форматах).
  - libEntry = запись из library, привязанная к текущему user — источник правды о покупке/часах.
  - isPurchased определяется по libEntry (предпочтение) или устаревшему game.purchased.
  - handleBuy:
      * если нет user — предлагает перейти на /login (nav с сохранением from).
      * если уже куплено или уже в корзине — показывает alert и не добавляет.
      * иначе вызывает addToCart(game.id) и при успехе navigates в /cart.
  - handleToggleWishlist:
      * вызывает toggleFlag(gameId, "wishlist") из стора.
      * если toggleFlag возвращает обновлённый массив games — применяет через setGames.
      * иначе делает оптимистичный локальный апдейт через setGames.
  - Рендер: разделён на левую (картинка) и правую (инфо + кнопки). onError у <img> скрывает некорректные src.
*/
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function GameDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { games = [], toggleFlag, addToCart, setGames, user, library = [], cart = [] } = useStore();

  const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);

  const game = games.find((g) => matchId(g.id, id) || matchId(g.slug, id));
  if (!game) {
    return <div className="empty">Игра не найдена</div>;
  }

  // запись в библиотеке текущего пользователя (если есть)
  const libEntry = library.find(
    (entry) =>
      String(entry.userId) === String(user?.id) &&
      (matchId(entry.id, game.id) || matchId(entry.gameId, game.id) || matchId(entry.gameId, game.slug) || matchId(entry.id, game.slug))
  );

  const isPurchased = !!libEntry || !!game.purchased;
  const inCart = (cart || []).some((c) => matchId(c, game.id) || matchId(c, game.slug));

  const handleBuy = () => {
    // если не залогинен — переадресуем на логин (с сохранением from)
    if (!user) {
      const goLogin = window.confirm(
        "Вы не вошли в аккаунт. Чтобы купить игру, нужно войти. Перейти на страницу входа?"
      );
      if (goLogin) {
        nav("/login", { state: { from: `/game/${game.slug || game.id}` } });
      }
      return;
    }

    if (isPurchased) {
      window.alert("Эта игра уже у вас в библиотеке.");
      return;
    }

    if (inCart) {
      window.alert("Эта игра уже в вашей корзине.");
      return;
    }

    try {
      const res = addToCart ? addToCart(game.id ?? game.slug) : undefined;
      if (res && res.ok === true) {
        nav("/cart");
        return;
      }
      if (res && res.ok === false) {
        window.alert(res.message || "Не удалось добавить в корзину");
        return;
      }
      // если addToCart не возвращает статус — переходим в корзину (предполагается, что стора обновила cart)
      nav("/cart");
    } catch (err) {
      console.error("addToCart error", err);
      window.alert("Не удалось добавить в корзину");
    }
  };

  const handleToggleWishlist = () => {
    if (!toggleFlag) return;
    const res = toggleFlag(game.id ?? game.slug, "wishlist");
    if (res && res.games) {
      setGames && setGames(res.games);
    } else {
      // оптимистично обновляем локальный games, если store не вернул новый массив
      setGames && setGames((prev) => prev.map((g) => (String(g.id) === String(game.id) || String(g.slug) === String(game.slug) ? { ...g, wishlist: !g.wishlist } : g)));
    }
  };

  return (
    <div className="container">
      <div className="card product-details">
        <div className="left">
          <img src={game.image || (game.images && game.images[0]) || ""} alt={game.title || game.name} style={{ maxWidth: "100%" }} onError={(e)=>{e.currentTarget.style.display='none'}}/>
        </div>
        <div className="right">
          <h1>{game.title || game.name}</h1>
          <div className="product-meta">
            <div className="price">{game.price ? `${game.price} ${game.currency || "RUB"}` : "Бесплатно"}</div>
            <div className="text-muted">{(game.categories || []).join(", ")}</div>
          </div>

          {isPurchased && (
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <strong>Отыгранно часов:</strong> {(libEntry?.hours || 0).toFixed(2)}
            </div>
          )}

          <p style={{ marginTop: 12 }}>{game.description || game.shortDescription}</p>

          <div className="product-actions">
            <button
              className="btn primary"
              type="button"
              onClick={handleBuy}
              disabled={isPurchased}
              title={isPurchased ? "Уже куплено" : undefined}
            >
              {isPurchased ? "Уже куплено" : inCart ? "В корзине" : "Купить"}
            </button>

            <button className="btn secondary" type="button" onClick={handleToggleWishlist}>
              {game.wishlist ? "Убрать из избранного" : "В избранное"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}