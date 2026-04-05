import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ProfilePage.css";

export default function ProfilePage({
  onNavigate,
  onCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  cartItemCount,
  userProfile,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [profileData, setProfileData] = useState(
    userProfile || {
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
    },
  );

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const menuItems = [
    { id: "personal", icon: "👤", label: "Мои данные" },
    { id: "orders", icon: "📦", label: "Заказы" },
    { id: "reviews", icon: "⭐", label: "Мои отзывы" },
    { id: "achievements", icon: "🏆", label: "Достижения" },
    { id: "security", icon: "🔒", label: "Безопасность" },
    { id: "notifications", icon: "🔔", label: "Уведомления" },
  ];

  // Используем purchaseHistory из профиля или fallback на статические заказы
  const orders =
    userProfile?.purchaseHistory?.length > 0
      ? userProfile.purchaseHistory.map((purchase) => ({
          id: purchase.id,
          date: purchase.date,
          items: purchase.items.map(
            (item) => `${item.title} (${item.variant})`,
          ),
          total: purchase.totalAmount,
          status: "completed",
        }))
      : [
          {
            id: "ORD-001",
            date: "2026-04-20",
            items: ["The Last of Us Part I", "PS Plus (1 мес)"],
            total: 1448,
            status: "completed",
          },
          {
            id: "ORD-002",
            date: "2026-04-15",
            items: ["Cyberpunk", "Xbox Game Pass (3 мес)"],
            total: 2298,
            status: "completed",
          },
          {
            id: "ORD-003",
            date: "2026-04-10",
            items: ["Diablo 4", "Monster Hunter World"],
            total: 1998,
            status: "completed",
          },
          {
            id: "ORD-004",
            date: "2026-04-05",
            items: ["Valorant VP (1000)"],
            total: 599,
            status: "completed",
          },
          {
            id: "ORD-005",
            date: "2026-03-28",
            items: ["Elden Ring", "Spotify Premium (1 мес)"],
            total: 1368,
            status: "completed",
          },
        ];

  const achievements = [
    {
      id: 1,
      icon: "🛍️",
      label: "Первая покупка",
      unlocked: true,
      date: "2026-01-15",
    },
    {
      id: 2,
      icon: "⭐",
      label: "Первый отзыв",
      unlocked: true,
      date: "2026-02-10",
    },
    {
      id: 3,
      icon: "💰",
      label: "Большой расход",
      unlocked: true,
      date: "2026-03-20",
      desc: "Потратить 10000 руб",
    },
    {
      id: 4,
      icon: "🔥",
      label: "Почти интересует",
      unlocked: true,
      date: "2026-04-01",
      desc: "Посетить 20 товаров",
    },
    {
      id: 5,
      icon: "🏆",
      label: "Постоянный покупатель",
      unlocked: false,
      desc: "50 покупок",
      progress: "47/50",
    },
    {
      id: 6,
      icon: "👑",
      label: "VIP статус",
      unlocked: false,
      desc: "100000 руб потрачено",
      progress: "86800/100000",
    },
  ];

  const reviews = [
    {
      id: 1,
      product: "The Last of Us Part I",
      rating: 5,
      date: "2026-04-20",
      title: "Шедевр! Эмоциональная история",
      text: "Потрясающая графика, увлекательный сюжет. Стоит каждой копейки. Рекомендую всем!",
      helpful: 24,
    },
    {
      id: 2,
      product: "Cyberpunk",
      rating: 4,
      date: "2026-04-15",
      title: "Ночной город потрясающий",
      text: "Отличная игра с хорошим сюжетом. На релизе были баги, но теперь всё работает гладко.",
      helpful: 18,
    },
    {
      id: 3,
      product: "Diablo 4",
      rating: 5,
      date: "2026-04-10",
      title: "Diablo вернулся!",
      text: "Уничтожение демонов — просто кайф. Классика жанра в новом обличии. Играю non-stop!",
      helpful: 31,
    },
    {
      id: 4,
      product: "Elden Ring",
      rating: 5,
      date: "2026-03-28",
      title: "Мастерская Souls-like игра",
      text: "Трудно, но стоит того. Мир восхищает своей красотой и глубиной. Лучшая RPG последних лет!",
      helpful: 42,
    },
    {
      id: 5,
      product: "Monster Hunter World",
      rating: 4,
      date: "2026-03-20",
      title: "Охота на монстров — адреналин!",
      text: "Сложно, но очень интересно. Кооп с друзьями доставляет максимум удовольствия.",
      helpful: 15,
    },
  ];

  return (
    <div className="profile-page-wrap">
      <Header
        activePage="profile"
        onNavigate={onNavigate}
        onCategoryChange={onCategoryChange}
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItemCount}
      />

      <div className="profile-page-inner">
        <div className="profile-container">
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {profileData.name.charAt(0)}
                  {profileData.lastName.charAt(0)}
                </div>
              </div>

              <h2 className="profile-name">
                {profileData.name} {profileData.lastName}
              </h2>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{profileData.purchases}</span>
                  <span className="stat-label">Покупок</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profileData.reviews}</span>
                  <span className="stat-label">Отзывов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profileData.spent} ₽</span>
                  <span className="stat-label">Потрачено</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profileData.points}</span>
                  <span className="stat-label">Баллов</span>
                </div>
              </div>

              <button
                className="btn-edit-profile"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "✕ Отменить" : "✎ Мои данные"}
              </button>
            </div>

            <nav className="profile-menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              className="btn-logout"
              onClick={() => {
                onLogout && onLogout();
                onNavigate && onNavigate("home");
              }}
            >
              🚪 Выход из аккаунта
            </button>
          </aside>

          <main className="profile-content">
            {activeTab === "personal" && (
              <section className="content-section">
                <h3>Личные данные</h3>

                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Имя</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Фамилия</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Telegram</label>
                      <input
                        type="text"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={handleSaveProfile}>
                        ✓ Сохранить
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profileData);
                        }}
                      >
                        ✕ Отменить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="personal-info">
                    <div className="info-row">
                      <span className="info-label">Имя:</span>
                      <span className="info-value">{profileData.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Фамилия:</span>
                      <span className="info-value">{profileData.lastName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{profileData.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Телефон:</span>
                      <span className="info-value">{profileData.phone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Telegram:</span>
                      <span className="info-value">{profileData.telegram}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Дата присоединения:</span>
                      <span className="info-value">{profileData.joinDate}</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeTab === "orders" && (
              <section className="content-section">
                <h3>Мои заказы</h3>
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>{order.id}</h4>
                          <p className="order-date">{order.date}</p>
                        </div>
                        <span className={`order-status ${order.status}`}>
                          ✓ Завершен
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="order-item">
                            • {item}
                          </p>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span className="order-total">{order.total} ₽</span>
                        <button
                          className="btn-order-detail"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="content-section">
                <h3>Мои отзывы</h3>
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-meta">
                          <h4 className="review-product">{review.product}</h4>
                          <p className="review-date">{review.date}</p>
                        </div>
                        <div className="review-rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                      <h5 className="review-title">{review.title}</h5>
                      <p className="review-text">{review.text}</p>
                      <div className="review-footer">
                        <span className="review-helpful">
                          👍 Полезно ({review.helpful})
                        </span>
                        <button className="btn-edit-review">
                          Редактировать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "achievements" && (
              <section className="content-section">
                <h3>Достижения</h3>
                <div className="achievements-grid">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`achievement ${achievement.unlocked ? "" : "locked"}`}
                    >
                      <div className="achievement-icon">{achievement.icon}</div>
                      <h4>{achievement.label}</h4>
                      {achievement.unlocked ? (
                        <p className="achievement-date">✓ {achievement.date}</p>
                      ) : (
                        <div className="achievement-progress">
                          <p>{achievement.desc}</p>
                          {achievement.progress && (
                            <div className="progress-bar">
                              <div className="progress-fill"></div>
                              <span>{achievement.progress}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="content-section">
                <h3>Безопасность</h3>
                <div className="security-options">
                  <div className="security-item">
                    <div className="security-info">
                      <h4>🔐 Пароль</h4>
                      <p>Последнее изменение: 3 месяца назад</p>
                    </div>
                    <button className="btn-change">Изменить</button>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <h4>📱 Двухфакторная аутентификация</h4>
                      <p>Не активирована</p>
                    </div>
                    <button className="btn-enable">Включить</button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="content-section">
                <h3>Уведомления</h3>
                <div className="notifications-settings">
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked />
                    <span>Email уведомления о новых товарах</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked />
                    <span>Уведомления о скидках и акциях</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" />
                    <span>Рассылка новостей</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked />
                    <span>Уведомления о заказах</span>
                  </label>
                </div>
              </section>
            )}
          </main>

          {selectedOrder && (
            <div className="order-modal">
              <div className="order-modal-content">
                <div className="modal-header">
                  <h3>Детали заказа {selectedOrder.id}</h3>
                  <button
                    className="btn-close-modal"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <div className="order-detail-row">
                    <span className="detail-label">Номер заказа:</span>
                    <span className="detail-value">{selectedOrder.id}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="detail-label">Дата заказа:</span>
                    <span className="detail-value">{selectedOrder.date}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="detail-label">Статус:</span>
                    <span className="detail-value">✓ Завершен</span>
                  </div>

                  <div className="modal-divider"></div>

                  <div className="order-items-detail">
                    <h4>Товары в заказе:</h4>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="item-detail">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="modal-divider"></div>

                  <div className="order-detail-row total">
                    <span className="detail-label">Итого:</span>
                    <span className="detail-value">
                      {selectedOrder.total} ₽
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-download"
                    onClick={() => alert("Скачивание счёта...")}
                  >
                    ⬇ Скачать счёт
                  </button>
                  <button
                    className="btn-modal-close"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
