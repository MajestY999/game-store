import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ChatPage.css";

export default function ChatPage({
  onNavigate,
  onCategoryChange,
  activeFilters,
  searchTerm,
  onSearchChange,
  cartItemCount,
}) {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Подарокмика",
      avatar: "🎁",
      lastMessage: "Спасибо за помощь!",
      lastMessageTime: "12:30",
      unread: 2,
      profile: {
        joinDate: "2025-06-15",
        purchases: 23,
        spent: 12450,
        reviews: 8,
        rating: 4.7,
        level: "Постоянный покупатель",
        favorite: "Action / RPG",
        status: "В сети",
      },
      messages: [
        {
          id: 1,
          sender: "Подарокмика",
          text: "Привет! Спасибо за рекомендацию",
          time: "10:15",
          isUser: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Пожалуйста! Надеюсь, тебе понравилась игра",
          time: "10:20",
          isUser: true,
        },
        {
          id: 3,
          sender: "Подарокмика",
          text: "Конечно! Сюжет просто супер",
          time: "12:30",
          isUser: false,
        },
      ],
    },
    {
      id: 2,
      name: "Кот волшебник",
      avatar: "🐱",
      lastMessage: "Давай поиграем вместе?",
      lastMessageTime: "11:45",
      unread: 0,
      profile: {
        joinDate: "2025-11-22",
        purchases: 7,
        spent: 3200,
        reviews: 2,
        rating: 4.3,
        level: "Новичок",
        favorite: "Шутеры",
        status: "В сети",
      },
      messages: [
        {
          id: 1,
          sender: "Кот волшебник",
          text: "Привет! Поиграешь со мной?",
          time: "11:40",
          isUser: false,
        },
        {
          id: 2,
          sender: "Кот волшебник",
          text: "Давай поиграем вместе?",
          time: "11:45",
          isUser: false,
        },
      ],
    },
    {
      id: 3,
      name: "Алексей Кейчаров",
      avatar: "👨",
      lastMessage: "Отправил ссылку на том...",
      lastMessageTime: "09:20",
      unread: 0,
      profile: {
        joinDate: "2025-03-08",
        purchases: 42,
        spent: 28950,
        reviews: 15,
        rating: 4.9,
        level: "VIP",
        favorite: "Adventure / Open World",
        status: "Был в сети 2 часа назад",
      },
      messages: [
        {
          id: 1,
          sender: "Алексей Кейчаров",
          text: "Эй! Нашел потрясающую игру",
          time: "09:10",
          isUser: false,
        },
        { id: 2, sender: "You", text: "Какую?", time: "09:15", isUser: true },
        {
          id: 3,
          sender: "Алексей Кейчаров",
          text: "Отправил ссылку на том...",
          time: "09:20",
          isUser: false,
        },
      ],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchChats, setSearchChats] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchChats.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: chat.messages.length + 1,
                sender: "You",
                text: messageText,
                time: new Date().toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isUser: true,
              },
            ],
            lastMessage: messageText,
            lastMessageTime: new Date().toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
        return chat;
      }),
    );

    setMessageText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page-wrap">
      <Header
        activePage="chat"
        onNavigate={onNavigate}
        onCategoryChange={onCategoryChange}
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cartItemCount={cartItemCount}
      />

      <div className="chat-page-inner">
        <div className="chat-container">
          <aside className="chat-sidebar">
            <div className="chat-header">
              <h3>Чаты</h3>
              <button className="btn-new-chat" title="Новый чат">
                ✎
              </button>
            </div>

            <div className="chat-search">
              <input
                type="text"
                placeholder="Поиск чатов..."
                value={searchChats}
                onChange={(e) => setSearchChats(e.target.value)}
                className="chat-search-input"
              />
            </div>

            <div className="chat-list">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-item ${selectedChatId === chat.id ? "active" : ""}`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <div className="chat-item-avatar">{chat.avatar}</div>
                  <div className="chat-item-content">
                    <h4 className="chat-item-name">{chat.name}</h4>
                    <p className="chat-item-message">{chat.lastMessage}</p>
                  </div>
                  <div className="chat-item-meta">
                    <span className="chat-item-time">
                      {chat.lastMessageTime}
                    </span>
                    {chat.unread > 0 && (
                      <span className="chat-unread">{chat.unread}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="chat-main">
            {selectedChat ? (
              <>
                <div className="chat-header-main">
                  <div className="chat-header-info">
                    <div className="chat-header-avatar">
                      {selectedChat.avatar}
                    </div>
                    <div className="chat-header-text">
                      <h2>{selectedChat.name}</h2>
                      <p className="chat-status">● В сети</p>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                    <button className="btn-chat-action" title="Звонок">
                      ☎
                    </button>
                    <button className="btn-chat-action" title="Видеозвонок">
                      📹
                    </button>
                    <button
                      className="btn-chat-action"
                      title="Информация"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                      ℹ
                    </button>
                  </div>
                </div>

                <div className="chat-messages">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.isUser ? "message-user" : "message-other"}`}
                    >
                      {!message.isUser && (
                        <div className="message-avatar">
                          {selectedChat.avatar}
                        </div>
                      )}
                      <div className="message-bubble">
                        {!message.isUser && (
                          <p className="message-sender">{message.sender}</p>
                        )}
                        <p className="message-text">{message.text}</p>
                        <span className="message-time">{message.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <textarea
                      className="chat-input"
                      placeholder="Напишите сообщение..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="3"
                    />
                    <button
                      className="btn-send"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      ➤ Отправить
                    </button>
                  </div>
                  <div className="chat-actions">
                    <button className="btn-attach" title="Прикрепить файл">
                      📎
                    </button>
                    <button className="btn-emoji" title="Эмодзи">
                      😊
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="chat-empty">
                <p>💬 Выберите чат для начала разговора</p>
              </div>
            )}
          </main>

          {selectedChat && showUserInfo && (
            <div
              className="user-info-backdrop"
              onClick={() => setShowUserInfo(false)}
            >
              <aside
                className="user-info-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="user-info-header">
                  <h3>Информация о пользователе</h3>
                  <button
                    className="btn-close-info"
                    onClick={() => setShowUserInfo(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="user-info-content">
                  <div className="user-info-avatar-section">
                    <div className="user-info-avatar">
                      {selectedChat.avatar}
                    </div>
                    <h4 className="user-info-name">{selectedChat.name}</h4>
                    <p className="user-info-status">
                      {selectedChat.profile.status}
                    </p>
                  </div>

                  <div className="user-level-badge">
                    {selectedChat.profile.level}
                  </div>

                  <div className="user-info-stats">
                    <div className="stat-box">
                      <span className="stat-icon">📅</span>
                      <div>
                        <p className="stat-label">На сайте с</p>
                        <p className="stat-value">
                          {selectedChat.profile.joinDate}
                        </p>
                      </div>
                    </div>

                    <div className="stat-box">
                      <span className="stat-icon">🛍️</span>
                      <div>
                        <p className="stat-label">Покупок</p>
                        <p className="stat-value">
                          {selectedChat.profile.purchases}
                        </p>
                      </div>
                    </div>

                    <div className="stat-box">
                      <span className="stat-icon">💰</span>
                      <div>
                        <p className="stat-label">Потрачено</p>
                        <p className="stat-value">
                          {selectedChat.profile.spent} ₽
                        </p>
                      </div>
                    </div>

                    <div className="stat-box">
                      <span className="stat-icon">⭐</span>
                      <div>
                        <p className="stat-label">Рейтинг</p>
                        <p className="stat-value">
                          {selectedChat.profile.rating}
                        </p>
                      </div>
                    </div>

                    <div className="stat-box">
                      <span className="stat-icon">✍️</span>
                      <div>
                        <p className="stat-label">Отзывы</p>
                        <p className="stat-value">
                          {selectedChat.profile.reviews}
                        </p>
                      </div>
                    </div>

                    <div className="stat-box">
                      <span className="stat-icon">🎮</span>
                      <div>
                        <p className="stat-label">Любимый жанр</p>
                        <p className="stat-value">
                          {selectedChat.profile.favorite}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="user-info-actions">
                    <button className="btn-info-action">👤 Профиль</button>
                    <button className="btn-info-action secondary">
                      🚫 Заблокировать
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
