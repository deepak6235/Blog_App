import React, { useEffect, useState } from "react";
import { loadingBus } from "../lib/loadingBus";

const spinnerSize = 56;

export default function GlobalLoadingOverlay() {
  const [state, setState] = useState({
    networkPending: 0,
    imagePending: 0,
    isLoading: false,
  });

  useEffect(() => {
    const onChange = (e) => {
      setState(e.detail);
    };
    loadingBus.addEventListener("change", onChange);
    // initialize
    setState({
      networkPending: loadingBus.networkPending,
      imagePending: loadingBus.imagePending,
      isLoading: loadingBus.isLoading,
    });
    return () => loadingBus.removeEventListener("change", onChange);
  }, []);

  if (!state.isLoading) return null;

  const total = state.networkPending + state.imagePending;
  const label = `${total} loading${total !== 1 ? "s" : ""}…`;

  return (
    <div style={overlayStyle} aria-live="polite" aria-busy="true">
      <div style={cardStyle} role="status">
        <div style={spinnerStyle} />
        <div style={textStyle}>Loading…</div>
        <div style={subTextStyle}>{label}</div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(2px)",
};

const cardStyle = {
  background: "#0b1220",
  color: "#e6e9f2",
  borderRadius: 12,
  padding: "20px 24px",
  minWidth: 220,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const spinnerStyle = {
  width: spinnerSize,
  height: spinnerSize,
  border: "4px solid rgba(255,255,255,0.25)",
  borderTopColor: "#7aa2ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: 10,
};

const textStyle = { fontSize: 18, fontWeight: 600 };
const subTextStyle = { fontSize: 12, opacity: 0.75, marginTop: 4 };




