import React, { useEffect, useRef, useState } from "react";
import { loadingBus } from "../lib/loadingBus";

export default function TopProgressBar() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleChange = (e) => {
      const { isLoading } = e.detail;
      if (isLoading) start();
      else finish();
    };
    loadingBus.addEventListener("change", handleChange);
    // initialize
    if (loadingBus.isLoading) start();
    return () => {
      loadingBus.removeEventListener("change", handleChange);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(true);
    setProgress(8); // initial kick

    // Simulate incremental progress until completion
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        // Slow down as it approaches 80%
        const delta = (80 - p) / 20;
        const next = Math.min(p + Math.max(0.5, delta), 80);
        return next;
      });
    }, 200);
  };

  const finish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Complete quickly, then hide
    setProgress(100);
    const t = setTimeout(() => {
      setIsActive(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(t);
  };

  if (!isActive) return null;

  return (
    <div style={containerStyle}>
      <div style={{ ...barStyle, width: `${progress}%` }} />
    </div>
  );
}

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  background: "transparent",
  zIndex: 9999,
};

const barStyle = {
  height: "100%",
  background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
  boxShadow: "0 0 8px rgba(59,130,246,0.6)",
  transition: "width 200ms ease",
};




