import React from 'react';

const DeliveryTruck = ({ size = 200, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-label="Delivery Truck Animation"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#f9f9f9" stroke="#e0e0e0" strokeWidth="1" />

      <g transform="translate(0, 5)">
        {/* Animated Speed Lines */}
        <g strokeWidth="3" strokeLinecap="round" opacity="0.6">
          <line x1="8" y1="40" x2="2" y2="40" stroke="#673AB7">
            <animate
              attributeName="stroke"
              values="#673AB7;#9C27B0;#673AB7"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x1"
              values="8;4;8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="12" y1="55" x2="4" y2="55" stroke="#673AB7">
            <animate
              attributeName="stroke"
              values="#673AB7;#9C27B0;#673AB7"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x1"
              values="12;6;12"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Truck Body with Color Animation */}
        <path
          d="M84,48 L78,38 C76.5,35.5 73.5,34 70.5,34 L60,34 V24 C60,21.8 58.2,20 56,20 L20,20 C17.8,20 16,21.8 16,24 L16,64 C16,66.2 17.8,68 20,68 L22,68 C22,72.4 25.6,76 30,76 C34.4,76 38,72.4 38,68 L64,68 C64,72.4 67.6,76 72,76 C76.4,76 80,72.4 80,68 L86,68 C88.2,68 90,66.2 90,64 L90,56 C90,52.5 87.6,49.5 84,48 Z M70,38 C71,38 72,38.5 72.6,39.4 L77.2,47 L60,47 L60,38 L70,38 Z"
          fill="#673AB7"
        >
          {/* Key React change: attributes are camelCase inside the JSX, but animate attributes like attributeName stay standard */}
          <animate
            attributeName="fill"
            values="#673AB7; #9C27B0; #673AB7"
            dur="3s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0; 0.5; 1"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </path>

        {/* Wheels */}
        <circle cx="30" cy="68" r="6" fill="#333333" />
        <circle cx="72" cy="68" r="6" fill="#333333" />
        <circle cx="30" cy="68" r="2.5" fill="#777777" />
        <circle cx="72" cy="68" r="2.5" fill="#777777" />
      </g>
    </svg>
  );
};

export default DeliveryTruck;