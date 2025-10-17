import React from "react";

export default function CenterLoader({ label = "Loading...", fullPage = true, variant = "spinner" }) {
  return (
    <div style={{ ...wrapStyle, minHeight: fullPage ? "100vh" : wrapStyle.minHeight }}>
      {variant === "waves" ? (
        <div style={wavesWrapStyle}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...waveBarStyle, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : (
        <div style={ringWrapStyle}>
          <div style={glowStyle} />
          <div style={spinnerStyle} />
        </div>
      )}
      <div style={labelStyle}>{label}</div>
    </div>
  );
}

const wrapStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "70vh",
  width: "100%",
};

const ringWrapStyle = {
  position: "relative",
  width: 64,
  height: 64,
};

const glowStyle = {
  position: "absolute",
  inset: -8,
  borderRadius: "50%",
  background: "radial-gradient( rgba(59,130,246,0.25), transparent 60% )",
  filter: "blur(6px)",
};

const spinnerStyle = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  border: "4px solid rgba(99,102,241,0.15)",
  borderTopColor: "#3b82f6",
  borderRightColor: "#6366f1",
  animation: "spin 0.9s linear infinite",
  boxShadow: "0 0 12px rgba(59,130,246,0.25)",
  background: "conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.15), rgba(99,102,241,0.15))",
};

const labelStyle = {
  marginTop: 14,
  color: "#334155",
  fontSize: 15,
  fontWeight: 600,
};

const wavesWrapStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 6,
  height: 64,
};

const waveBarStyle = {
  width: 8,
  height: 16,
  borderRadius: 6,
  background: "linear-gradient(180deg, #60a5fa, #3b82f6)",
  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
  animation: "wave 1s ease-in-out infinite",
};


