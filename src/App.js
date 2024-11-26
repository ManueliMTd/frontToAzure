import React, { useState } from "react";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import HomePage from "./components/HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

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
              minHeight: "100vh", // Asegura que el contenido ocupe toda la altura de la ventana
              minWidth: "100vw",
              backgroundColor: "#f5f5f5", // Fondo para diferenciar del login
            }}
          >
            <ForgetPassword onBack={() => setShowForgetPassword(false)} />{" "}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh", // Asegura que el contenido ocupe toda la altura de la ventana
              minWidth: "100vw",
              backgroundColor: "#f5f5f5", // Fondo para diferenciar del login
            }}
          >
            <Login
              onLogin={() => setIsLoggedIn(true)}
              onForgetPassword={() => setShowForgetPassword(true)}
            />
          </div>
        )
      ) : (
        <HomePage setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
