import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaItem[] = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg,#4F46E5,#000)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg,#10B981,#000)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg,#F59E0B,#000)',
      url: 'https://dribbble.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg,#EF4444,#000)',
      url: 'https://kaggle.com/'
    }
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
    setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn;

    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };

    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const rect = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - rect.left, e.clientY - rect.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = e => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full ${className}`}
      style={
        {
          '--r': `${radius}px`,
          '--x': '50%',
          '--y': '50%'
        } as React.CSSProperties
      }
    >
      {/* Clipped content wrapper with buffer */}
      <div className="relative flex flex-wrap justify-center items-start gap-3 p-[8px] overflow-hidden">
        {data.map((c, i) => (
          <div
            key={i}
            onClick={() => handleCardClick(c.url)}
            className="relative rounded-[20px] p-[2px] cursor-pointer"
            style={{ background: c.borderColor || 'transparent' }}
          >
            <article
              onMouseMove={handleCardMove}
              className="group relative flex flex-col w-[300px] rounded-[18px] overflow-hidden bg-clip-padding"
              style={
                {
                  background: c.gradient,
                  '--spotlight-color': 'rgba(255,255,255,0.3)'
                } as React.CSSProperties
              }
            >
              {/* Spotlight */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
                }}
              />

              {/* Image */}
              <div className="relative z-10 flex-1 p-[10px] bg-transparent">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[10px] block"
                />
              </div>

              {/* Footer */}
              <footer
                className={`relative z-10 p-3 text-white grid gap-x-3 gap-y-1 ${c.handle ? 'grid-cols-[1fr_auto]' : 'grid-cols-1'
                  }`}
              >
                <h3 className="text-[1.05rem] font-semibold">{c.title}</h3>
                {c.handle && (
                  <span className="text-[0.95rem] opacity-80 text-right">
                    {c.handle}
                  </span>
                )}
                <p className="text-[0.85rem] opacity-85">{c.subtitle}</p>
                {c.location && (
                  <span className="text-[0.85rem] opacity-85 text-right">
                    {c.location}
                  </span>
                )}
              </footer>
            </article>
          </div>
        ))}

        {/* Dark mask */}
        <div
          className="absolute inset-[-16px] pointer-events-none z-30"
          style={{
            backdropFilter: 'grayscale(1) brightness(0.78)',
            WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
            maskImage:
              'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 20%, rgba(0,0,0,0.35) 55%, white 100%)',
            WebkitMaskImage:
              'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 20%, rgba(0,0,0,0.35) 55%, white 100%)'
          }}
        />

        {/* Fade mask */}
        <div
          ref={fadeRef}
          className="absolute inset-[-16px] pointer-events-none z-40"
          style={{
            backdropFilter: 'grayscale(1) brightness(0.78)',
            WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
            maskImage:
              'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, rgba(255,255,255,0.6) 55%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, rgba(255,255,255,0.6) 55%, transparent 100%)',
            opacity: 1
          }}
        />
      </div>
    </div>
  );
};

export default ChromaGrid;
