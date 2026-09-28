import React, { useState } from "react";
import "./LoginForm.css"; // Make sure this CSS file exists

function LoginForm({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Fake user logic
    const userData = {
      email,
      name: "PlayerOne"
    };

    // Call parent's login handler
    onLogin(userData);
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
