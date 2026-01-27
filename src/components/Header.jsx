// Навигационная шапка — содержит ссылки, количество в корзине и кнопку выхода.
// В проекте поиск реализуется внутри /products, поэтому в header поле поиска не показано.
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Header() {
  const { cart, auth, logout, isAuthenticated } = useStore();
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  // безопасный подсчёт элементов корзины
  const cartCount = Array.isArray(cart) ? cart.length : 0;

  return (
    <header className="header" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px" }}>
      {/* Логотип */}
      <h1 className="logo" style={{ margin: 0 }}>Game-Market</h1>

      {/* Навигация — не меняем маршруты; активная ссылка подсвечивается проверкой loc.pathname */}
      <nav style={{ display: "flex", gap: 12, marginLeft: "auto", alignItems: "center" }}>
        <Link className={loc.pathname === "/" ? "active" : ""} to="/">Главная</Link>
        <Link className={loc.pathname === "/products" ? "active" : ""} to="/products">Каталог</Link>
        <Link className={loc.pathname === "/profile" ? "active" : ""} to="/profile">Профиль</Link>
        <Link className={loc.pathname === "/library" ? "active" : ""} to="/library">Библиотека</Link>
        <Link className={loc.pathname === "/cart" ? "active" : ""} to="/cart">Корзина ({cartCount})</Link>

        {/* Кнопка входа/выхода и отображение имени пользователя */}
        {!isAuthenticated ? (
          <Link className={loc.pathname === "/login" ? "active" : ""} to="/login">Войти</Link>
        ) : (
          <>
            <span style={{ color: "#ddd", marginLeft: 8 }}>{auth?.user?.username}</span>
            <button style={{ marginLeft: 8 }} onClick={handleLogout}>Выйти</button>
          </>
        )}
      </nav>
    </header>
  );
}