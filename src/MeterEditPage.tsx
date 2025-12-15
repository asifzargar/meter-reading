import React, { useState } from "react";
import MeterEdit from "./MeterEdit";
import MeterImage6 from "./assets/meter6_1.png";
import MeterImage7 from "./assets/meter6_2.png";

const MeterEditPage = () => {
  const array = [MeterImage7, MeterImage6];
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {array
        .filter((val, index) => idx === index)
        .map((val) => {
          return <MeterEdit val={val} />;
        })}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          background: "white",
          width: "100%",
        }}
        className="controls"
      >
        <button
          disabled={idx === 0}
          onClick={() => {
            setIdx(idx - 1);
          }}
        >
          Prev
        </button>
        <button
          disabled={idx + 1 === array.length}
          onClick={() => {
            setIdx(idx + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MeterEditPage;
