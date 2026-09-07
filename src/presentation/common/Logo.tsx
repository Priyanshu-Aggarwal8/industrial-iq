import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const IndustrialIqLogo: React.FC<LogoProps> = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Precision Industrial IQ Hexagonal Telemetry Core */}
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        className="stroke-current"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 6V12L17 15"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        className="fill-current"
      />
    </svg>
  );
};

