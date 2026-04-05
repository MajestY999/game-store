import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/CatalogPage.css";
import { catalogGames } from "../data";

function CatalogCard({
  title,
  image,
  price,
  priceLabel,
  discount,
  category,
  onSelect,
  onAddToCart,
}) {
  return (
    <div
      className="catalog-card"
      onClick={onSelect}
      style={{ cursor: onSelect ? "pointer" : "default" }}
    >
      <div className="catalog-card-image-wrapper">
        <img src={image} alt={title} className="catalog-card-image" />
        {discount && <div className="catalog-card-tag">-{discount}%</div>}
        <div className="catalog-card-actions">
          <button
            className="catalog-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart();
            }}
          >
            В корзину
          </button>
        </div>
      </div>
      <div className="catalog-card-info">
        <span className="catalog-card-category">{category}</span>
        <h3>{title}</h3>
        <p className="catalog-card-price">
          {priceLabel || (price >= 0 ? `от ${price} руб` : "—")}
        </p>
      </div>
    </div>
  );
}

export default function CatalogPage({
  activePage,
  onNavigate,
  onHeaderCategoryChange,
  onFilterChange,
  initialFilter = { category: "Все товары", platform: "Все", genre: "Все" },
  searchTerm,
  onSearchChange,
  onProductSelect,
  onAddToCart,
  cartItemCount,
}) {
  const filters = ["Все товары", "По цене", "Новинки", "Популярные", "Скидки"];
  const categories = [
    "Все товары",
    "Игры",
    "Подписки",
    "Новинки",
    "Ключи",
    "DLC",
    "Предзаказы",
  ];
  const platforms = ["Все", "PlayStation", "Steam/PC", "Xbox", "Mobile", "Web"];
  const genres = [
    "Все",
    "Action",
    "RPG",
    "Шутеры",
    "Спорт",
    "Хоррор",
    "Adventure",
    "Сервис",
    "Музыка",
    "Подписка",
    "Open World",
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    initialFilter.category ?? "Все товары",
  );
  const [selectedPlatform, setSelectedPlatform] = useState(
    initialFilter.platform ?? "Все",
  );
  const [selectedGenre, setSelectedGenre] = useState(
    initialFilter.genre ?? "Все",
  );
  const [activeFilterChip, setActiveFilterChip] = useState("Все товары");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortOption, setSortOption] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Реагируем на внешние изменения фильтра только когда он реально изменился
  const prevFilterRef = useRef(initialFilter);
  useEffect(() => {
    const prev = prevFilterRef.current;
    if (
      prev.category !== initialFilter.category ||
      prev.platform !== initialFilter.platform ||
      prev.genre !== initialFilter.genre
    ) {
      setSelectedCategory(initialFilter.category ?? "Все товары");
      setSelectedPlatform(initialFilter.platform ?? "Все");
      setSelectedGenre(initialFilter.genre ?? "Все");
      prevFilterRef.current = initialFilter;
      setCurrentPage(1);
    }
  }, [initialFilter]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        platform: selectedPlatform,
        genre: selectedGenre,
      });
    }
  }, [selectedCategory, selectedPlatform, selectedGenre, onFilterChange]);

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let result = catalogGames.filter((game) => {
      if (
        selectedCategory !== "Все товары" &&
        game.category !== selectedCategory
      )
        return false;
      if (selectedPlatform !== "Все" && game.platform !== selectedPlatform)
        return false;
      if (selectedGenre !== "Все" && game.genre !== selectedGenre) return false;
      if (minPrice && game.price < Number(minPrice)) return false;
      if (maxPrice && game.price > Number(maxPrice)) return false;
      if (
        normalizedSearch &&
        !game.title.toLowerCase().includes(normalizedSearch)
      )
        return false;
      return true;
    });

    const seen = new Set();
    result = result.filter((game) => {
      if (seen.has(game.title)) return false;
      seen.add(game.title);
      return true;
    });

    if (sortOption === "price-asc")
      return [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortOption === "price-desc")
      return [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortOption === "discount")
      return [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));

    return result;
  }, [
    selectedCategory,
    selectedPlatform,
    selectedGenre,
    minPrice,
    maxPrice,
    sortOption,
    searchTerm,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / itemsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const currentPageGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChipClick = (chip) => {
    setActiveFilterChip(chip);
    if (chip === "Все товары") {
      setSelectedCategory("Все товары");
      setSortOption("popular");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
    } else if (chip === "По цене") {
      setSelectedCategory("Все товары");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
      setSortOption((prev) =>
        prev === "price-asc" ? "price-desc" : "price-asc",
      );
    } else if (chip === "Новинки") {
      setSelectedCategory("Новинки");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
      setSortOption("popular");
    } else if (chip === "Популярные") {
      setSelectedCategory("Все товары");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
      setSortOption("popular");
    } else if (chip === "Скидки") {
      setSelectedCategory("Все товары");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
      setSortOption("discount");
    } else {
      setSelectedCategory(chip);
      setSortOption("popular");
    }
    setCurrentPage(1);
  };

  const handleHeaderCategoryChange = (item) => {
    if (onHeaderCategoryChange) onHeaderCategoryChange(item);

    if (item.key === "all") {
      setSelectedCategory("Все товары");
      setSelectedPlatform("Все");
      setSelectedGenre("Все");
      setActiveFilterChip("Все товары");
      return;
    }
    if (item.category) {
      setSelectedCategory(item.category);
      setActiveFilterChip(
        item.category === "Новинки" ? "Новинки" : "Все товары",
      );
    }
    if (item.platform) {
      setSelectedPlatform(item.platform);
      setSelectedCategory("Все товары");
      setActiveFilterChip("Все товары");
    }
  };

  return (
    <div className="catalog-page-wrap">
      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onCategoryChange={handleHeaderCategoryChange}
        activeFilters={{
          category: selectedCategory,
          platform: selectedPlatform,
          genre: selectedGenre,
        }}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItemCount}
      />

      <div className="catalog-body">
        <aside className="catalog-sidebar">
          <div className="sidebar-block">
            <h4>Категории</h4>
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-block">
            <h4>Платформы</h4>
            <ul>
              {platforms.map((platform) => (
                <li
                  key={platform}
                  className={selectedPlatform === platform ? "active" : ""}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-block">
            <h4>Цена</h4>
            <div className="price-range-row">
              <input
                type="number"
                min={0}
                placeholder="от"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              />
              <span>—</span>
              <input
                type="number"
                min={0}
                placeholder="до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              />
            </div>
            <button className="price-button" onClick={() => {}}>
              Применить
            </button>
          </div>

          <div className="sidebar-block">
            <h4>Жанры</h4>
            <ul>
              {genres.map((genre) => (
                <li
                  key={genre}
                  className={selectedGenre === genre ? "active" : ""}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="catalog-main">
          <div className="catalog-controls">
            <div className="catalog-filters">
              {filters.map((name) => (
                <button
                  key={name}
                  className={`filter-chip ${activeFilterChip === name ? "active" : ""}`}
                  onClick={() => handleFilterChipClick(name)}
                  type="button"
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="catalog-sort">
              <span>Сортировать по:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="popular">Популярности</option>
                <option value="price-asc">Цене ↑</option>
                <option value="price-desc">Цене ↓</option>
                <option value="discount">Скидке</option>
              </select>
            </div>
          </div>

          <div className="catalog-grid">
            {currentPageGames.length > 0 ? (
              currentPageGames.map((game, idx) => (
                <CatalogCard
                  key={`${game.title}-${idx}`}
                  {...game}
                  onSelect={() =>
                    onProductSelect ? onProductSelect(game) : undefined
                  }
                  onAddToCart={() =>
                    onAddToCart
                      ? onAddToCart(
                          game,
                          game.purchaseOptions?.[0]?.label ||
                            game.options?.[0] ||
                            "Стандарт",
                        )
                      : undefined
                  }
                />
              ))
            ) : (
              <p>По выбранным фильтрам ничего не найдено.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="catalog-pagination">
              <button
                className="page-control"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="page-control"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
