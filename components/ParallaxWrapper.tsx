
import React from 'react';
import { ParallaxProps, MousePosition } from '../types';

interface ExtendedParallaxProps extends ParallaxProps {
  mousePosition: MousePosition;
}

const ParallaxWrapper: React.FC<ExtendedParallaxProps> = ({ 
  children, 
  factor = 0.02, 
  mousePosition,
  className = "" 
}) => {
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const moveX = (mousePosition.x - centerX) * -factor;
  const moveY = (mousePosition.y - centerY) * -factor;

  return (
    <div 
      className={`transition-transform duration-700 ease-out ${className}`}
      style={{ transform: `translate3d(${moveX}px, ${moveY}px, 0)` }}
    >
      {children}
    </div>
  );
};

export default ParallaxWrapper;
