import React from "react";

const Loading = ({ stroke }: { stroke?: string }) => {
  return (
    <div role="status">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="100"
        height="100"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "rgb(255, 255, 255);",
        }}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <circle
            stroke-dasharray="164.93361431346415 56.97787143782138"
            r="35"
            strokeWidth="12"
            stroke={stroke ?? "#ff692e"}
            fill="none"
            cy="50"
            cx="50"
          >
            <animateTransform
              keyTimes="0;1"
              values="0 50 50;360 50 50"
              dur="1s"
              repeatCount="indefinite"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
          </circle>
          <g></g>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
