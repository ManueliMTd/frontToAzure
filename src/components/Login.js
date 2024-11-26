import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin, onForgetPassword }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "pass") {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="inFormBackground">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="inLoginForm">
        <form onSubmit={handleLogin}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src="https://storingpersonal.blob.core.windows.net/connections/Este.png?sp=r&st=2024-11-25T22:00:23Z&se=2027-11-25T06:00:23Z&spr=https&sv=2022-11-02&sr=b&sig=Dp5HIpyILiadPOga3h6AkeJgp0a8qV24bH6zhWtqYlA%3D"
              alt="Logo"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <div className="title">
            <h3>Storage Manager</h3>
          </div>
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
              Incorrect Username or Password
            </p>
          )}
          <button className="submitForm" type="submit">
            Log In
          </button>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#1877f2",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={onForgetPassword}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
