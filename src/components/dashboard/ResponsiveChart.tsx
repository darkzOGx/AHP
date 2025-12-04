'use client';

import { ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface ResponsiveChartWrapperProps {
  children: React.ReactElement;
  height?: number;
  minHeight?: number;
}

export function ResponsiveChartWrapper({ 
  children, 
  height = 300, 
  minHeight = 200 
}: ResponsiveChartWrapperProps) {
  const [chartHeight, setChartHeight] = useState(height);

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      
      // Adjust height based on screen size
      if (screenWidth < 640) { // mobile
        setChartHeight(Math.max(minHeight, Math.min(height * 0.7, screenHeight * 0.25)));
      } else if (screenWidth < 1024) { // tablet
        setChartHeight(Math.max(minHeight, Math.min(height * 0.85, screenHeight * 0.3)));
      } else { // desktop
        setChartHeight(height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [height, minHeight]);

  return (
    <div style={{ height: chartHeight }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default ResponsiveChartWrapper;