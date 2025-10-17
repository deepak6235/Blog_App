import React, { useEffect, useState } from "react";
import { loadingBus } from "../lib/loadingBus";

export default function ImageWithLoader({ src, alt = "", style, className, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    setError(false);
    loadingBus.incImage();
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      loadingBus.decImage();
    };
    img.onerror = () => {
      setError(true);
      loadingBus.decImage();
    };
    img.src = src;
    return () => {
      // No reliable way to cancel; best-effort mark as done if changing
    };
  }, [src]);

  return (
    <div style={{ position: "relative", display: "inline-block" }} className={className}>
      {!loaded && !error && (
        <div style={placeholderStyle}>
          <div style={miniSpinner} />
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={src} alt={alt} style={{ ...imgStyle, opacity: loaded ? 1 : 0, ...style }} {...rest} />
      {error && <div style={errorStyle}>Image failed to load</div>}
    </div>
  );
}

const imgStyle = {
  display: "block",
  transition: "opacity 200ms ease",
};

const placeholderStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#111827",
};

const miniSpinner = {
  width: 24,
  height: 24,
  border: "3px solid rgba(255,255,255,0.25)",
  borderTopColor: "#93c5fd",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const errorStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fecaca",
  background: "#111827",
  fontSize: 12,
};


