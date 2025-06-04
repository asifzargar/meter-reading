import React, { useEffect, useRef, useState } from "react";
import MeterImage from "./assets/meter2.jpg";
import MeterImage2 from "./assets/meter1.jpg";
import { useNavigate } from "react-router-dom";
import EmailJSON from "./email.json";

function MeterEdit() {
  const meterReadingRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [next, setNext] = useState(1);
  const [position, setPosition] = useState({ x: 120, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  let navigate = useNavigate();

  const handleMouseDown = (e) => {
    const rect = meterReadingRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  useEffect(() => {
    let authPassword = localStorage.getItem("authTokenPassword");
    if (
      EmailJSON.find(
        (val) => `${val.password}` === JSON.parse(JSON.stringify(authPassword))
      )
    ) {
    } else {
      navigate("/");
    }
  }, []);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = meterReadingRef.current.getBoundingClientRect();
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const newX = touch.clientX - offset.current.x;
    const newY = touch.clientY - offset.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      style={{
        position: "relative",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        gap: "1rem",
      }}
    >
      <div className="controls" style={{ marginTop: "3rem" }}>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>

      <div
        id="meterReading"
        ref={meterReadingRef}
        contentEditable="true"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${zoom})`,
          cursor: "move",
          padding: "6px 10px",
          borderRadius: "4px",
          userSelect: "none",
          fontSize: "60px",
          color: "rgba(0, 0, 0, 0.49)",
          letterSpacing: "2px",
        }}
      >
        0001
      </div>

      <img
        id="meter-image"
        style={{ height: "65vh", display: "block" }}
        src={next == 1 ? MeterImage2 : next == 2 ? MeterImage : MeterImage}
        alt="Meter"
      />
      <div className="controls">
        <button
          onClick={() => {
            if (next === 3) {
              setNext(next - 1);
            } else {
              setNext(next + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MeterEdit;
