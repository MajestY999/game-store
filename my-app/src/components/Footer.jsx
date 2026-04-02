import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>О сервисе</h4>
          <ul>
            <li>
              <a href="#">О нас</a>
            </li>
            <li>
              <a href="#">Блог</a>
            </li>
            <li>
              <a href="#">Карьера</a>
            </li>
            <li>
              <a href="#">Статьи</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Помощь</h4>
          <ul>
            <li>
              <a href="#">Центр поддержки</a>
            </li>
            <li>
              <a href="#">Контакты</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Обратная связь</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Правовая информация</h4>
          <ul>
            <li>
              <a href="#">Соглашение</a>
            </li>
            <li>
              <a href="#">Приватность</a>
            </li>
            <li>
              <a href="#">Файлы cookie</a>
            </li>
            <li>
              <a href="#">Условия</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Соцсети</h4>
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
        <p>&copy; 2024 GameStore. Все права защищены.</p>
      </div>
    </footer>
  );
}
