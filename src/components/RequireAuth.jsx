// ...existing code...
/*
  Простой роут-головёршка: если пользователь не залогинен — редирект на /login.
  Используется в App.jsx для защищённых маршрутов.
  - useStore().user — проверяем наличие user.
  - useLocation() — передаём текущий location в state при перенаправлении, чтобы после логина вернуться.
*/
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/store";

export default function RequireAuth({ children }) {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    // перенаправляем на /login и сохраняем from-location в state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
// ...existing code...