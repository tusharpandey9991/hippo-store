import React, { useState } from "react";
import "./SignupForm.css";

function SignupForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert("You must accept the terms and conditions.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setNotification("✅ Signed up successfully!");
    setTimeout(() => {
      setNotification("");
      onClose(); // close modal
    }, 2000);
  };

  return (
    <div className="signup-overlay">
      <div className="signup-form">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Name" required value={formData.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
          
          <label className="terms-label">
            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
            I agree to the <a href="#">Terms & Conditions</a>
          </label>

          <button className="submit-btn" type="submit">Sign Up</button>
        </form>

        {notification && <div className="signup-notification">{notification}</div>}
      </div>
    </div>
  );
}

export default SignupForm;
