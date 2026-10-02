import React, { useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  value: number;
  className?: string;
}

// Fallback simple counter that respects prefers-reduced-motion implicitly
export function AnimatedCounter({ value, className }: AnimatedCounterProps): React.JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const isReduced = window.matchMedia 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
      
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number;
    const duration = 800; // max 800ms
    const startValue = displayValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (value - startValue) * ease;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Format appropriately
  const formatted = displayValue % 1 !== 0 
    ? displayValue.toFixed(2)
    : Math.floor(displayValue).toString();

  return <span className={className}>{formatted}</span>;
}