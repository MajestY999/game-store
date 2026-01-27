import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import GameDetails from "./pages/GameDetails";
import Products from "./pages/Products";

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="/products" element={<Products />} />
          <Route path="/library" element={<Library />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </main>
    </>
  );
}
