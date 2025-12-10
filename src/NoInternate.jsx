// NoInternet.js
import React from "react";

export default function NoInternet({}) {
  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <h1 style={styles.title}>No Internet</h1>
        <p style={styles.text}>
          Your device is offline. Check your connection and try again.
        </p>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(12, 14, 20, 0.6)",
    zIndex: 9999,
    padding: "2rem",
  },
  card: {
    width: "min(520px, 90%)",
    padding: "28px",
    borderRadius: 14,
    background: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    textAlign: "center",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: { margin: 0, fontSize: 28, color: "#000" },
  text: { marginTop: 8, color: "#555" },
  actions: {
    marginTop: 18,
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  retryBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  smallBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "transparent",
    cursor: "pointer",
  },
};
