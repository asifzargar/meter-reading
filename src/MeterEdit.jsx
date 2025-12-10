import React, { useEffect, useRef, useState } from "react";
import MeterImage6 from "./assets/meter6_1.png";
import MeterImage7 from "./assets/meter6_2.png";
import { useNavigate } from "react-router-dom";
import EmailJSON from "./email.json";
import { enqueueSnackbar } from "notistack";
import Api from "./services/api";
import { Slider, Stack } from "@mui/material";

function MeterEdit() {
  const meterReadingRef = useRef(null);
  const [zoom, setZoom] = useState(0.4);
  const [position, setPosition] = useState({ x: 120, y: 15 });
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
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.2));

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

  const fetchData = async () => {
    try {
      const res = await Api.get("/profile");
      const inputTime = res?.user?.expiresAt;
      const isSmaller = new Date(inputTime) < new Date();
      if (isSmaller) {
        window.location.href = "/login";
        localStorage.clear();
      }
    } catch (e) {
      enqueueSnackbar("Somthing went wrong", {
        variant: "error",
      });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const [value, setValue] = React.useState(50);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        gap: "1rem",
        paddingBottom: "3rem",
      }}
    >
      <Stack sx={{ width: "100%", px: 2 }}>
        <Slider value={value} onChange={handleChange} />
      </Stack>
      <div className="controls">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>

      <div
        id="meterReading"
        ref={meterReadingRef}
        contentEditable="true"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
          color: "#000",
          letterSpacing: "2px",
          opacity: value / 100,
          border: focused ? "2px solid black" : "2px solid transparent",
        }}
      >
        0001
      </div>
      <img
        id="meter-image"
        style={{ height: "65vh", display: "block", width: "80%" }}
        src={MeterImage7}
        alt="Meter"
      />
      <img
        id="meter-image"
        style={{ height: "65vh", display: "block", width: "80%" }}
        src={MeterImage6}
        alt="Meter"
      />
    </div>
  );
}

export default MeterEdit;
