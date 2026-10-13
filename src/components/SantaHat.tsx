interface SantaHatProps {
  className?: string;
}

export function SantaHat({ className = '' }: SantaHatProps) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const webpSrc = `${base}/images/santa_hat_realistic.webp`;
  const pngSrc = `${base}/images/santa_hat_realistic.png`;

  return (
    <div className={`pointer-events-none select-none shrink-0 max-w-none ${className}`}>
      <picture className="block w-full h-full max-w-none pointer-events-none select-none">
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={pngSrc}
          alt="Festive Santa Hat"
          className="w-full h-full max-w-none object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
          draggable={false}
        />
      </picture>
    </div>
  );
}
