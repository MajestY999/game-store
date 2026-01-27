/*
  Cart.jsx — страница корзины.
  Назначение и логика:
  - Берёт cart (массив id) и games из стора.
  - Сопоставляет id из cart с объектами игр в games (по id или slug).
  - Показывает список элементов, их изображения, названия и цену.
  - Считает итоговую сумму (total).
  - Кнопка "Оформить" вызывает checkout():
      * если нет user — перенаправляет на /login.
      * если checkout успешен — навигирует в /library.
      * иначе показывает ошибку.
  - Есть кнопки удаления одного элемента (removeFromCart) и очистки корзины (clearCart).
  Важные моменты:
  - Сопоставление id -> объект игры использует строгую строковую проверку String(...).
  - Картинки получают src из g.image или g.images[0]; onError скрывает невалидный <img>.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Cart() {
  const { cart = [], games = [], removeFromCart, clearCart, checkout, user } = useStore();
  const nav = useNavigate();

  const items = cart
    .map((id) => games.find((g) => String(g.id) === String(id) || String(g.slug) === String(id)))
    .filter(Boolean);

  const total = items.reduce((s, g) => s + (Number(g.price) || 0), 0);

  const handleCheckout = () => {
    if (!user) {
      nav("/login");
      return;
    }
    const res = checkout();
    if (res && res.ok) {
      nav("/library");
    } else {
      alert(res.message || "Ошибка при оформлении");
    }
  };

  if (!items.length) {
    return (
      <div className="container">
        <div className="card">
          <h2>Корзина</h2>
          <div className="empty">Ваша корзина пуста</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Корзина</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((g) => (
            <div key={g.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img
                src={g.image || (g.images && g.images[0]) || ""}
                alt={g.title || g.name}
                style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 6 }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{g.title || g.name}</div>
                <div className="text-muted">Цена: ${Number(g.price || 0).toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn ghost" onClick={() => removeFromCart(g.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>Итого: ${Number(total).toFixed(2)}</div>
          <div>
            <button className="btn secondary" onClick={handleCheckout}>Оформить</button>
            <button className="btn ghost" style={{ marginLeft: 8 }} onClick={clearCart}>Очистить</button>
          </div>
        </div>
      </div>
    </div>
  );
}