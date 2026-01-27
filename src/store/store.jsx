// Central app store: держит games, cart, user, users, library.
// Компонент StoreProvider оборачивает приложение и предоставляет API через useStore().
import React, { createContext, useContext, useEffect, useState } from "react";
import initialGames from "../data/data";

const StorageKey = "steam3-state";
const StoreContext = createContext();

// Утилита — безопасное сравнение id/slug как строк
const matchId = (a, b) => a !== undefined && b !== undefined && String(a) === String(b);

// Попытка привести строку изображения к корректному URL.
// Поддерживает:
// - внешние URL (http/https/data)
// - абсолютные пути (начинаются с '/')
// - относительные имена файлов (например "cs 2.jpg") => оставляет как есть (компоненты рассчитывают путь)
const resolveImage = (img) => {
  if (!img) return null;
  if (typeof img !== "string") return img;
  const trimmed = img.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  // fallback — вернуть строку как есть (в нашем проекте имя файла совпадает с файлом в /src/images)
  return trimmed;
};

// Нормализуем массив игр: приводим fields images и image к пригодным для <img src=...> значениям
const normalizeGamesArray = (arr) =>
  (arr || []).map((g) => {
    const imgs = (g.images || []).map((it) => resolveImage(it)).filter(Boolean);
    // если есть отдельный g.image — используем его, иначе первый из images
    const image = g.image ? resolveImage(g.image) : imgs[0] || null;
    return { ...g, images: imgs, image };
  });

export function StoreProvider({ children }) {
  // Загружаем сохранённое состояние из localStorage, если есть
  const loadSaved = (key, fallback) => {
    try {
      const raw = localStorage.getItem(StorageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && parsed[key] !== undefined ? parsed[key] : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Состояния стора
  const [games, setGames] = useState(() => normalizeGamesArray(loadSaved("games", initialGames)));
  const [cart, setCart] = useState(() => loadSaved("cart", []));
  const [user, setUser] = useState(() => loadSaved("user", null));
  const [users, setUsers] = useState(() => loadSaved("users", []));
  const [library, setLibrary] = useState(() => loadSaved("library", []));

  // Сохраняем snapshot в localStorage при изменениях
  const persistAll = (next) => {
    try {
      const payload = {
        games: next.games ?? games,
        cart: next.cart ?? cart,
        user: next.user ?? user,
        users: next.users ?? users,
        library: next.library ?? library,
      };
      localStorage.setItem(StorageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn("store save failed", e);
    }
  };

  useEffect(() => {
    persistAll({});
    
  }, [games, cart, user, users, library]);

  const realIdFor = (gOrId) => {
    if (!gOrId) return null;
    if (typeof gOrId === "string" || typeof gOrId === "number") return String(gOrId);
    return String(gOrId.id ?? gOrId.slug ?? gOrId);
  };

  // --- API стора: функции ниже вызывают компоненты ---

  // toggleFlag переключает boolean-флаг (например wishlist, played)
  // Меняет флаг в games и в записи library для текущего пользователя (если есть)
  function toggleFlag(gameId, flag) {
    const id = String(gameId);
    const nextGames = games.map((g) =>
      matchId(g.id, id) || matchId(g.slug, id) ? { ...g, [flag]: !g[flag] } : g
    );

    const nextLibrary = library.map((entry) => {
      const matches = matchId(entry.id, id) || matchId(entry.gameId, id);
      if (matches && String(entry.userId) === String(user?.id)) {
        return { ...entry, [flag]: !entry[flag] };
      }
      return entry;
    });

    setGames(nextGames);
    setLibrary(nextLibrary);
    persistAll({ games: nextGames, library: nextLibrary });

    return { ok: true, games: nextGames, library: nextLibrary };
  }

  // addToCart — добавляет id игры в корзину (уникальные id)
  function addToCart(gameId) {
    if (!user) return { ok: false, message: "Не авторизован" };
    const game = games.find((g) => matchId(g.id, gameId) || matchId(g.slug, gameId));
    if (!game) return { ok: false, message: "Игра не найдена" };
    const idToStore = realIdFor(game);
    let added = false;
    setCart((prev) => {
      if (prev.find((id) => matchId(id, idToStore))) return prev;
      added = true;
      const next = [...prev, idToStore];
      persistAll({ cart: next });
      return next;
    });
    return added ? { ok: true, cart: [...cart, idToStore] } : { ok: false, message: "Уже в корзине" };
  }

  function removeFromCart(gameId) {
    setCart((prev) => {
      const next = prev.filter((id) => !matchId(id, gameId));
      persistAll({ cart: next });
      return next;
    });
    return { ok: true };
  }

  function clearCart() {
    setCart([]);
    persistAll({ cart: [] });
    return { ok: true };
  }

  // Регистрация — создаёт нового пользователя в локальном users и логинит его
  function register(data) {
    const email = (data.email || "").trim().toLowerCase();
    if (!email || !data.password) return { ok: false, message: "Email и пароль обязательны" };
    if (users.find((u) => u.email === email)) return { ok: false, message: "Пользователь с таким email уже существует" };
    const newUser = {
      id: `u_${Date.now()}`,
      name: data.name || data.email.split("@")[0],
      email,
      password: data.password,
      createdAt: Date.now(),
    };
    const nextUsers = [...users, newUser];
    const publicUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUsers(nextUsers);
    setUser(publicUser);
    persistAll({ users: nextUsers, user: publicUser });
    return { ok: true, user: publicUser };
  }

  // login — ищет по email+password в users и выставляет user (публичную часть)
  function login(credentials) {
    const email = (credentials.email || "").trim().toLowerCase();
    const password = credentials.password || "";
    if (!email || !password) return { ok: false, message: "Email и пароль обязательны" };
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, message: "Неверный email или пароль" };
    const publicUser = { id: found.id, name: found.name, email: found.email };
    setUser(publicUser);
    persistAll({ user: publicUser });
    return { ok: true, user: publicUser };
  }

  function logout() {
    setUser(null);
    setCart([]);
    persistAll({ user: null, cart: [] });
    return { ok: true };
  }

  // checkout — переводит id из cart в записи library (у текущего user).
  // В library храним объекты { id, gameId, userId, purchasedAt, hours, image, title, price }
  function checkout() {
    if (!user) return { ok: false, message: "Не авторизован" };
    if (!cart || cart.length === 0) return { ok: false, message: "Корзина пуста" };
    const now = Date.now();
    const newEntries = cart.map((id) => {
      const g = games.find((x) => matchId(x.id, id) || matchId(x.slug, id)) || {};
      const realId = realIdFor(g.id ?? id);
      return {
        id: realId,
        gameId: realId,
        userId: user.id,
        purchasedAt: now,
        price: g.price || 0,
        title: g.title || g.name || id,
        hours: 0,
        image: g.image || (g.images && g.images[0]) || null,
      };
    });

    // Добавляем только новые записи для текущего пользователя (не дублируем)
    const nextLibrary = (() => {
      const existingKeys = new Set(library.filter((p) => p.userId === user.id).map((p) => p.id));
      const toAdd = newEntries.filter((e) => !existingKeys.has(e.id));
      return [...library, ...toAdd];
    })();

    // Не помечаем games.purchased — источник истины для права покупки/часов — library
    setLibrary(nextLibrary);
    setCart([]);
    persistAll({ library: nextLibrary, cart: [] });
    return { ok: true, library: nextLibrary };
  }

  // Добавляем время (в минутах) к entry в library для текущего пользователя
  function addPlaytime(gameId, minutes = 60) {
    if (!user) return { ok: false, message: "Не авторизован" };
    let updated = false;
    const next = library.map((entry) => {
      const matches = matchId(entry.id, gameId) || matchId(entry.gameId, gameId);
      if (matches && String(entry.userId) === String(user.id)) {
        updated = true;
        const newHours = (entry.hours || 0) + minutes / 60;
        return { ...entry, hours: Math.round(newHours * 100) / 100 };
      }
      return entry;
    });

    if (updated) {
      setLibrary(next);
      persistAll({ library: next });
      return { ok: true, library: next };
    }
    return { ok: false, message: "Игра не найдена в вашей библиотеке" };
  }

  // Отмечает/снимает played в library (для текущего user)
  function togglePlayed(gameId) {
    const id = String(gameId);
    const nextLibrary = library.map((entry) => {
      const matches = matchId(entry.id, id) || matchId(entry.gameId, id);
      if (matches && String(entry.userId) === String(user?.id)) {
        return { ...entry, played: !entry.played };
      }
      return entry;
    });

    setLibrary(nextLibrary);
    persistAll({ library: nextLibrary });
    return { ok: true, library: nextLibrary };
  }

  function removeFromLibrary(gameId) {
    if (!user) return { ok: false };
    const next = library.filter((p) => !((matchId(p.id, gameId) || matchId(p.gameId, gameId)) && String(p.userId) === String(user.id)));
    setLibrary(next);
    persistAll({ library: next });
    return { ok: true };
  }

  // expose debug helpers for console (optional)
  useEffect(() => {
    try {
      window.__STORE__ = {
        getState: () => ({ games, library, cart, user, users }),
        toggleFlag,
        addPlaytime,
        togglePlayed,
        addToCart,
        checkout,
      };
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, library, cart, user, users]);

  // Провайдим state и API в контекст
  return (
    <StoreContext.Provider
      value={{
        games,
        cart,
        user,
        users,
        library,
        toggleFlag,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        removeFromLibrary,
        addPlaytime,
        togglePlayed,
        login,
        logout,
        register,
        setGames,
        setUsers,
        setCart,
        setUser,
        setLibrary,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}