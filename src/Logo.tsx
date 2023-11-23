import React from "react";

function Logo(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 200 50"
      {...props}
    >
      <text
        fill="#407a69"
        strokeWidth="0"
        dx="0"
        dy="0"
        fontFamily='"e3p6xqYioTU1:::Montserrat"'
        fontSize="40"
        fontWeight="600"
        transform="translate(19 38.881)"
      >
        <tspan y="0">TAQSIT</tspan>
      </text>
    </svg>
  );
}

export default Logo;
