import * as React from "react";

export default function HeartIcon({
  stroke,
  className,
}: {
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.4259 2.5C16.3611 2.5 18.3334 5.29375 18.3334 7.9C18.3334 13.1781 10.1482 17.5 10 17.5C9.85187 17.5 1.66669 13.1781 1.66669 7.9C1.66669 5.29375 3.63891 2.5 6.5741 2.5C8.25928 2.5 9.36113 3.35312 10 4.10312C10.6389 3.35312 11.7408 2.5 13.4259 2.5Z"
        stroke={stroke ?? "white"}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
