import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images, Play, Pause, Download, Check } from 'lucide-react';
import { GalleryPhoto } from '@/data/gallery';

type LightboxProps = {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  startPlaying?: boolean;
};

const SLIDESHOW_INTERVAL_MS = 3000;

export function Lightbox({ photos, index, onClose, onNavigate, startPlaying = false }: LightboxProps) {
  const [playing, setPlaying] = useState(startPlaying);
  const [currentPhoto, setCurrentPhoto] = useState(photos[index]);
  const [fade, setFade] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const total = photos.length;

  useEffect(() => {
    setPlaying(startPlaying);
  }, [startPlaying]);

  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setCurrentPhoto(photos[index]);
      setFade(true);
      setDownloaded(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [index, photos]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentPhoto || downloading) return;
    try {
      setDownloading(true);
      const response = await fetch(currentPhoto.src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const cleanCat = (currentPhoto.category || 'pallotti-photo').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Pallotti_${cleanCat}_${index + 1}.jpg`;
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch {
      // Fallback direct open/download
      const a = document.createElement('a');
      a.href = currentPhoto.src;
      a.download = `Pallotti_Photo_${index + 1}.jpg`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  const goPrev = useCallback(() => {
    if (index > 0) {
      onNavigate(index - 1);
    } else {
      onNavigate(total - 1);
    }
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    const currentCat = photos[index]?.category;
    const isLastInCat = index === total - 1 || (currentCat && photos[index + 1]?.category !== currentCat);

    if (isLastInCat && playing) {
      onClose();
      return;
    }

    if (index < total - 1) {
      onNavigate(index + 1);
    } else {
      onNavigate(0);
    }
  }, [index, total, photos, playing, onNavigate, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); setPlaying(p => !p); }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    if (!playing) return;

    const timer = setTimeout(() => {
      goNext();
    }, SLIDESHOW_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [playing, index, goNext]);

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* TOP ACTIONS */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2.5">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`flex h-11 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold tracking-wide backdrop-blur transition-all ${
            downloaded
              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
              : 'border-white/15 bg-white/5 text-white/85 hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Download photo"
          title="Download original photo"
        >
          {downloaded ? (
            <>
              <Check size={16} className="text-emerald-400" />
              <span className="hidden sm:inline">Downloaded</span>
            </>
          ) : (
            <>
              <Download size={16} className={downloading ? 'animate-bounce' : ''} />
              <span className="hidden sm:inline">{downloading ? 'Downloading...' : 'Download'}</span>
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="absolute left-5 top-5 z-10 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <Images size={14} className="text-[#d7b76d]" />
          <span className="font-serif text-[14px] tracking-wide">
            <span className="text-[#f2d48e] font-semibold">{index + 1}</span>
            <span className="text-white/40 mx-2">/</span>
            <span>{total}</span>
          </span>
          <span className="mx-1 h-3 w-px bg-white/15" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">{currentPhoto.category}</span>
        </div>
        {playing && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
            <div
              key={index}
              className="h-full rounded-full bg-gradient-to-r from-[#d7b76d] to-[#f2d48e]"
              style={{
                animation: `progressFill ${SLIDESHOW_INTERVAL_MS}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white md:left-8 md:h-14 md:w-14"
        aria-label="Previous photo"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white md:right-8 md:h-14 md:w-14"
        aria-label="Next photo"
      >
        <ChevronRight size={22} />
      </button>

      <div
        className="relative flex max-h-[88vh] max-w-[92vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.src}
          alt={currentPhoto.category}
          className="max-h-[88vh] max-w-[92vw] rounded-sm object-contain shadow-2xl shadow-black/50 transition-opacity duration-300 ease-in-out"
          style={{ opacity: fade ? 1 : 0 }}
        />
      </div>

      {/* CENTERED BOTTOM PLAY / PAUSE BUTTON */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <button
          onClick={(e) => { e.stopPropagation(); setPlaying(p => !p); }}
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all duration-300 hover:scale-110 hover:text-white sm:h-14 sm:w-14 ${
            playing
              ? 'border-[#d7b76d]/50 bg-[#d7b76d]/20 text-[#f2d48e] hover:bg-[#d7b76d]/30 shadow-[#d7b76d]/20'
              : 'border-white/20 bg-black/60 text-white/90 hover:bg-black/80 hover:border-white/40'
          }`}
          aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
          title={playing ? 'Pause slideshow (Space)' : 'Play slideshow (Space)'}
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="translate-x-[1.5px]" />}
        </button>
      </div>
    </div>
  );
}
