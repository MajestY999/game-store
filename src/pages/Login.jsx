// ...existing code...
/*
  Страница входа/регистрации:
  - локальные стейты для mode, name, email, password и error.
  - onSubmit:
    * если mode === "register" — вызывает register(data) из стора;
      при успехе логинит нового пользователя (store.setUser) и редиректит в /profile.
    * иначе вызывает login(credentials) — при успехе редиректит в /profile.
  - register/login возвращают { ok: boolean, message?, user? } — обрабатываем результат и показываем ошибки.
  - Навигация: после успешной операции navigate("/profile").
*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Login() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      const res = register({ name, email, password });
      if (!res.ok) return setError(res.message);
      alert("Регистрация выполнена");
      navigate("/profile");
      return;
    }

    const res = login({ email, password });
    if (!res.ok) return setError(res.message);
    alert("Вход выполнен");
    navigate("/profile");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode === "register" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" type="password" />
        {error && <div style={{ color: "#ffb4a2" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" type="submit">{mode === "login" ? "Войти" : "Зарегистрироваться"}</button>
          <button type="button" className="btn secondary" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Перейти к регистрации" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </form>
    </div>
  );
}
// ...existing code...