import React from "react";
import "./HeroSection.css";

export default function HeroSection({ onShowMore }) {
  const xbox = require("../Images/Xbox game pass.png");
  const re = require("../Images/Resident Evil 9.png");

  const marathon = require("../Images/Marathon.png");

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-label">🔥 ХИТЫ ЭТОЙ НЕДЕЛИ</div>
        <h1>Игры и подписки по лучшим ценам</h1>
        <p>Пополнение Steam, PS Store, Xbox, подписки и игровые ключи</p>
        <button className="btn-hero" type="button" onClick={onShowMore}>
          Смотреть каталог
        </button>
        <a href="#" className="hero-actions">
          Акции
        </a>
      </div>
      <div className="hero-cards-container">
        <div className="hero-card-game">
          <img src={xbox} alt="Xbox Game Pass" />
          <div className="hero-game-name">Xbox Game Pass</div>
        </div>
        <div className="hero-card-game">
          <img src={re} alt="Resident Evil Requiem" />
          <div className="hero-game-name">Resident Evil Requiem</div>
        </div>

        <div className="hero-card-game">
          <img src={marathon} alt="Marathon" />
          <div className="hero-game-name">Marathon</div>
        </div>
      </div>
    </section>
  );
}
