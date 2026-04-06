import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GameSection from "../components/GameSection";
import Footer from "../components/Footer";
import { popularGames, recommendedGames, bestfallGames } from "../data";

export default function HomePage({
  activePage,
  onNavigate,
  onHeaderCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  cartItemCount,
  onProductSelect,
  onAddToCart,
}) {
  const handleShowMore = () => {
    onHeaderCategoryChange({
      key: "all",
      category: "Все товары",
      platform: "Все",
      genre: "Все",
    });
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onCategoryChange={onHeaderCategoryChange}
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItemCount}
      />
      <HeroSection onShowMore={handleShowMore} />
      <GameSection
        title="Популярное"
        games={popularGames}
        onShowMore={handleShowMore}
        onSelectProduct={(product) => {
          if (onProductSelect) onProductSelect(product);
        }}
        onAddToCart={(product) => onAddToCart && onAddToCart(product)}
      />
      <GameSection
        title="Предложения"
        games={recommendedGames}
        onShowMore={handleShowMore}
        onSelectProduct={(product) => {
          if (onProductSelect) onProductSelect(product);
        }}
        onAddToCart={(product) => onAddToCart && onAddToCart(product)}
      />
      <GameSection
        title="Хиты продаж"
        games={bestfallGames}
        showMore={false}
        onSelectProduct={(product) => {
          if (onProductSelect) onProductSelect(product);
        }}
        onAddToCart={(product) => onAddToCart && onAddToCart(product)}
      />
      <Footer />
    </div>
  );
}
