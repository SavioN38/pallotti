import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowUp, Images, Layers, Home, Clock } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { Lightbox } from '@/components/Lightbox';
import { Reveal } from '@/components/Reveal';
import { LazyImage } from '@/components/LazyImage';
import {
  GALLERY_YEARS,
  buildGalleryCategories,
  getAllPhotosForYear,
  GalleryCategory,
} from '@/data/gallery';

const COLUMNS = 3;

function splitIntoColumns<T>(items: T[], cols: number): T[][] {
  const result: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => result[i % cols].push(item));
  return result;
}

export function GalleryPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxAutoStart, setLightboxAutoStart] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const yearSlug = year ?? '2025-26';
  const yearInfo = GALLERY_YEARS.find((y) => y.slug === yearSlug);
  const isActiveYear = yearInfo?.active;

  const categories: GalleryCategory[] = useMemo(() => {
    return buildGalleryCategories(yearSlug);
  }, [yearSlug]);

  const allPhotos = useMemo(() => {
    return getAllPhotosForYear(yearSlug);
  }, [yearSlug]);

  useEffect(() => {
    if (!yearInfo?.active && year) {
      navigate('/gallery/2025-26', { replace: true });
    }
  }, [yearInfo, year, navigate]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 600);
      const sections = categories.map((c) => document.getElementById(`cat-${c.slug}`)).filter(Boolean) as HTMLElement[];
      const header = document.querySelector('header');
      const chipsBar = document.querySelector('[data-jump-chips]');
      const h = header?.getBoundingClientRect().height ?? 76;
      const c = chipsBar?.getBoundingClientRect().height ?? 62;
      const gap = 16;
      const tolerance = 24;
      const offset = h + c + gap + tolerance;
      let current = '';
      for (const s of sections) {
        if (s.getBoundingClientRect().top < offset) current = s.id;
      }
      setActiveSection(current.replace('cat-', ''));
    };
    let raf = 0;
    const throttled = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = 0; onScroll(); });
    };
    onScroll();
    window.addEventListener('scroll', throttled, { passive: true });
    window.addEventListener('resize', throttled);
    return () => {
      window.removeEventListener('scroll', throttled);
      window.removeEventListener('resize', throttled);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [categories]);

  const getScrollOffset = useCallback(() => {
    const header = document.querySelector('header');
    const chipsBar = document.querySelector('[data-jump-chips]');
    const h = header?.getBoundingClientRect().height ?? 76;
    const c = chipsBar?.getBoundingClientRect().height ?? 58;
    return h + c + 8;
  }, []);

  const scrollToSection = useCallback((slug: string, catIdx?: number) => {
    const el = (catIdx !== undefined
      ? document.querySelectorAll<HTMLElement>('section[data-cat-idx]')[catIdx]
      : null) ?? document.getElementById(`cat-${slug}`);
    if (!el) return;

    setActiveSection(slug);
    const offset = getScrollOffset();
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, [getScrollOffset]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!isActiveYear) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f5f0] text-[#173c46]">
      <AppHeader />

      {/* HERO */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-[#0d242b] pb-20 pt-28 sm:min-h-[82vh] sm:pb-24 sm:pt-36 lg:pb-32">
        <img
          src={categories[0]?.cover || '/images/school/school.png'}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
          style={{ animation: 'kenBurns 28s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 -z-[5] bg-[linear-gradient(180deg,rgba(13,36,43,.85)_0%,rgba(13,36,43,.65)_45%,rgba(13,36,43,.95)_100%)]" />
        <div className="absolute inset-0 -z-[4] bg-[radial-gradient(circle_at_80%_20%,rgba(215,183,109,.15),transparent_55%)]" />

        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div style={{ animation: 'fadeSlideUp 700ms cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
              <Link to="/" className="group flex items-center gap-1.5 text-white/50 transition-colors hover:text-[#f2d48e]">
                <Home size={12} /> Home
              </Link>
              <ChevronRight size={12} className="text-white/25" />
              <span className="text-white/35">Gallery</span>
              <ChevronRight size={12} className="text-white/25" />
              <span className="text-[#d7b76d]">{yearInfo?.label}</span>
            </div>
          </div>

          <div className="mt-10 max-w-[900px]">
            <div style={{ animation: 'fadeSlideUp 800ms cubic-bezier(0.22,1,0.36,1) 100ms both' }}>
              <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#f2d48e]">
                <span className="h-px w-10 bg-[#d7b76d]" />
                <Clock size={12} /> Academic year in pictures
              </p>
            </div>
            <h1
              className="font-serif text-[40px] leading-[.96] tracking-[-0.04em] text-white sm:text-[60px] lg:text-[88px] xl:text-[118px]"
              style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 200ms both' }}
            >
              <em className="font-normal text-[#f2d48e]">{yearInfo?.label.split(' ')[0]}</em>
              <span className="text-white/90"> — {yearInfo?.label.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p
              className="mt-5 max-w-[540px] text-[15px] leading-7 text-white/70 sm:mt-7 sm:text-[17px] sm:leading-8"
              style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 350ms both' }}
            >
              Every celebration, milestone, and ordinary-turned-extraordinary moment from the school year.
              A living album of the Pallotti Hill community.
            </p>
          </div>

          <div
            className="mt-12 grid max-w-[720px] grid-cols-3 gap-3 border-t border-white/10 pt-8 sm:mt-14 sm:gap-6 sm:pt-10 lg:gap-10"
            style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 500ms both' }}
          >
            <div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#d7b76d] sm:text-[9px] sm:tracking-[0.2em] sm:gap-2">
                <Layers size={10} className="sm:size-[11px]" /> Categories
              </div>
              <div className="mt-2 font-serif leading-none text-white text-[28px] sm:text-[40px]">
                {categories.length}<span className="text-[#f2d48e] ml-0.5 text-[16px] sm:text-[22px]">+</span>
              </div>
              <p className="mt-2 text-[10px] text-white/40 sm:text-[11px]">Events & celebrations</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#d7b76d] sm:text-[9px] sm:tracking-[0.2em] sm:gap-2">
                <Images size={10} className="sm:size-[11px]" /> Photographs
              </div>
              <div className="mt-2 font-serif leading-none text-white text-[28px] sm:text-[40px]">
                {allPhotos.length}
              </div>
              <p className="mt-2 text-[10px] text-white/40 sm:text-[11px]">Curated memories</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#d7b76d] sm:text-[9px] sm:tracking-[0.2em] sm:gap-2">
                <Clock size={10} className="sm:size-[11px]" /> Status
              </div>
              <div className="mt-2 font-serif leading-none text-white text-[22px] sm:text-[28px]">
                <span className="mr-1.5 inline-block h-2 w-2 translate-y-[-5px] rounded-full bg-[#86c67a] shadow-[0_0_8px_rgba(134,198,122,0.8)] sm:mr-2 sm:h-2.5 sm:w-2.5 sm:translate-y-[-6px]" />
                <span className="text-white">Completed</span>
              </div>
              <p className="mt-2 text-[10px] text-white/40 sm:text-[11px]">Academic year archive</p>
            </div>
          </div>
        </div>
      </section>

      {/* JUMP-TO CHIPS (STICKY) */}
      <div data-jump-chips className="sticky top-[76px] z-30 border-b border-[#cad5d2] bg-[#f6f5f0]/92 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
          <div className="mb-1.5 flex items-center justify-between sm:mb-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#af8742] sm:text-[10px] sm:tracking-[0.2em]">Jump to an event</p>
            <button
              onClick={() => document.getElementById('featured-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#5e757a] transition-colors hover:text-[#173c46] sm:text-[10px] sm:tracking-[0.16em]"
            >
              View as cards ↓
            </button>
          </div>
          <div
            className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 sm:gap-2 sm:pb-1"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x proximity',
              scrollbarWidth: 'thin',
            }}
          >
            {categories.map((c, idx) => {
              const isActive = activeSection === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => scrollToSection(c.slug, idx)}
                  style={{ scrollSnapAlign: 'start' }}
                  className={`group shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 sm:px-4 sm:text-[11px] ${
                    isActive
                      ? 'border-[#173c46] bg-[#173c46] text-[#f2d48e] shadow-md'
                      : 'border-[#b8c9c5] text-[#426069] hover:border-[#af8742] hover:text-[#173c46]'
                  }`}
                >
                  <span className="mr-1 opacity-60">{String(c.photos.length).padStart(2, '0')}</span>
                  {c.name.length > 22 ? c.name.slice(0, 21) + '…' : c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FEATURED CATEGORY CARDS */}
      <section id="featured-cards" className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Explore by event</p>
              <h2 className="mt-3 font-serif text-[32px] leading-[1.04] tracking-[-0.03em] text-[#173c46] sm:mt-4 sm:text-[44px] lg:text-[56px]">
                <em className="font-normal text-[#af8742]">28 moments</em> that made the year.
              </h2>
            </div>
            <p className="max-w-[380px] text-[13px] leading-6 text-[#426069] sm:text-[14px] sm:leading-7">
              Tap a card to jump straight to that chapter in the photo wall.
              Every event tells its own story.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} direction="up" delay={i * 50}>
              <button
                onClick={() => scrollToSection(c.slug, i)}
                className="group relative block h-[180px] w-full overflow-hidden rounded-sm text-left sm:h-[220px]"
              >
                <img
                  src={c.cover}
                  alt={c.name}
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173c46] via-[#173c46]/30 to-transparent transition-opacity duration-400 group-hover:from-[#173c46]" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b76d]">
                    <Images size={11} />
                    {c.photos.length} photos
                  </div>
                  <h3 className="mt-2 font-serif text-[18px] leading-snug text-white">{c.name}</h3>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#f2d48e]">
                    Open chapter <ChevronRight size={11} />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MASONRY PHOTO WALL WITH STICKY HEADERS */}
      <section className="bg-[#e4ebe8] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-12 flex flex-col items-start justify-between gap-3 sm:mb-16 sm:gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">The full photo wall</p>
                <h2 className="mt-3 font-serif text-[32px] leading-[1.04] tracking-[-0.03em] text-[#173c46] sm:mt-4 sm:text-[44px] lg:text-[60px]">
                  Scroll. Click. <em className="font-normal text-[#af8742]">Remember.</em>
                </h2>
              </div>
              <p className="max-w-[360px] text-[13px] leading-6 text-[#426069] sm:text-[14px] sm:leading-7">
                Every photo opens into a full-year slideshow — move between
                events without leaving the lightbox.
              </p>
            </div>
          </Reveal>

          <div className="space-y-14 sm:space-y-20">
            {categories.map((cat, catIdx) => (
              <section
                key={cat.slug}
                id={`cat-${cat.slug}`}
                data-cat-idx={catIdx}
                className="scroll-mt-[190px]"
              >
                {/* STICKY CATEGORY HEADER */}
                <div
                  className="sticky z-10 -mx-4 mb-4 border-y border-[#cad5d2] bg-[#e4ebe8]/96 px-4 py-3 backdrop-blur sm:-mx-6 sm:mb-6 sm:px-6 sm:py-4 lg:top-[138px]"
                  style={{ top: 'calc(76px + 62px)' }}
                >
                  <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-shrink items-center gap-3 sm:gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173c46] font-serif text-[12px] text-[#f2d48e] sm:h-10 sm:w-10 sm:text-[15px]">
                        {String(catIdx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[8px] font-bold uppercase tracking-[0.18em] text-[#af8742] sm:text-[9px] sm:tracking-[0.22em]">
                          Chapter {catIdx + 1} of {categories.length} · {cat.photos.length} photographs
                        </p>
                        <h3 className="mt-0.5 truncate font-serif text-[18px] leading-tight text-[#173c46] sm:mt-1 sm:text-[22px] md:text-[26px] lg:text-[32px]">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!cat.photos.length) return;
                        setLightboxAutoStart(true);
                        setLightboxIndex(cat.photos[0].globalIndex);
                      }}
                      className="group flex shrink-0 items-center gap-1.5 rounded-full border border-[#173c46] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#173c46] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173c46] hover:text-[#f2d48e] sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.16em] sm:gap-2"
                    >
                      Play
                      <span className="hidden sm:inline">slideshow</span>
                      <ChevronRight size={10} className="transition-transform group-hover:translate-x-0.5 sm:size-[12px]" />
                    </button>
                  </div>
                </div>

                {/* MASONRY GRID */}
                <Reveal direction="up" delay={50}>
                  <div className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                    {(() => {
                      const cols = splitIntoColumns(cat.photos, COLUMNS);
                      return cols.map((col, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                          {col.map((photo) => (
                            <LazyImage
                              key={photo.src}
                              src={photo.src}
                              alt={`${photo.category} photo`}
                              aspectRatio="aspect-[4/3]"
                              globalIndex={photo.globalIndex}
                              onClick={() => {
                                setLightboxAutoStart(false);
                                setLightboxIndex(photo.globalIndex);
                              }}
                            />
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </Reveal>

                {/* END OF CATEGORY SEPARATOR */}
                <div className="mt-8 flex items-center gap-3 sm:mt-12 sm:gap-5">
                  <span className="h-px flex-1 bg-[#cad5d2]" />
                  <span className="font-serif text-[10px] uppercase tracking-[0.2em] text-[#8da0a0] sm:text-[11px] sm:tracking-[0.3em]">
                    End of {cat.name}
                  </span>
                  <span className="h-px flex-1 bg-[#cad5d2]" />
                </div>
              </section>
            ))}
          </div>

          {/* FINAL CTA BANNER */}
          <Reveal direction="up" delay={100}>
            <div className="relative mt-16 overflow-hidden rounded-sm bg-[#173c46] px-6 py-12 text-center text-white sm:mt-24 sm:px-14 sm:py-20">
              <img
                src={categories[Math.floor(categories.length / 2)]?.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-10"
                style={{ animation: 'kenBurns 30s ease-in-out infinite alternate' }}
              />
              <div className="relative mx-auto max-w-[700px]">
                <p className="eyebrow text-[#f2d48e]">Thanks for scrolling</p>
                <h3 className="mt-4 font-serif text-[28px] leading-tight text-white sm:mt-5 sm:text-[40px] md:text-[52px]">
                  That's the year <em className="font-normal text-[#f2d48e]">so far.</em>
                </h3>
                <p className="mx-auto mt-4 max-w-[460px] text-[13px] leading-6 text-white/70 sm:mt-5 sm:text-[15px] sm:leading-7">
                  More moments are added as the term unfolds. Come back soon — or start at the beginning and watch it all again.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
                  <button
                    onClick={scrollToTop}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#d7b76d] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#173c46] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2d48e] hover:shadow-xl hover:shadow-[#d7b76d]/30 sm:px-6 sm:py-3.5 sm:text-[11px] sm:gap-2"
                  >
                    <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5 sm:size-[14px]" />
                    Back to the top
                  </button>
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d7b76d] hover:text-[#f2d48e] sm:px-6 sm:py-3.5 sm:text-[11px] sm:gap-2"
                  >
                    <Home size={13} className="sm:size-[14px]" />
                    Return to homepage
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AppFooter />

      {/* FLOATING BACK-TO-TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#173c46]/15 bg-white text-[#173c46] shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105 hover:bg-[#173c46] hover:text-[#f2d48e] sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 lg:h-12 lg:w-12 ${
          showTop ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={17} />
      </button>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={allPhotos}
          index={lightboxIndex}
          startPlaying={lightboxAutoStart}
          onClose={() => {
            setLightboxIndex(null);
            setLightboxAutoStart(false);
          }}
          onNavigate={(next) => {
            setLightboxIndex(next);
          }}
        />
      )}
    </div>
  );
}
