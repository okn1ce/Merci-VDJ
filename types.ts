
import React from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export interface ParallaxProps {
  children: React.ReactNode;
  factor?: number;
  className?: string;
}
