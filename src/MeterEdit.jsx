import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailJSON from "./email.json";
import { enqueueSnackbar } from "notistack";
import Api from "./services/api";
import { Slider, Stack } from "@mui/material";

function MeterEdit({ val }) {
  const meterReadingRef = useRef(null);
  const meterReadingRef2 = useRef(null);
  const [zoom, setZoom] = useState(0.5);
  const [position, setPosition] = useState({ x: 25, y: 31 });
  const [position2, setPosition2] = useState({ x: 45, y: 47 });
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

  const handleMouseDown2 = (e) => {
    const rect = meterReadingRef2.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", handleMouseMove2);
    document.addEventListener("mouseup", handleMouseUp2);
  };

  const handleMouseMove2 = (e) => {
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPosition2({ x: newX, y: newY });
  };

  const handleMouseUp2 = () => {
    document.removeEventListener("mousemove", handleMouseMove2);
    document.removeEventListener("mouseup", handleMouseUp2);
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

  const handleTouchStart2 = (e) => {
    const touch = e.touches[0];
    const rect = meterReadingRef2.current.getBoundingClientRect();
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    document.addEventListener("touchmove", handleTouchMove2);
    document.addEventListener("touchend", handleTouchEnd2);
  };

  const handleTouchMove2 = (e) => {
    const touch = e.touches[0];
    const newX = touch.clientX - offset.current.x;
    const newY = touch.clientY - offset.current.y;
    setPosition2({ x: newX, y: newY });
  };

  const handleTouchEnd2 = () => {
    document.removeEventListener("touchmove", handleTouchMove2);
    document.removeEventListener("touchend", handleTouchEnd2);
  };

  const fetchData = async () => {
    try {
      const res = await Api.get("/auth/profile");
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const [value, setValue] = React.useState(70);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 10px)",
        overflow: "auto",
        gap: "0rem",
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
        style={{
          height: "700px",
          width: "85%",
          position: "relative",
        }}
      >
        <div
          id="meterReading"
          ref={meterReadingRef}
          contentEditable="true"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: `scale(${zoom})`,
            cursor: "move",
            padding: "6px 10px",
            borderRadius: "4px",
            userSelect: "none",
            fontSize: "60px",
            color: "#000",
            letterSpacing: "2px",
            opacity: value / 100,
            zIndex: 1000,
          }}
        >
          0001
        </div>
        <div
          // id="meterReading"
          ref={meterReadingRef2}
          contentEditable="true"
          onMouseDown={handleMouseDown2}
          onTouchStart={handleTouchStart2}
          style={{
            position: "absolute",
            left: `${position2.x}%`,
            top: `${position2.y}%`,
            transform: `scale(${zoom})`,
            cursor: "move",
            padding: "6px 10px",
            borderRadius: "4px",
            userSelect: "none",
            fontSize: "40px",
            color: "#000",
            letterSpacing: "2px",
            opacity: value / 100,
            zIndex: 1000,
          }}
        >
          123456
        </div>
        <img
          id="meter-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // 👈 keeps aspect ratio
            display: "block",
            transform: "rotate(-1deg)",
          }}
          src={val}
          alt="Meter"
        />
      </div>
    </div>
  );
}

export default MeterEdit;
