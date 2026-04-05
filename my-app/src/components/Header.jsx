import React from "react";
import "./Header.css";
import logo from "../logopng.png";

export default function Header({
  activePage,
  onNavigate,
  onCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  cartItemCount,
}) {
  const navItems = [
    { key: "home", label: "Главная" },
    { key: "catalog", label: "Каталог" },
    { key: "new", label: "Новинки" },
  ];

  const secondaryItems = [
    { key: "ps", label: "PlayStation", platform: "PlayStation" },
    { key: "steam", label: "Steam", platform: "Steam/PC" },
    { key: "xbox", label: "Xbox", platform: "Xbox" },
    { key: "subs", label: "Подписки", category: "Подписки" },
    { key: "dlc", label: "DLC", category: "DLC" },
  ];

  const resetFilter = {
    key: "all",
    category: "Все товары",
    platform: "Все",
    genre: "Все",
  };

  const handleCategorySelect = (item) => {
    const isAll = item.key === "all" || item.category === "Все товары";

    onCategoryChange && onCategoryChange(isAll ? resetFilter : item);
    onNavigate && onNavigate("catalog");
  };

  const getNavActive = (item) => {
    if (item.key === "home") return activePage === "home";

    if (item.key === "catalog")
      return (
        activePage === "catalog" && activeFilters?.category === "Все товары"
      );

    if (item.key === "new")
      return activePage === "catalog" && activeFilters?.category === "Новинки";

    return false;
  };
  const handleNavClick = (item) => {
    if (item.key === "home") {
      onNavigate && onNavigate("home");
      return;
    }

    if (item.key === "catalog") {
      onCategoryChange && onCategoryChange(resetFilter);
      onNavigate && onNavigate("catalog");
      return;
    }

    if (item.key === "new") {
      onCategoryChange && onCategoryChange({ key: "new", category: "Новинки" });
      onNavigate && onNavigate("catalog");
      return;
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div
          className="header-logo"
          onClick={() => onNavigate && onNavigate("home")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">Samoletik-Shop</span>
        </div>

        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-link ${getNavActive(item) ? "active" : ""}`}
              onClick={() => handleNavClick(item)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-search">
          <input
            type="text"
            placeholder="Поиск игр..."
            className="search-input"
            value={searchTerm || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <button
            className="search-btn"
            type="button"
            onClick={() => {
              if (activePage !== "catalog") {
                onNavigate && onNavigate("catalog");
                onCategoryChange && onCategoryChange(resetFilter);
              }
            }}
          >
            🔍
          </button>
        </div>

        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => onNavigate && onNavigate("profile")}
            type="button"
          >
            👤 Профиль
          </button>

          <button
            className="btn-secondary"
            onClick={() => onNavigate && onNavigate("cart")}
            type="button"
          >
            🛒 Корзина{cartItemCount ? ` (${cartItemCount})` : ""}
          </button>

          <button
            className="btn-secondary"
            type="button"
            onClick={() => onNavigate && onNavigate("chat")}
          >
            💬 Сообщения
          </button>
        </div>
      </div>

      <div className="header-secondary">
        {secondaryItems.map((item) => {
          const isActive =
            (item.key === "all" && activeFilters?.category === "Все товары") ||
            (item.category && activeFilters?.category === item.category);

          return (
            <button
              key={item.key}
              className={`secondary-link ${isActive ? "active" : ""}`}
              onClick={() => handleCategorySelect(item)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
