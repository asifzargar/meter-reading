import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slider, Stack } from "@mui/material";
import EmailJSON from "./email.json";
import Api from "./services/api";
import { enqueueSnackbar } from "notistack";

function MeterEdit({ val }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const offset = useRef({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(0.55);
  const [opacity, setOpacity] = useState(70);

  const [positions, setPositions] = useState({
    text1: { x: 36, y: 31.5 },
    text2: { x: 57, y: 49.5 },
  });

  /* -------------------- AUTH CHECK -------------------- */
  useEffect(() => {
    const authPassword = localStorage.getItem("authTokenPassword");
    if (
      !EmailJSON.find(
        (v) => `${v.password}` === JSON.parse(JSON.stringify(authPassword))
      )
    ) {
      navigate("/");
    }
  }, [navigate]);

  /* -------------------- SESSION CHECK -------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Api.get("/auth/profile");
        if (new Date(res?.user?.expiresAt) < new Date()) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  /* -------------------- DRAG LOGIC -------------------- */
  const startDrag = (e, key) => {
    activeRef.current = key;

    const rect = e.target.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const onDrag = (e) => {
    if (!activeRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const xPercent =
      ((clientX - container.left - offset.current.x) / container.width) * 100;
    const yPercent =
      ((clientY - container.top - offset.current.y) / container.height) * 100;

    setPositions((prev) => ({
      ...prev,
      [activeRef.current]: {
        x: Math.min(Math.max(xPercent, 0), 100),
        y: Math.min(Math.max(yPercent, 0), 100),
      },
    }));
  };

  const stopDrag = () => {
    activeRef.current = null;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", stopDrag);
  };

  /* -------------------- UI -------------------- */
  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <Stack sx={{ width: "90%" }}>
        <Slider value={opacity} onChange={(_, v) => setOpacity(v)} />
      </Stack>

      <div className="controls">
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
          Zoom In
        </button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}>
          Zoom Out
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "90%",
          height: "650px",
          position: "relative",
        }}
      >
        {/* TEXT 1 */}
        <EditableText
          value="0001"
          id="meterReading"
          pos={positions.text1}
          zoom={zoom}
          opacity={opacity}
          fontSize={60}
          onStart={(e) => startDrag(e, "text1")}
        />

        {/* TEXT 2 */}
        <EditableText
          value="123456"
          id=""
          pos={positions.text2}
          zoom={zoom}
          opacity={opacity}
          fontSize={40}
          onStart={(e) => startDrag(e, "text2")}
        />

        <img
          src={val}
          alt="Meter"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------- TEXT COMPONENT -------------------- */
function EditableText({ id, value, pos, zoom, opacity, fontSize, onStart }) {
  return (
    <div
      id={id}
      contentEditable
      suppressContentEditableWarning
      onMouseDown={onStart}
      onTouchStart={onStart}
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
        cursor: "move",
        fontSize,
        letterSpacing: "2px",
        color: "#000",
        opacity: opacity / 100,
        userSelect: "none",
        zIndex: 10,
      }}
    >
      {value}
    </div>
  );
}

export default MeterEdit;
