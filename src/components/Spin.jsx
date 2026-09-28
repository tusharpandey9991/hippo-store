import { useEffect, useRef, useState } from "react";
import "./Spin.css";

const outcomes = [
  { label: "Free Game", type: "free", color: "#e74c3c" },
  { label: "50% Discount", type: "discount50", color: "#f39c12" },
  { label: "Better Luck", type: "fail", color: "#e67e22" },
  { label: "100% Off", type: "discount100", color: "#e84393" },
  { label: "Add to Cart", type: "cart", color: "#3498db" },
  { label: "Try Again", type: "fail", color: "#f39c12" },
];

const Spin = ({ onSpinResult, close }) => {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const canvas = wheelRef.current;
    const ctx = canvas.getContext("2d");
    const radius = canvas.width / 2;
    const total = outcomes.length;
    const arc = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    outcomes.forEach((outcome, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = outcome.color;
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + arc);
      ctx.fill();

      // Draw label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "20px 'Segoe UI', sans-serif";
      ctx.fillText(outcome.label, radius - 20, 10);
      ctx.restore();
    });
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;

    const canvas = wheelRef.current;
    const total = outcomes.length;
    const arc = 360 / total;
    const randomIndex = Math.floor(Math.random() * total);
    const targetAngle = 360 * 5 + (360 - randomIndex * arc - arc / 2); // 5 full spins + landing

    setIsSpinning(true);
    canvas.style.transition = "transform 4s ease-out";
    canvas.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
      canvas.style.transition = "none";
      canvas.style.transform = `rotate(${(360 - randomIndex * arc - arc / 2) % 360}deg)`;
      setIsSpinning(false);
      setMessage(outcomes[randomIndex].label);
      if (onSpinResult) onSpinResult(outcomes[randomIndex]);
      setTimeout(() => setMessage(""), 4000);
    }, 4200);
  };

  return (
    <div className="spin-popup">
      <button className="spin-close" onClick={close}>❌</button>

      <div className="spin-wheel-wrapper">
        <div className="spin-indicator">🔻</div>
        <canvas ref={wheelRef} width={360} height={360} className="spin-wheel" />
        <button className="spin-button" onClick={handleSpin}>
          SPIN NOW 🎯
        </button>
      </div>

      {message && <div className="spin-message-popup">{message}</div>}
    </div>
  );
};

export default Spin;
