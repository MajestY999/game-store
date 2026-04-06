import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
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
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      return saved
        ? JSON.parse(saved)
        : {
            name: "Алексей",
            lastName: "Иванов",
            email: "alex.ivanov@gmail.com",
            phone: "+7 (999) 123-45-67",
            telegram: "@alexivanov",
            purchases: 47,
            reviews: 12,
            spent: 86800,
            points: 0,
            joinDate: "2026-01-15",
            purchaseHistory: [],
          };
    } catch {
      return {
        name: "Алексей",
        lastName: "Иванов",
        email: "alex.ivanov@gmail.com",
        phone: "+7 (999) 123-45-67",
        telegram: "@alexivanov",
        purchases: 47,
        reviews: 12,
        spent: 86800,
        points: 0,
        joinDate: "2026-01-15",
        purchaseHistory: [],
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  }, [userProfile]);

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

      let price;
      if (normalizedVariant.includes("₽")) {
        const amount = parseInt(normalizedVariant.replace(/\D/g, ""));
        price = amount || product.price || 0;
      } else {
        price =
          product.purchaseOptions?.find((p) => p.label === normalizedVariant)
            ?.price ||
          product.price ||
          0;
      }

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

  const completeCheckout = () => {
    if (cartItems.length === 0) return;

    const totalSpent = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    const newPurchase = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString("ru-RU"),
      items: cartItems,
      totalAmount: totalSpent,
      status: "Завершён",
    };

    setUserProfile((prev) => ({
      ...prev,
      purchases: prev.purchases + 1,
      spent: prev.spent + totalSpent,
      purchaseHistory: [newPurchase, ...(prev.purchaseHistory || [])],
    }));

    setCartItems([]);
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
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setActivePage("product");
          }}
          onCategoryChange={handleHeaderCategoryChange}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItemCount={cartItems.length}
          onAddToCart={(product, variant) => addToCart(product, variant, 1)}
        />
      ) : activePage === "cart" ? (
        <CartPage
          cartItems={cartItems}
          totalPrice={totalCartPrice}
          onNavigate={handleNavigate}
          onCategoryChange={handleHeaderCategoryChange}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRemoveItem={removeFromCart}
          onChangeQuantity={changeCartQuantity}
          onAddToCart={(product, variant) => addToCart(product, variant, 1)}
          onCompleteCheckout={completeCheckout}
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
      ) : activePage === "profile" ? (
        <ProfilePage
          onNavigate={handleNavigate}
          onCategoryChange={handleHeaderCategoryChange}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItemCount={cartItems.length}
          userProfile={userProfile}
          onLogout={() => {
            setUserProfile(null);
            setActivePage("home");
          }}
        />
      ) : activePage === "chat" ? (
        <ChatPage
          onNavigate={handleNavigate}
          onCategoryChange={handleHeaderCategoryChange}
          activeFilters={filterState}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
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
