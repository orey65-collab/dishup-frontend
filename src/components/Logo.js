export const Logo = ({ size = 48, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background - Sage Green */}
      <rect 
        x="2" 
        y="2" 
        width="44" 
        height="44" 
        rx="10" 
        fill="#9DB4A0"
      />
      
      {/* Pan handle */}
      <rect 
        x="32" 
        y="22" 
        width="12" 
        height="4" 
        rx="2" 
        fill="white"
      />
      
      {/* Pan body */}
      <ellipse 
        cx="22" 
        cy="26" 
        rx="12" 
        ry="10" 
        fill="white"
      />
      
      {/* Pan inner circle */}
      <ellipse 
        cx="22" 
        cy="26" 
        rx="9" 
        ry="7" 
        fill="#9DB4A0"
        opacity="0.4"
      />
      
      {/* Star 1 - Left */}
      <path 
        d="M12 12 L13.5 9 L15 12 L18 13.5 L15 15 L13.5 18 L12 15 L9 13.5 Z" 
        fill="#F97316"
      />
      
      {/* Star 2 - Center (bigger) */}
      <path 
        d="M22 8 L24 4 L26 8 L30 10 L26 12 L24 16 L22 12 L18 10 Z" 
        fill="#F97316"
      />
      
      {/* Star 3 - Right */}
      <path 
        d="M32 14 L33.5 11 L35 14 L38 15.5 L35 17 L33.5 20 L32 17 L29 15.5 Z" 
        fill="#F97316"
      />
    </svg>
  );
};

export const LogoSmall = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background - Sage Green */}
      <rect 
        x="2" 
        y="2" 
        width="44" 
        height="44" 
        rx="10" 
        fill="#9DB4A0"
      />
      
      {/* Pan handle */}
      <rect 
        x="32" 
        y="22" 
        width="12" 
        height="4" 
        rx="2" 
        fill="white"
      />
      
      {/* Pan body */}
      <ellipse 
        cx="22" 
        cy="26" 
        rx="12" 
        ry="10" 
        fill="white"
      />
      
      {/* Pan inner circle */}
      <ellipse 
        cx="22" 
        cy="26" 
        rx="9" 
        ry="7" 
        fill="#9DB4A0"
        opacity="0.4"
      />
      
      {/* Star 1 - Left */}
      <path 
        d="M12 12 L13.5 9 L15 12 L18 13.5 L15 15 L13.5 18 L12 15 L9 13.5 Z" 
        fill="#F97316"
      />
      
      {/* Star 2 - Center (bigger) */}
      <path 
        d="M22 8 L24 4 L26 8 L30 10 L26 12 L24 16 L22 12 L18 10 Z" 
        fill="#F97316"
      />
      
      {/* Star 3 - Right */}
      <path 
        d="M32 14 L33.5 11 L35 14 L38 15.5 L35 17 L33.5 20 L32 17 L29 15.5 Z" 
        fill="#F97316"
      />
    </svg>
  );
};
