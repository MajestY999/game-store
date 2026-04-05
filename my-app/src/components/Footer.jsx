import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">Smoletik-Shop</span>
          <p>
            Игровая платформа для покупки ключей и подписок. Быстрая доставка,
            надежная поддержка и удобные способы оплаты.
          </p>
        </div>

        <div className="footer-section">
          <h4>Магазин</h4>
          <ul>
            <li>
              <a href="#">Каталог</a>
            </li>
            <li>
              <a href="#">Новинки</a>
            </li>
            <li>
              <a href="#">Скидки</a>
            </li>
            <li>
              <a href="#">Подарочные карты</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Поддержка</h4>
          <ul>
            <li>
              <a href="#">Контакты</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Возврат</a>
            </li>
            <li>
              <a href="#">Статус заказа</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Мы в сети</h4>
          <div className="social-links">
            <a href="#" className="social-link">
              VK
            </a>
            <a href="#" className="social-link">
              Telegram
            </a>
            <a href="#" className="social-link">
              Discord
            </a>
            <a href="#" className="social-link">
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 Smoletik-Shop. Все права защищены. Политика
          конфиденциальности.
        </p>
      </div>
    </footer>
  );
}
