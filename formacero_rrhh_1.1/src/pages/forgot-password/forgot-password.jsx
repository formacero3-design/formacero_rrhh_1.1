import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getApiEndpoint } from "../../utils/api";
import "./forgot-password.css";

function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(getApiEndpoint("/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error enviando email");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Enviar Email</button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p className="footer-text">
          <Link to="/login">Volver al Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;