// components/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="neon-footer">
      <div className="footer-inner-wrapper">
        <div className="footer-section about">
          <h3>PREGNANT HIPPO STORE</h3>
          <p>
            Explore the craziest collection of games with blazing discounts and
            epic previews. Powered by Hippos 🦛
          </p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#games">Games</a></li>
            <li><a href="#trending">Trending</a></li>
            <li><a href="#offers">Offers</a></li>
            <li><a href="#profile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-twitch"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>Email: support@pregnanthippo.games</p>
          <p>Phone: +91-12345-67890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Pregnant Hippo Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
