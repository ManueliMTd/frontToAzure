import React, { useState } from "react";
import "./Login.css"; // Reutilizamos el mismo estilo del login

function ForgetPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Simulamos guardar (puedes implementar lógica real aquí)
    setMessage("Instructions sent to your email!");
    onBack();
  };

  return (
    <div className="inFormBackground">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="inLoginForm">
        <form onSubmit={handleSave}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src="https://storingpersonal.blob.core.windows.net/connections/Este.png?sp=r&st=2024-11-25T22:00:23Z&se=2027-11-25T06:00:23Z&spr=https&sv=2022-11-02&sr=b&sig=Dp5HIpyILiadPOga3h6AkeJgp0a8qV24bH6zhWtqYlA%3D"
              alt="Logo"
              style={{ width: "200px", height: "200px" }}
            />
          </div>
          <div className="title">
            <h3>Forgot Password</h3>
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              style={{ background: "white" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "10px" }}
            >
              {message}
            </p>
          )}
          <button className="submitForm" type="submit">
            Save
          </button>
          <button
            type="button"
            className="submitForm"
            style={{
              marginTop: "10px",
              backgroundColor: "#ddd",
              color: "#000",
            }}
            onClick={onBack}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
