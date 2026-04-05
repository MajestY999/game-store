import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { popularGames, recommendedGames, bestfallGames } from "../data";
import "./ProductPage.css";

export default function ProductPage({
  product,
  onNavigate,
  onProductSelect,
  onCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  cartItemCount,
  onAddToCart,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [customSteamAmount, setCustomSteamAmount] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!product) return;

    const initialVariantOptions =
      product.purchaseOptions ||
      (product.options
        ? product.options.map((opt) => ({
            label: opt,
            price: product.price ?? 0,
          }))
        : product.category === "Подписки"
          ? [
              { label: "1 мес", price: product.price ?? 0 },
              { label: "3 мес", price: Math.round((product.price ?? 0) * 2.7) },
              { label: "12 мес", price: Math.round((product.price ?? 0) * 10) },
            ]
          : product.category === "Игры"
            ? [
                { label: "Standard Edition", price: product.price ?? 0 },
                {
                  label: "Deluxe Edition",
                  price: Math.round((product.price ?? 0) * 1.2),
                },
                {
                  label: "Digital Deluxe",
                  price: Math.round((product.price ?? 0) * 1.4),
                },
              ]
            : [{ label: "Стандарт", price: product.price ?? 0 }]);

    setSelectedOption(initialVariantOptions[0]?.label || "");
  }, [product]);

  if (!product) {
    return (
      <div className="product-page-wrap">
        <button
          type="button"
          className="back-btn"
          onClick={() => onNavigate && onNavigate("catalog")}
        >
          ← Назад в каталог
        </button>
        <p>Товар не найден.</p>
      </div>
    );
  }

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const {
    title,
    image,
    price,
    priceLabel,
    discount,
    platform,
    genre,
    category,
    description,
    purchaseOptions,
    options,
  } = product;

  const variantOptions =
    purchaseOptions ||
    (options
      ? options.map((opt) => ({ label: opt, price: price ?? 0 }))
      : category === "Подписки"
        ? [
            { label: "1 мес", price: price ?? 0 },
            { label: "3 мес", price: Math.round((price ?? 0) * 2.7) },
            { label: "12 мес", price: Math.round((price ?? 0) * 10) },
          ]
        : category === "Игры"
          ? [
              { label: "Standard Edition", price: price ?? 0 },
              {
                label: "Deluxe Edition",
                price: Math.round((price ?? 0) * 1.2),
              },
              {
                label: "Digital Deluxe",
                price: Math.round((price ?? 0) * 1.4),
              },
            ]
          : [{ label: "Стандарт", price: price ?? 0 }]);

  const selectedVariant =
    variantOptions.find((v) => v.label === selectedOption) || variantOptions[0];

  const allProducts = [...popularGames, ...recommendedGames, ...bestfallGames];
  const relatedGames = allProducts
    .filter((item) => item.title !== title)
    .slice(0, 4);

  const ratingValue = product.ratingValue ?? 4.8;
  const ratingCount = product.ratingCount ?? 1240;

  console.log(
    "onProductSelect функция:",
    typeof onProductSelect,
    onProductSelect,
  );

  const reviews = product.reviews || [
    {
      name: "Алексей К.",
      date: "2026-03-15",
      rating: 5,
      text: "Отличная игра! Купил для сына, он в восторге. Доставка быстрая, ключ пришел мгновенно.",
    },
    {
      name: "Мария С.",
      date: "2026-03-10",
      rating: 4,
      text: "Хорошая покупка. Игра работает без проблем. Единственное, хотелось бы больше скидок.",
    },
    {
      name: "Дмитрий В.",
      date: "2026-03-05",
      rating: 5,
      text: "Рекомендую! Сервис на уровне, все четко и быстро. Буду покупать еще.",
    },
  ];

  return (
    <div className="product-page-wrap">
      <Header
        activePage="product"
        onNavigate={onNavigate}
        onCategoryChange={onCategoryChange}
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItemCount}
      />

      <div className="product-page-inner">
        <div className="product-page-top">
          <button
            type="button"
            className="back-btn"
            onClick={() => onNavigate && onNavigate("catalog")}
          >
            ← Назад в каталог
          </button>
        </div>

        <div className="product-page-content">
          <div className="product-image-card">
            <img src={image} alt={title} className="product-main-image" />
            {discount && (
              <div className="product-discount-badge">-{discount}%</div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header-row">
              <div>
                <h1>{title}</h1>
                <div className="product-meta">
                  <span>{category || "-"}</span>
                  <span>{platform || "-"}</span>
                  <span>{genre || "-"}</span>
                </div>
              </div>
              <div className="product-flag">
                <span>{product.rating || "12+"}</span>
              </div>
            </div>

            <div className="product-badges">
              {discount ? (
                <span className="badge discount">-{discount}%</span>
              ) : null}
              {product.isNew && <span className="badge new">Новинка</span>}
              <span className="badge platform">{platform || "Платформа"}</span>
            </div>

            <div className="product-rating-summary">
              <div className="rating-score">{ratingValue.toFixed(1)}</div>
              <div className="rating-details">
                <div className="rating-stars">★★★★☆</div>
                <div className="rating-count">{ratingCount} отзывов</div>
              </div>
            </div>

            <p className="product-description">
              {description ||
                "Насыщенное описание продукта с основными преимуществами, характеристиками и советами по покупке."}
            </p>

            <div className="product-details-grid product-details-grid-large">
              <div>
                <strong>Издатель</strong>
                <p>{product.publisher || "Example Game Studios"}</p>
              </div>
              <div>
                <strong>Дата выхода</strong>
                <p>{product.releaseDate || "1 января 2026"}</p>
              </div>
              <div>
                <strong>Язык</strong>
                <p>{product.language || "Русский / Английский"}</p>
              </div>
              <div>
                <strong>Жанр</strong>
                <p>{genre || "Action"}</p>
              </div>
              <div>
                <strong>Платформа</strong>
                <p>{platform || "PC"}</p>
              </div>
              <div>
                <strong>Возраст</strong>
                <p>{product.rating || "12+"}</p>
              </div>
            </div>

            <div className="product-reviews">
              <h3>Отзывы покупателей</h3>
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div>
                      <span className="review-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="product-purchase-card">
            <div className="product-price">
              {selectedVariant?.price
                ? `${selectedVariant.price} ₽`
                : "Бесплатно"}
            </div>
            {priceLabel && (
              <div className="product-price-label">{priceLabel}</div>
            )}

            <div className="purchase-actions">
              <button
                type="button"
                className="btn-buy"
                onClick={() => {
                  if (title === "Пополнение Steam" && !customSteamAmount) {
                    showErrorAlert("Пожалуйста, введите сумму пополнения");
                    return;
                  }
                  const variantToUse =
                    title === "Пополнение Steam"
                      ? `${customSteamAmount} ₽`
                      : selectedVariant?.label;
                  onAddToCart && onAddToCart(product, variantToUse);
                  onNavigate && onNavigate("cart");
                }}
              >
                Купить сейчас
              </button>
              <button
                type="button"
                className="btn-add-cart"
                onClick={() => {
                  if (title === "Пополнение Steam" && !customSteamAmount) {
                    showErrorAlert("Пожалуйста, введите сумму пополнения");
                    return;
                  }
                  const variantToUse =
                    title === "Пополнение Steam"
                      ? `${customSteamAmount} ₽`
                      : selectedVariant?.label;
                  onAddToCart && onAddToCart(product, variantToUse);
                }}
              >
                Добавить в корзину
              </button>
            </div>

            <div className="product-option">
              <strong>Вариант</strong>
              {title === "Пополнение Steam" ? (
                <div className="steam-custom-amount">
                  <div className="steam-amount-input-group">
                    <input
                      type="number"
                      min="50"
                      max="20000"
                      placeholder="Введите сумму (150-20000 ₽)"
                      value={customSteamAmount}
                      onChange={(e) => setCustomSteamAmount(e.target.value)}
                      className="steam-input"
                    />
                    <span className="steam-input-suffix">₽</span>
                  </div>
                  {customSteamAmount && (
                    <div className="steam-amount-preview">
                      Сумма: {customSteamAmount} ₽
                    </div>
                  )}
                  <p className="steam-info-text">
                    По умолчанию: {variantOptions[0]?.label}
                  </p>
                </div>
              ) : (
                variantOptions.map((variant) => (
                  <label key={variant.label}>
                    <input
                      type="radio"
                      name="product-option"
                      value={variant.label}
                      checked={selectedOption === variant.label}
                      onChange={() => setSelectedOption(variant.label)}
                    />
                    <span>{variant.label}</span>
                    <span className="option-price">{variant.price} ₽</span>
                  </label>
                ))
              )}
            </div>

            <p className="product-selected-option">
              Выбрано: {selectedOption || selectedVariant?.label || "-"}
            </p>

            <ul className="product-feature-list">
              <li>Мгновенная доставка ключа</li>
              <li>Гарантия 30 дней</li>
              <li>Поддержка 24/7</li>
              <li>Безопасная оплата</li>
            </ul>
          </div>
        </div>

        <section className="product-similar-section">
          <div className="similar-header">
            <div>
              <h2>Похожие игры</h2>
              <p>Другие предложения, которые могут понравиться</p>
            </div>
          </div>

          <div className="similar-games-grid">
            {relatedGames.map((game, index) => (
              <div
                key={`${game.title}-${index}`}
                className="similar-game-card-wrapper"
                onClick={() => {
                  console.log("Clicked game:", game.title);
                  onProductSelect(game);
                }}
              >
                <div className="similar-game-card">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="similar-game-image"
                  />
                  <div className="similar-game-info">
                    <span>{game.genre || game.platform}</span>
                    <h3>{game.title}</h3>
                    <div className="similar-game-bottom">
                      <span className="similar-game-price">
                        {game.priceLabel || `${game.price} ₽`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="similar-game-add-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart && onAddToCart(game);
                  }}
                >
                  В корзину
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showAlert && (
        <div className="alert-notification">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <p className="alert-text">{alertMessage}</p>
            <button className="alert-close" onClick={() => setShowAlert(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
