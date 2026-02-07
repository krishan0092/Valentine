import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const areaRef = useRef(null);
  const noRef = useRef(null);

  const [noPos, setNoPos] = useState({ left: 0, top: 0 });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    placeNoButton();
    window.addEventListener("resize", placeNoButton);
    return () => window.removeEventListener("resize", placeNoButton);
  }, []);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const placeNoButton = () => {
    const area = areaRef.current;
    const noBtn = noRef.current;
    if (!area || !noBtn) return;

    const rect = area.getBoundingClientRect();
    const btn = noBtn.getBoundingClientRect();
    const padding = 10;

    setNoPos({
      left: rect.width - btn.width - padding,
      top: rect.height / 2 - btn.height / 2,
    });
  };

  const moveNoRandom = (intensity = 1) => {
    const area = areaRef.current;
    const noBtn = noRef.current;
    if (!area || !noBtn) return;

    const rect = area.getBoundingClientRect();
    const btn = noBtn.getBoundingClientRect();

    const padding = 10;
    const maxX = rect.width - btn.width - padding;
    const maxY = rect.height - btn.height - padding;

    // intensity 0..1  => jump range
    const jumpX = 40 + intensity * 160; // near = bigger jump
    const jumpY = 30 + intensity * 130;

    let left = Math.random() * maxX;
    let top = Math.random() * maxY;

    // add extra push
    left = clamp(left + (Math.random() - 0.5) * jumpX, padding, maxX);
    top = clamp(top + (Math.random() - 0.5) * jumpY, padding, maxY);

    setNoPos({ left, top });
  };

  // MAIN: proximity detector (mouse jitna paas, utna bhaago)
  const handleAreaMouseMove = (e) => {
    const area = areaRef.current;
    const noBtn = noRef.current;
    if (!area || !noBtn) return;

    const areaRect = area.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // button center
    const bx = btnRect.left + btnRect.width / 2;
    const by = btnRect.top + btnRect.height / 2;

    // cursor
    const mx = e.clientX;
    const my = e.clientY;

    // distance
    const dx = mx - bx;
    const dy = my - by;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // threshold: area ke size ke hisaab se
    const threshold = Math.min(areaRect.width, areaRect.height) * 0.55;

    if (dist < threshold) {
      // intensity: 0 (far) -> 1 (super near)
      const intensity = 1 - dist / threshold;

      // throttle feel: near = more frequent moves
      // random chance increases with intensity
      const chance = 0.15 + intensity * 0.7;

      if (Math.random() < chance) {
        moveNoRandom(intensity);
      }
    }
  };

  const popHearts = (count = 24) => {
    for (let i = 0; i < count; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.style.left = Math.random() * window.innerWidth + "px";
      h.style.top = window.innerHeight - 40 + Math.random() * 30 + "px";
      h.style.animationDelay = Math.random() * 0.6 + "s";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3000);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Will you be my Valentine? 💖</h1>
        <p>Only one correct answer 😌</p>

        {/* Play Area */}
        <div className="playArea" ref={areaRef} onMouseMove={handleAreaMouseMove}>
          <button
            className="btn yes"
            onClick={() => {
              setShowResult(true);
              popHearts();
            }}
          >
            Yes 😍
          </button>

          <button
            className="btn no"
            ref={noRef}
            style={{ left: noPos.left, top: noPos.top }}
            onMouseEnter={() => moveNoRandom(1)} // extra tease
            onTouchStart={(e) => {
              e.preventDefault();
              moveNoRandom(1);
            }}
          >
            No 😅
          </button>
        </div>

        {showResult && (
          <div className="result">
            Yayyy! I knew it Buglaaa 🪿🪿 😍💘 <br />
          
          </div>
        )}

       
      </div>
    </div>
  );
}
