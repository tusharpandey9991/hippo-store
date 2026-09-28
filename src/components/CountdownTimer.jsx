import React, { useEffect, useState } from 'react';

function CountdownTimer({ endTime }) {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (Object.keys(timeLeft).length === 0) return <span className="expired">Offer Expired</span>;

  return (
    <span className="countdown-timer">
      ⏳ {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
    </span>
  );
}

export default CountdownTimer;
