import React from "react";
import "./GameCard.css";

export default function GameCard({
  image,
  title,
  price,
  priceLabel,
  discount,
  onSelect,
  onAddToCart,
  product,
}) {
  return (
    <div
      className="game-card"
      style={{ cursor: onSelect ? "pointer" : "default" }}
      onClick={() => onSelect && onSelect(product)}
    >
      <div className="game-card-image">
        <img src={typeof image === "string" ? image : image} alt={title} />
        {discount && <div className="discount-badge">{discount}%</div>}
        <div className="card-overlay">
          <button
            className="btn-card"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(product);
            }}
          >
            В корзину
          </button>
        </div>
      </div>
      <div className="game-card-info">
        <h3>{title}</h3>
        {priceLabel ? (
          <p className="price">{priceLabel}</p>
        ) : price !== undefined ? (
          <p className="price">{price > 0 ? `от ${price} ₽` : "Бесплатно"}</p>
        ) : null}
      </div>
    </div>
  );
}
