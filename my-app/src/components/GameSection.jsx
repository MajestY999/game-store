import React from "react";
import GameCard from "./GameCard";
import "./GameSection.css";

export default function GameSection({
  title,
  games,
  showMore = true,
  onShowMore,
  onSelectProduct,
  onAddToCart,
}) {
  return (
    <section className="game-section">
      <div className="section-header">
        <h2>{title}</h2>
        {showMore && (
          <button className="show-more" type="button" onClick={onShowMore}>
            Все →
          </button>
        )}
      </div>
      <div className="games-grid">
        {games.map((game, index) => (
          <GameCard
            key={index}
            image={game.image}
            title={game.title}
            price={game.price}
            discount={game.discount}
            product={game}
            onSelect={(product) => onSelectProduct && onSelectProduct(product)}
            onAddToCart={(product) => onAddToCart && onAddToCart(product)}
          />
        ))}
      </div>
    </section>
  );
}
