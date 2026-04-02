import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [filterState, setFilterState] = useState({
    category: "Все товары",
    platform: "Все",
    genre: "Все",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const handleHeaderCategoryChange = (item) => {
    setSelectedProduct(null);
    setActivePage("catalog");
    setFilterState({
      category: item.category ?? "Все товары",
      platform: item.platform ?? "Все",
      genre: item.genre ?? "Все",
    });
  };

  const handleCatalogFilterChange = (newFilter) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  };

  const addToCart = (product, variantLabel, quantity = 1) => {
    setCartItems((prevCart) => {
      const normalizedVariant =
        variantLabel || product.purchaseOptions?.[0]?.label || "Стандарт";
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.title === product.title && item.variant === normalizedVariant,
      );

      if (existingIndex !== -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const price =
        product.purchaseOptions?.find((p) => p.label === normalizedVariant)
          ?.price ||
        product.price ||
        0;

      return [
        ...prevCart,
        {
          title: product.title,
          variant: normalizedVariant,
          qty: quantity,
          price,
          image: product.image,
          id: `${product.title}-${normalizedVariant}`,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const changeCartQuantity = (id, qty) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item,
      ),
    );
  };

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const handleNavigate = (page) => {
    if (page !== "product") setSelectedProduct(null);
    setActivePage(page);
  };

  return (
    <div className="App">
      {activePage === "product" && selectedProduct ? (
        <ProductPage
          product={selectedProduct}
          onNavigate={(page) => {
            if (page === "home" || page === "catalog") {
              setSelectedProduct(null);
            }
            setActivePage(page);
          }}
          onAddToCart={(product, variant) => addToCart(product, variant, 1)}
        />
      ) : activePage === "cart" ? (
        <CartPage
          cartItems={cartItems}
          totalPrice={totalCartPrice}
          onNavigate={handleNavigate}
          onRemoveItem={removeFromCart}
          onChangeQuantity={changeCartQuantity}
        />
      ) : activePage === "catalog" ? (
        <CatalogPage
          activePage={activePage}
          onNavigate={handleNavigate}
          onHeaderCategoryChange={handleHeaderCategoryChange}
          onFilterChange={handleCatalogFilterChange}
          initialFilter={filterState}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setActivePage("product");
          }}
          onAddToCart={(product, variant) => addToCart(product, variant, 1)}
          cartItemCount={cartItems.length}
        />
      ) : (
        <HomePage
          activePage={activePage}
          onNavigate={handleNavigate}
          onHeaderCategoryChange={handleHeaderCategoryChange}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItemCount={cartItems.length}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setActivePage("product");
          }}
          onAddToCart={(product, variant) => addToCart(product, variant, 1)}
        />
      )}
    </div>
  );
}

export default App;