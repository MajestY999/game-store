import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "./ProductPage.css";

export default function ProductPage({ product, onNavigate, onAddToCart }) {
  const [selectedOption, setSelectedOption] = useState("");

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

  const displayedPrice = selectedVariant?.price ?? price;

  return (
    <div className="product-page-wrap">
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
          <h1>{title}</h1>
          <div className="product-meta">
            <span>Категория: {category || "-"}</span>
            <span>Платформа: {platform || "-"}</span>
            <span>Жанр: {genre || "-"}</span>
          </div>
          <div className="product-rating">★★★★☆</div>
          <p className="product-description">
            {description ||
              "Описание товара для страницы продукта. Здесь указаны ключевые особенности, системные требования и преимущества покупки."}
          </p>

          <div className="product-details-grid">
            <div>
              <strong>Издатель:</strong>
              <p>Example Game Studios</p>
            </div>
            <div>
              <strong>Дата выхода:</strong>
              <p>1 января 2024</p>
            </div>
            <div>
              <strong>Язык:</strong>
              <p>Русский / Английский</p>
            </div>
            <div>
              <strong>Рейтинг:</strong>
              <p>12+</p>
            </div>
          </div>
        </div>

        <div className="product-purchase-card">
          <div className="product-price">
            {displayedPrice ? `${displayedPrice} ₽` : "Бесплатно"}
          </div>
          {priceLabel && (
            <div className="product-price-label">{priceLabel}</div>
          )}
          <button
            type="button"
            className="btn-buy"
            onClick={() => {
              onAddToCart && onAddToCart(product, selectedVariant?.label);
              onNavigate && onNavigate("cart");
            }}
          >
            Купить сейчас
          </button>
          <button
            type="button"
            className="btn-add-cart"
            onClick={() =>
              onAddToCart && onAddToCart(product, selectedVariant?.label)
            }
          >
            Добавить в корзину
          </button>

          <div className="product-option">
            <strong>Выберите вариант:</strong>
            {variantOptions.map((variant) => (
              <label key={variant.label}>
                <input
                  type="radio"
                  name="product-option"
                  value={variant.label}
                  checked={selectedOption === variant.label}
                  onChange={() => setSelectedOption(variant.label)}
                />
                {variant.label} — {variant.price} ₽
              </label>
            ))}
          </div>

          <p className="product-selected-option">
            Выбрано: {selectedOption || selectedVariant?.label || "-"}
          </p>

          <ul className="product-feature-list">
            <li>Мгновенная доставка ключа</li>
            <li>Гарантия 30 дней</li>
            <li>Поддержка 24/7</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
