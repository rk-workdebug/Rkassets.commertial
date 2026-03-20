import React from 'react';

interface RKLogoProps {
  color?: string;
  className?: string;
}

export const RKLogo: React.FC<RKLogoProps> = ({ color = "currentColor", className = "w-8 h-8" }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} flex-shrink-0`}>
      <path d="M20 20 V80" stroke={color} strokeWidth="4" />
      <path d="M20 50 H40 C55 50 55 20 40 20 H20" stroke={color} strokeWidth="4" />
      <path d="M40 50 L60 80" stroke={color} strokeWidth="4" />
      <path d="M70 20 V80" stroke={color} strokeWidth="4" />
      <path d="M70 50 L90 20" stroke={color} strokeWidth="4" />
      <path d="M70 50 L90 80" stroke={color} strokeWidth="4" />
    </svg>
  );
};

export const RKWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  /* Constrain to parent relative container using absolute positioning instead of fixed */
  <div className={`absolute inset-0 w-full h-full pointer-events-none select-none flex items-center justify-center overflow-hidden ${className}`}>
    {/* Limit max size to ensure it doesn't overflow or dominate mobile screens excessively */}
    <RKLogo color="#000" className="w-[80%] h-[80%] max-w-[600px] max-h-[600px]" />
  </div>
);