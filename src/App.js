import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import HomePage from "./components/HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  // Cargar el estado de inicio de sesión desde localStorage al cargar el componente
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  // Guardar el estado de inicio de sesión en localStorage
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <div>
      {!isLoggedIn ? (
        showForgetPassword ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              minWidth: "100vw",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ForgetPassword onBack={() => setShowForgetPassword(false)} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              minWidth: "100vw",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Login
              onLogin={handleLogin}
              onForgetPassword={() => setShowForgetPassword(true)}
            />
          </div>
        )
      ) : (
        <HomePage setIsLoggedIn={handleLogout} />
      )}
    </div>
  );
}

export default App;
