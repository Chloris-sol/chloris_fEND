import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

interface Props {
  children: React.ReactNode;
}

const LenisProvider: React.FC<Props> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    
    lenisRef.current = new Lenis({
      duration: 1.5,              
      easing: (t) => t * (2 - t),  
      smooth: true,
      direction: 'vertical',
      wheelMultiplier: 0.8,        
      smoothTouch: true,           
      syncTouch: true,            
      touchMultiplier: 2.0,        
      gestureOrientation: 'vertical',
      normalizeWheel: true,        
    });

    
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    
    const onResize = () => {
      lenisRef.current?.resize();
    };
    window.addEventListener('resize', onResize);

    
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;