import React from "react";

const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="205"
      height="205"
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "rgb(255, 255, 255)",
      }}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <circle
          strokeDasharray="89.5353906273091 31.845130209103033"
          r="19"
          strokeWidth="5"
          stroke="#000000"
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="0.8620689655172413s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          ></animateTransform>
        </circle>
      </g>
    </svg>
  );
};

export default Loader;