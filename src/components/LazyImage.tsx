import { useState, useRef, useEffect } from 'react';
import { Images } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  globalIndex?: number;
  onClick?: () => void;
  rootMargin?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  globalIndex,
  onClick,
  rootMargin = '250px 0px',
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use Intersection Observer with generous rootMargin (loads 250px before entering viewport)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [rootMargin]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm bg-[#173c46]/10 cursor-pointer ${aspectRatio} ${className}`}
    >
      {/* SKELETON SHIMMER PLACEHOLDER */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#173c46]/10 via-[#d7b76d]/15 to-[#173c46]/10 bg-[length:200%_100%] transition-opacity duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'
        }`}
        style={{
          animation: isLoaded ? 'none' : 'shimmerPulse 1.8s ease-in-out infinite',
        }}
      />

      {/* REAL IMAGE (LOADED ONCE IN VIEW) */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          className={`h-full w-full object-cover transition-all duration-700 ease-out will-change-transform group-hover:scale-[1.04] ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      )}

      {/* AMBIENT HOVER GRADIENT & OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d242b]/70 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

      {globalIndex !== undefined && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] backdrop-blur sm:text-[9px]">
            #{globalIndex + 1}
          </span>
          <Images size={13} className="drop-shadow" />
        </div>
      )}
    </div>
  );
}
