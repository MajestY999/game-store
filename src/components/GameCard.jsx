// Карточка игры — отображается в каталоге, на главной и в библиотеке.
// В карточке:
// - картинка (game.image)
// - название + ссылка на /game/:id (encodeURIComponent используется в местах, где id может содержать пробелы)
// - цена, часы из library для текущего пользователя
// - кнопки: Купить (addToCart), В избранное (toggleFlag)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function GameCard({ game, showBuy = true }) {
  const { addToCart, user, library = [], cart = [], toggleFlag } = useStore();
  const nav = useNavigate();

  // безопасное сравнение id
  const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);

  // пытаемся найти запись в library, принадлежащую текущему пользователю
  const libEntry = (library || []).find(
    (entry) =>
      String(entry.userId) === String(user?.id) &&
      (matchId(entry.id, game.id) ||
        matchId(entry.gameId, game.id) ||
        matchId(entry.gameId, game.slug) ||
        matchId(entry.id, game.slug))
  ) || null;

  // часы и статус покупки определяются по записи в library (источник правды)
  const hours = libEntry?.hours ?? 0;
  const isPurchased = !!libEntry;
  const inCart = (cart || []).some((c) => matchId(c, game.id) || matchId(c, game.slug));

  // формируем безопасный путь — используем encodeURIComponent, т.к. id может содержать пробелы
  const href = `/game/${encodeURIComponent(game.id || game.slug)}`;

  // Обработчик кнопки Купить.
  // - если не залогинен — перенаправляем на логин
  // - если уже куплено — показываем alert (покупать нельзя)
  // - в остальных случаях вызываем addToCart и при успехе переходим в корзину
  const handleBuy = (e) => {
    e && e.stopPropagation();
    if (!user) {
      nav("/login");
      return;
    }
    if (isPurchased) {
      window.alert("Уже куплено");
      return;
    }
    const res = addToCart ? addToCart(game.id ?? game.slug) : { ok: false };
    if (res && res.ok) nav("/cart");
    else if (res && res.ok === false) window.alert(res.message || "Ошибка");
  };

  // Переключатель избранного (wishlist)
  const handleToggleWishlist = (e) => {
    e && e.stopPropagation();
    if (!toggleFlag) return;
    toggleFlag(game.id ?? game.slug, "wishlist");
  };

  return (
    // Делаем карточку кликабельной: клик по карточке ведёт в детальную страницу
    <div className="card" onClick={() => nav(href)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==="Enter") nav(href); }}>
      {/* Картинка — если не загружается, скрываем элемент */}
      {game.image ? (
        <Link to={href} onClick={(e)=>e.stopPropagation()}>
          <img src={game.image} alt={game.title || game.name} className="game-art" onError={(e)=>{e.currentTarget.style.display='none'}}/>
        </Link>
      ) : (
        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4" }}>Нет изображения</div>
      )}

      <h3>
        <Link to={href} onClick={(e)=>e.stopPropagation()} style={{ color: "inherit", textDecoration: "none" }}>
          {game.title || game.name}
        </Link>
      </h3>

      {game.description && <p className="text-muted">{game.description}</p>}
      <p>Цена: {game.price ? `${game.price} ${game.currency || "RUB"}` : "Бесплатно"}</p>

      {/* Показываем часы из library */}
      <p>Часы: {hours.toFixed(2)}</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        {showBuy && (
          <button className="btn primary" onClick={handleBuy} type="button" disabled={isPurchased}>
            {isPurchased ? "Уже куплено" : inCart ? "В корзине" : "Купить"}
          </button>
        )}

        <button className="btn ghost" onClick={handleToggleWishlist} type="button">
          {game.wishlist ? "Убрать из избранного" : "В избранное"}
        </button>
      </div>
    </div>
  );
}