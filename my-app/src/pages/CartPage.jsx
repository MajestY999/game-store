import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { popularGames, recommendedGames, bestfallGames } from "../data";
import "./CartPage.css";

export default function CartPage({
  cartItems,
  totalPrice,
  onNavigate,
  onCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  onRemoveItem,
  onChangeQuantity,
  onAddToCart,
  onCompleteCheckout,
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardError, setCardError] = useState("");

  const validateCard = () => {
    setCardError("");

    if (!cardNumber.trim()) {
      setCardError("Введите номер карты");
      return false;
    }

    const cardDigitsOnly = cardNumber.replace(/\D/g, "");

    if (cardDigitsOnly.length !== 12) {
      setCardError(
        `Номер карты должен содержать 12 цифр (введено: ${cardDigitsOnly.length})`,
      );
      return false;
    }

    if (!cardHolder.trim()) {
      setCardError("Введите имя владельца карты");
      return false;
    }

    if (!cardExpiry.trim()) {
      setCardError("Введите дату истечения (MM/YY)");
      return false;
    }

    if (!cardCVV.trim()) {
      setCardError("Введите CVV код");
      return false;
    }

    return true;
  };

  const handlePayment = () => {
    if (validateCard()) {
      setIsPaid(true);
      setTimeout(() => {
        // Вызываем функцию завершения покупки
        onCompleteCheckout && onCompleteCheckout();

        setShowCheckout(false);
        setIsPaid(false);
        setCardNumber("");
        setCardHolder("");
        setCardExpiry("");
        setCardCVV("");
      }, 2000);
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCVV("");
    setCardError("");
  };

  const allProducts = [...popularGames, ...recommendedGames, ...bestfallGames];
  const recommendedProducts = allProducts
    .filter((p) => !cartItems.some((item) => item.title === p.title))
    .slice(0, 5);

  return (
    <div className="cart-page-wrap">
      <Header
        activePage="cart"
        onNavigate={onNavigate}
        onCategoryChange={onCategoryChange}
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItems.length}
      />

      <div className="cart-page-content">
        <div className="cart-page-title">
          <h2>Корзина</h2>
          <p>{cartItems.length} товаров</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Корзина пуста</p>
            <button
              type="button"
              className="btn-back"
              onClick={() => onNavigate("catalog")}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-image"
                    />

                    <div className="cart-item-info">
                      <h3>{item.title}</h3>
                      <p className="cart-item-variant">{item.variant}</p>

                      <div className="cart-item-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            onChangeQuantity(item.id, item.qty - 1)
                          }
                        >
                          −
                        </button>

                        <span className="qty-value">{item.qty}</span>

                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            onChangeQuantity(item.id, item.qty + 1)
                          }
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <span className="price-total">
                        {item.price * item.qty} ₽
                      </span>
                      <span className="price-unit">
                        {item.price} ₽ x{item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <div className="cart-summary-box">
                <h3>Итого</h3>
                <div className="summary-row">
                  <span>Товаров ({cartItems.length})</span>
                  <span>{totalPrice} ₽</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total">
                  <span>Всего</span>
                  <span className="total-price">{totalPrice} ₽</span>
                </div>

                <button
                  type="button"
                  className="checkout-btn"
                  onClick={() => setShowCheckout(true)}
                >
                  Оформить заказ
                </button>

                <button
                  type="button"
                  className="continue-shopping-btn"
                  onClick={() => onNavigate("catalog")}
                >
                  Продолжить покупки
                </button>
              </div>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <section className="recommended-section">
            <h2>Рекомендуем в покупке</h2>
            <p>Другие популярные товары</p>

            <div className="recommended-grid">
              {recommendedProducts.map((product) => (
                <div key={product.title} className="recommended-card">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="recommended-image"
                  />
                  <div className="recommended-info">
                    <span className="recommended-label">{product.genre}</span>
                    <h3>{product.title}</h3>
                    <div className="recommended-bottom">
                      <span className="recommended-price">
                        {product.priceLabel || `${product.price} ₽`}
                      </span>
                      <button
                        type="button"
                        className="recommended-add-btn"
                        onClick={() => onAddToCart(product)}
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* МОДАЛКА ОПЛАТЫ */}
      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-box">
            {!isPaid ? (
              <>
                <div className="checkout-header">
                  <h3>Оплата заказа</h3>
                  <button
                    className="close-checkout-btn"
                    onClick={handleCloseCheckout}
                  >
                    ✕
                  </button>
                </div>

                <div className="checkout-amount">
                  <span>К оплате:</span>
                  <span className="amount-value">{totalPrice} ₽</span>
                </div>

                {cardError && (
                  <div className="card-error">
                    <span className="error-icon">⚠️</span>
                    <p>{cardError}</p>
                  </div>
                )}

                <div className="checkout-form">
                  <input
                    type="text"
                    placeholder="Номер карты (12 цифр)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={
                      cardError && !cardNumber.trim() ? "input-error" : ""
                    }
                    maxLength="16"
                  />

                  <input
                    type="text"
                    placeholder="Имя владельца"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className={
                      cardError && !cardHolder.trim() ? "input-error" : ""
                    }
                  />

                  <div className="row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength="5"
                      className={
                        cardError && !cardExpiry.trim() ? "input-error" : ""
                      }
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      maxLength="4"
                      className={
                        cardError && !cardCVV.trim() ? "input-error" : ""
                      }
                    />
                  </div>

                  <button className="pay-btn" onClick={handlePayment}>
                    Оплатить {totalPrice} ₽
                  </button>

                  <button className="cancel-btn" onClick={handleCloseCheckout}>
                    Отменить
                  </button>
                </div>
              </>
            ) : (
              <div className="success">
                <h3>✅ Оплата прошла успешно</h3>
                <p>Спасибо за покупку!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
