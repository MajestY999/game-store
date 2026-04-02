import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CartPage.css";

export default function CartPage({
  cartItems,
  totalPrice,
  onNavigate,
  onRemoveItem,
  onChangeQuantity,
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="cart-page-wrap">
      <Header
        activePage="cart"
        onNavigate={onNavigate}
        cartItemCount={cartItems.length}
      />

      <div className="cart-content">
        <h2>Корзина</h2>

        {cartItems.length === 0 ? (
          <p>Корзина пуста.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} />

                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <p>{item.variant}</p>

                    <div className="cart-item-controls">
                      <button
                        type="button"
                        onClick={() =>
                          onChangeQuantity(item.id, item.qty - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button
                        type="button"
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
                    {item.price * item.qty} ₽
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Итого: {totalPrice} ₽</h3>

              <button
                type="button"
                className="checkout-btn"
                onClick={() => setShowCheckout(true)}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>

      {/* МОДАЛКА ОПЛАТЫ */}
      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-box">
            {!isPaid ? (
              <>
                <h3>Оплата</h3>

                <input placeholder="Номер карты" />
                <input placeholder="Имя владельца" />

                <div className="row">
                  <input placeholder="MM/YY" />
                  <input placeholder="CVV" />
                </div>

                <button
                  className="pay-btn"
                  onClick={() => {
                    setIsPaid(true);

                    setTimeout(() => {
                      setShowCheckout(false);
                      setIsPaid(false);
                    }, 2000);
                  }}
                >
                  Оплатить {totalPrice} ₽
                </button>
              </>
            ) : (
              <div className="success">
                <h3>✅ Оплата прошла</h3>
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