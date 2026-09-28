import React from 'react';
import './ThankYouPage.css';

function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <h1>🎉 Thank You for Your Purchase!</h1>
      <p>Your payment was successful.</p>
      <a href="/" className="back-home">← Back to Home</a>
    </div>
  );
}

export default ThankYouPage;
