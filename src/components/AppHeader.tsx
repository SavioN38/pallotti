import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, MoveUpRight, Menu, X, Images } from 'lucide-react';
import { GALLERY_YEARS } from '@/data/gallery';

const navItems = [
  { label: 'About us', href: '#about-us', route: '/' },
  { label: 'Academics', href: '#academics', route: '/' },
  { label: 'Campus life', href: '#campus-life', route: '/' },
  { label: 'Admissions', href: '#admissions', route: '/' },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryHover, setGalleryHover] = useState(false);
  const [galleryLocked, setGalleryLocked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const galleryBtnRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();

  const galleryOpen = galleryLocked || galleryHover;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setGalleryLocked(false);
    setGalleryHover(false);
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      const insideDropdown = dropdownRef.current?.contains(t);
      const insideBtn = galleryBtnRef.current?.contains(t);
      if (!insideDropdown && !insideBtn) {
        setGalleryLocked(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const scrollToHash = (href: string) => {
    if (!href.startsWith('#')) return;
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') return;
    scrollToHash(href);
  };

  const handleGalleryBtnClick = (e: React.MouseEvent) => {
    if (location.pathname.startsWith('/gallery')) return;
    e.preventDefault();
    setGalleryLocked(prev => !prev);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'shadow-lg shadow-[#0d242b]/30' : ''
      }`}
      style={{
        background: menuOpen
          ? 'rgba(23,60,70,0.98)'
          : scrolled
            ? 'rgba(16,45,53,0.94)'
            : 'rgba(23,60,70,0.72)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
        borderBottom: scrolled
          ? '1px solid rgba(215,183,109,0.32)'
          : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 lg:px-10 ${
          scrolled ? 'h-[64px]' : 'h-[80px]'
        }`}
      >
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="Pallotti Hill Public School home">
          <img
            src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/images/school/logo.png`}
            alt="Pallotti Hill Public School logo"
            className={`rounded-full bg-white object-contain shadow-md transition-all duration-500 group-hover:rotate-[360deg] ${
              scrolled ? 'h-9 w-9' : 'h-11 w-11'
            }`}
          />
          <span className="leading-none">
            <span className={`block font-serif tracking-wide text-white transition-all duration-500 ${
              scrolled ? 'text-[16px]' : 'text-[18px]'
            }`}>
              Pallotti Hill
            </span>
            <span className="mt-0.5 block text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[#d7b76d]">
              Public School
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.route + item.href}
              onClick={() => handleNavClick(item.href)}
              className={({ isActive }) =>
                `group relative flex items-center gap-1 text-[13px] font-medium transition-colors ${
                  isActive && location.hash === item.href ? 'text-white' : 'text-white/80 hover:text-white'
                }`
              }
            >
              {item.label}
              {item.label === 'Academics' && (
                <ChevronDown size={14} className="text-white/45 transition-transform group-hover:translate-y-0.5" />
              )}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#f2d48e] transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setGalleryHover(true)}
            onMouseLeave={() => !galleryLocked && setGalleryHover(false)}
          >
            <NavLink
              ref={galleryBtnRef}
              to="/gallery/2025-26"
              onClick={handleGalleryBtnClick}
              className={({ isActive }) =>
                `group flex items-center gap-1 text-[13px] font-medium transition-colors ${
                  isActive || location.pathname.startsWith('/gallery')
                    ? galleryLocked ? 'text-[#f2d48e]' : 'text-white'
                    : galleryLocked
                      ? 'text-[#f2d48e]'
                      : 'text-white/80 hover:text-white'
                }`
              }
              aria-haspopup="true"
              aria-expanded={galleryOpen}
            >
              <Images size={14} className="opacity-70" />
              Gallery
              <ChevronDown
                size={14}
                className="text-white/45 transition-all duration-300"
                style={{ transform: galleryOpen ? 'rotate(180deg)' : 'none', color: galleryLocked ? '#d7b76d' : undefined }}
              />
              <span className="absolute -bottom-1.5 left-0 h-px bg-[#f2d48e] transition-all duration-300" style={{ width: galleryLocked ? '100%' : undefined }} />
            </NavLink>

            <div
              className="absolute left-1/2 top-full mt-3 w-[320px] -translate-x-1/2 rounded-md border border-[#d7b76d]/30 bg-[#0d2228] py-2 shadow-2xl shadow-black/80 transition-all duration-200"
              style={{
                opacity: galleryOpen ? 1 : 0,
                transform: `translate(-50%, ${galleryOpen ? '0px' : '-12px'})`,
                pointerEvents: galleryOpen ? 'auto' : 'none',
              }}
              role="menu"
            >
              <div className="px-5 pb-2 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d7b76d]">Academic year archives</p>
              </div>
              <div className="grid gap-1 px-2 pb-2">
                {GALLERY_YEARS.map((y) => (
                  y.active ? (
                    <NavLink
                      key={y.slug}
                      to={`/gallery/${y.slug}`}
                      onClick={() => setGalleryLocked(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                          isActive
                            ? 'bg-[#d7b76d]/20 text-[#f2d48e] font-semibold'
                            : 'text-white hover:bg-white/10'
                        }`
                      }
                      role="menuitem"
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#d7b76d] shadow-sm shadow-[#d7b76d]/50" />
                        <span className="font-serif text-[15px] font-medium tracking-wide">{y.label}</span>
                      </span>
                      <ChevronDown size={14} className="text-[#d7b76d] opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:rotate-[-90deg] group-hover:opacity-100" />
                    </NavLink>
                  ) : (
                    <div
                      key={y.slug}
                      className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2.5 text-[13px] text-white/60 bg-white/[0.02]"
                      role="menuitem"
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full border border-white/30" />
                        <span className="font-serif text-[15px] tracking-wide text-white/60">{y.label}</span>
                      </span>
                      <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">Coming soon</span>
                    </div>
                  )
                ))}
              </div>
              <div className="border-t border-white/10 px-5 py-2.5 bg-black/20">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7b76d]/90">
                  Tip: Click “Gallery” to keep this menu pinned open
                </p>
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link to="/#contact" className="text-[13px] font-medium text-white/75 transition-colors hover:text-white">Contact</Link>
          <Link
            to="/#admissions"
            onClick={() => handleNavClick('#admissions')}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#d7b76d] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#173c46] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2d48e] hover:shadow-lg hover:shadow-[#d7b76d]/30"
          >
            Visit our school <MoveUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/25 p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 lg:hidden"
        style={{ maxHeight: menuOpen ? '720px' : '0px' }}
      >
        <nav className="border-t border-white/15 px-6 py-5" aria-label="Mobile navigation">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.route + item.href}
                onClick={() => { setMenuOpen(false); handleNavClick(item.href); }}
                className="py-1 text-[15px] font-medium text-white/80 transition-colors hover:text-[#f2d48e]"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 py-3">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d7b76d]">Gallery by year</p>
              <div className="flex flex-col gap-3 pl-1">
                {GALLERY_YEARS.map((y) => (
                  y.active ? (
                    <Link
                      key={y.slug}
                      to={`/gallery/${y.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-0.5 text-[15px] font-medium text-white/80 transition-colors hover:text-[#f2d48e]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7b76d]" />
                      {y.label}
                    </Link>
                  ) : (
                    <span key={y.slug} className="flex items-center gap-3 py-0.5 text-[14px] text-white/30">
                      <span className="h-1.5 w-1.5 rounded-full border border-white/15" />
                      {y.label} <span className="ml-1 rounded-full border border-white/10 px-1.5 py-px text-[9px] font-bold tracking-wider text-white/30">SOON</span>
                    </span>
                  )
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 py-3 sm:hidden">
              <Link to="/#contact" onClick={() => setMenuOpen(false)} className="py-1 text-[15px] font-medium text-white/75 transition-colors hover:text-[#f2d48e]">Contact</Link>
            </div>
            <Link
              to="/#admissions"
              onClick={() => setMenuOpen(false)}
              className="mt-1 w-fit rounded-full bg-[#d7b76d] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#173c46]"
            >
              Visit our school
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
