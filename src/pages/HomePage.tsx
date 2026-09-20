import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  CircleArrowOutUpRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Heart,
  Lightbulb,
  MapPin,
  MoveUpRight,
  Music,
  Palette,
  Phone,
  Sparkles,
  Trophy,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { StatCounter } from '@/components/StatCounter';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

const highlights = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Learning with purpose',
    text: 'A thoughtful, well-rounded curriculum that prepares children to think clearly and live generously.',
  },
  {
    icon: Users,
    number: '02',
    title: 'A place to belong',
    text: 'A close-knit school community where every child is known, encouraged, and celebrated.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Room to become',
    text: 'The confidence to discover new passions, ask better questions, and make a difference.',
  },
];

const stats = [
  { target: 30, suffix: '+', label: 'Years of excellence' },
  { target: 850, suffix: '', label: 'Students enrolled' },
  { target: 45, suffix: '+', label: 'Expert educators' },
  { target: 100, suffix: '%', label: 'Board pass rate' },
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const campusLifeCards = [
  {
    img: `${base}/images/classrooms_that_spark_curiosity.jpeg`,
    alt: 'Classrooms that spark curiosity',
    tag: 'Academics',
    title: 'Classrooms that spark curiosity',
  },
  {
    img: `${base}/images/athletics_and_teamwork.jpeg`,
    alt: 'Athletics & teamwork',
    tag: 'Sport',
    title: 'Athletics & teamwork',
  },
  {
    img: `${base}/images/creative_expression.jpg`,
    alt: 'Creative expression',
    tag: 'Arts',
    title: 'Creative expression',
  },
  {
    img: `${base}/images/learning_for_tomorrow.jpg`,
    alt: 'Learning for tomorrow',
    tag: 'Technology',
    title: 'Learning for tomorrow',
  },
];

const activities = [
  { icon: Palette, title: 'Visual Arts', text: 'Painting, sculpture, and craft studios where imagination takes shape.' },
  { icon: Music, title: 'Music & Performance', text: 'Choir, band, and stage performances that build confidence.' },
  { icon: Trophy, title: 'Sports & Wellness', text: 'Cricket, football, athletics, and yoga for healthy bodies and minds.' },
  { icon: Lightbulb, title: 'Clubs & Societies', text: 'Science club, debate, robotics, eco-club, and more to explore.' },
];

const events = [
  { date: '24', month: 'JUN', title: 'New parent orientation', type: 'Community' },
  { date: '04', month: 'JUL', title: 'Independence Day programme', type: 'School event' },
  { date: '12', month: 'JUL', title: 'Inter-house athletics meet', type: 'Sport' },
  { date: '20', month: 'JUL', title: 'Annual art exhibition', type: 'Arts' },
];

const testimonials = [
  {
    quote: "Being a Pallottine is that which helps me grow into the person I'm. I have great memories, good and bad, a lot of learning experiences and some that I'll take with me the rest of my life. I'm forever grateful to this institution for laying a strong foundation in me to build my career and life upon.",
    name: 'CYRIL MATHEW',
    role: 'DOCTOR',
  },
  {
    quote: 'Pallotti Hill Public School provided me with the environment and moral values to aim high and achieve my dreams. The teachers were constantly supportive and guided me at every step.',
    name: 'ANJALI KURUP',
    role: 'ENGINEER',
  },
  {
    quote: 'My school life at Pallotti Hill shaped my character, instilled discipline, and gave me confidence to face the world. Truly a second home for all of us.',
    name: 'ARJUN THOMAS',
    role: 'ALUMNUS, CLASS OF 2020',
  },
];

const HERO_START_POINTS = [6, 14, 31, 57, 90]; // 00:06, 00:14, 00:31, 00:57, 1:30

export function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const chosenPoint = HERO_START_POINTS[Math.floor(Math.random() * HERO_START_POINTS.length)];
      video.currentTime = chosenPoint;
      video.play().catch(() => {});
    };

    const handleSeekedOrCanPlay = () => {
      setVideoReady(true);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    video.addEventListener('seeked', handleSeekedOrCanPlay);
    video.addEventListener('playing', handleSeekedOrCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeekedOrCanPlay);
      video.removeEventListener('playing', handleSeekedOrCanPlay);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f5f0] text-[#173c46]">
      <AppHeader />

      <main id="top">
        <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-[#173c46] pb-16 pt-28 sm:min-h-[100vh] sm:pb-20 sm:pt-32 lg:pb-28">
          {/* POSTER FALLBACK / INITIAL LOAD */}
          <img
            src={`${base}/images/school/school.png`}
            alt="Pallotti Hill Public School campus"
            className={`absolute inset-0 -z-10 h-full w-full object-cover object-center transition-opacity duration-1000 ${
              videoReady ? 'opacity-0' : 'opacity-100'
            }`}
            fetchPriority="high"
          />

          {/* HERO BACKGROUND VIDEO */}
          <video
            ref={videoRef}
            src={`${base}/videos/campus_hero.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 -z-10 h-full w-full object-cover object-center transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(13,43,51,.88)_0%,rgba(19,58,67,.6)_43%,rgba(19,58,67,.08)_100%)]" />
          <div className="absolute inset-0 -z-[4] bg-[linear-gradient(0deg,rgba(10,35,42,.7)_0%,transparent_55%)]" />

          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-10">
            <div className="max-w-[700px] text-white">
              <div style={{ animation: 'fadeSlideUp 800ms cubic-bezier(0.22,1,0.36,1) both' }}>
                <p className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2d48e] sm:mb-6 sm:gap-3 sm:text-[11px] sm:tracking-[0.25em]">
                  <span className="h-px w-6 bg-[#f2d48e] sm:w-8" />Growing minds. Good hearts.
                </p>
              </div>
              <h1
                className="font-serif text-[40px] leading-[.98] tracking-[-0.035em] sm:text-[54px] lg:text-[72px] xl:text-[92px]"
                style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 150ms both' }}
              >
                A school for <em className="font-normal text-[#f2d48e]">every</em> possibility.
              </h1>
              <p
                className="mt-5 max-w-[470px] text-[14px] leading-6 text-white/80 sm:mt-7 sm:text-[16px] sm:leading-7"
                style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 300ms both' }}
              >
                A joyful, inclusive learning community where children find their voice, discover their strengths, and step confidently into the world.
              </p>
              <div
                className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4"
                style={{ animation: 'fadeSlideUp 900ms cubic-bezier(0.22,1,0.36,1) 450ms both' }}
              >
                <a href="#admissions" className="group inline-flex items-center gap-2 rounded-full bg-[#d7b76d] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#173c46] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2d48e] hover:shadow-xl hover:shadow-[#d7b76d]/40 sm:px-6 sm:py-4 sm:text-[12px] sm:gap-3 sm:tracking-[0.13em]">
                  Begin your journey <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 sm:size-[16px]" />
                </a>
                <a href="#about-us" className="group inline-flex items-center gap-1.5 px-2 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 transition-colors hover:text-[#f2d48e] sm:gap-2 sm:px-3 sm:text-[12px] sm:tracking-[0.13em]">
                  Discover Pallotti Hill
                  <CircleArrowOutUpRight size={14} className="transition-transform duration-300 group-hover:rotate-12 sm:size-[16px]" />
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-7 right-6 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 lg:flex lg:right-10">
            <span className="block h-10 w-px bg-white/40" style={{ animation: 'scrollHint 2s ease-in-out infinite' }} />
            Scroll to explore
          </div>
        </section>

        <section className="bg-[#173c46] px-5 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-12">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} target={stat.target} suffix={stat.suffix} label={stat.label} delay={i * 120} />
            ))}
          </div>
        </section>

        <section id="about-us" className="mx-auto max-w-[1400px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] sm:gap-12 lg:gap-24">
            <Reveal direction="right">
              <p className="eyebrow">The Pallotti Hill difference</p>
              <h2 className="mt-4 max-w-[430px] font-serif text-[30px] leading-[1.04] tracking-[-0.03em] text-[#173c46] sm:mt-5 sm:text-[44px] lg:text-[58px]">
                Where learning feels like <em className="font-normal text-[#af8742]">belonging.</em>
              </h2>
            </Reveal>
            <Reveal direction="left" delay={150}>
              <div className="max-w-[580px] lg:pt-12">
                <p className="text-[15px] leading-7 text-[#426069] sm:text-[19px] sm:leading-8">
                  At Pallotti Hill, we believe the best education starts with a simple feeling: I am seen here. Our students learn in an environment that is ambitious, caring, and full of possibility.
                </p>
                <a href="#academics" className="group mt-6 inline-flex items-center gap-2 border-b border-[#af8742] pb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#173c46] transition-colors hover:text-[#af8742] sm:mt-8 sm:text-[12px] sm:tracking-[0.14em]">
                  Our approach to learning <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 sm:size-[15px]" />
                </a>
              </div>
            </Reveal>
          </div>

          <div id="academics" className="mt-14 grid border-t border-[#cad5d2] sm:mt-20 md:grid-cols-3">
            {highlights.map(({ icon: Icon, number, title, text }, index) => (
              <Reveal key={title} direction="up" delay={index * 150} as="article">
                <article className={`group h-full py-7 px-1 transition-colors duration-300 hover:bg-white/50 sm:py-8 md:px-8 ${index !== 0 ? 'border-t border-[#cad5d2] md:border-l md:border-t-0' : 'md:pl-0'}`}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cad5d2] text-[#af8742] transition-all duration-500 group-hover:scale-110 group-hover:border-[#d7b76d] group-hover:bg-[#d7b76d]/10 sm:h-14 sm:w-14">
                      <Icon size={20} strokeWidth={1.4} className="sm:size-[24px]" />
                    </span>
                    <span className="font-serif text-sm text-[#af8742]">{number}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-[22px] text-[#173c46] sm:mt-10 sm:text-[25px]">{title}</h3>
                  <p className="mt-3 max-w-[300px] text-[13px] leading-6 text-[#5e757a] sm:text-[14px]">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="campus-life" className="bg-[#e4ebe8] px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <Reveal>
              <div className="flex flex-col items-start justify-between gap-4 sm:gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow">More than a classroom</p>
                  <h2 className="mt-3 font-serif text-[30px] leading-[1.04] tracking-[-0.03em] text-[#173c46] sm:mt-4 sm:text-[44px] lg:text-[60px]">
                    Come curious.<br /><em className="font-normal text-[#af8742]">Leave inspired.</em>
                  </h2>
                </div>
                <p className="max-w-[400px] text-[13px] leading-6 text-[#426069] sm:text-[15px] sm:leading-7">
                  From the first hello at the gate to the final bell, our campus is a place where friendships flourish, questions are welcomed, and there is always something new to try.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {campusLifeCards.map((card, index) => (
                <Reveal key={card.title} direction="up" delay={index * 120}>
                  <article className="group relative h-[260px] overflow-hidden rounded-sm sm:h-[320px]">
                    <img
                      src={card.img}
                      alt={card.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#173c46]/90 via-[#173c46]/20 to-transparent transition-opacity duration-500 group-hover:from-[#173c46]/95" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block rounded-full bg-[#d7b76d] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#173c46]">{card.tag}</span>
                      <h3 className="mt-3 font-serif text-xl text-white">{card.title}</h3>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.03fr_.97fr] sm:gap-12 lg:gap-24">
            <Reveal direction="right">
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src={`${base}/images/school/school_no_sky.png`}
                  alt="The Pallotti Hill school building"
                  className="h-[300px] w-full object-cover object-center transition-transform duration-700 hover:scale-105 lg:h-[540px] sm:h-[400px]"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-[#f6f5f0] px-4 py-3 sm:bottom-5 sm:left-5 sm:px-5 sm:py-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#af8742] sm:text-[10px] sm:tracking-[0.18em]">Our campus</p>
                  <p className="mt-0.5 font-serif text-[15px] text-[#173c46] sm:text-lg">A place to grow, together.</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={150}>
              <div>
                <p className="eyebrow">Activities & beyond</p>
                <h2 className="mt-4 font-serif text-[30px] leading-[1.04] tracking-[-0.03em] text-[#173c46] sm:mt-5 sm:text-[42px] lg:text-[52px]">
                  Education that extends <em className="font-normal text-[#af8742]">far beyond</em> the classroom.
                </h2>
                <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
                  {activities.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="group">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173c46] text-[#f2d48e] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#d7b76d] group-hover:text-[#173c46]">
                        <Icon size={20} strokeWidth={1.5} />
                      </span>
                      <h3 className="mt-4 font-serif text-lg text-[#173c46]">{title}</h3>
                      <p className="mt-1.5 text-[13px] leading-5 text-[#5e757a]">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="events" className="mx-auto max-w-[1400px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 border-b border-[#cad5d2] pb-5 sm:gap-5 sm:pb-7 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">What's happening</p>
                <h2 className="mt-3 font-serif text-[30px] leading-none tracking-[-0.03em] text-[#173c46] sm:mt-4 sm:text-[44px]">School calendar</h2>
              </div>
              <a href="#contact" className="group inline-flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[#173c46] hover:text-[#af8742] sm:text-[12px] sm:tracking-[0.14em]">
                View all events <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 sm:size-[15px]" />
              </a>
            </div>
          </Reveal>

          <div className="divide-y divide-[#cad5d2]">
            {events.map((event, index) => (
              <Reveal key={event.title} direction="left" delay={index * 80}>
                <a href="#contact" className="group grid items-center gap-4 py-5 transition-transform duration-300 hover:translate-x-2 sm:gap-5 sm:py-6 md:grid-cols-[110px_1fr_auto] md:gap-10">
                  <div className="flex items-center gap-3 text-[#af8742]">
                    <CalendarDays size={16} strokeWidth={1.5} className="sm:size-[18px]" />
                    <span className="font-serif text-[26px] sm:text-3xl">{event.date}</span>
                    <span className="text-[9px] font-bold tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">{event.month}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#af8742] sm:text-[10px] sm:tracking-[0.18em]">{event.type}</p>
                    <h3 className="mt-1 font-serif text-[20px] text-[#173c46] sm:text-[24px]">{event.title}</h3>
                  </div>
                  <ArrowRight size={16} className="text-[#af8742] transition-transform duration-300 group-hover:translate-x-2 sm:size-[19px]" />
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* St. Vincent Pallotti - Founder & Inspiration */}
        <section id="founder" className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1250px]">
            <div className="grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
              <Reveal direction="right">
                <div className="relative mx-auto max-w-[340px] overflow-hidden rounded-lg border-8 border-[#173c46] shadow-2xl shadow-[#173c46]/20">
                  <img
                    src={`${base}/images/st_vincent_pallotti.jpg`}
                    alt="St. Vincent Pallotti - Founder & Inspiration"
                    className="h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
                </div>
              </Reveal>

              <Reveal direction="left" delay={150}>
                <div>
                  <p className="eyebrow text-[#af8742]">St. Vincent Pallotti</p>
                  <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-[#173c46] sm:text-[42px] lg:text-[50px]">
                    OUR FOUNDER & INSPIRATION
                  </h2>
                  <div className="mt-6 space-y-4 text-[15px] leading-7 text-[#426069] sm:text-[16px] sm:leading-8">
                    <p>
                      St. Vincent Pallotti was a Catholic priest who founded the Society of the Catholic Apostolate (SAC), commonly known as the Pallottines, around 150 years ago. Born on April 21, 1795, Pallotti was canonized in 1963.
                    </p>
                    <p>
                      His commitment to his apostolate led him to start orphanages, night schools and technical institutions that exist even today. Besides, he had special compassion for prisoners, soldiers and the sick. He was also the spiritual director of several Roman Colleges.
                    </p>
                    <p>
                      The society founded by Pallotti has numerous institutions in 46 countries across the globe. In India, the Pallottines have premier educational as well as institutions of higher learning in Maharashtra, Goa, Chhattisgarh, Madhya Pradesh, Delhi, Jharkhand, Bihar, Tamil Nadu, Karnataka and Kerala. The Malabar Marian Trust which manages Pallotti Hill Public School, is a part of this International Society.
                    </p>
                  </div>
                  <div className="mt-8">
                    <a
                      href="#about-us"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-[#af8742] px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d7b76d] hover:text-[#173c46] hover:shadow-xl"
                    >
                      Read More <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Meet The Team Section */}
        <section id="mentors" className="bg-[#f6f5f0] px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28 border-t border-[#cad5d2]">
          <div className="mx-auto max-w-[1300px]">
            <Reveal>
              <div className="text-center">
                <p className="eyebrow text-[#af8742]">THE MENTORS</p>
                <h2 className="mt-3 font-serif text-[34px] font-bold tracking-tight text-[#173c46] sm:text-[46px] lg:text-[56px]">
                  MEET THE TEAM
                </h2>
                <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-6 text-[#5e757a] sm:text-[17px]">
                  The Team behind Pallotti Hill, dedicated to equip the children to Lead the World
                </p>
                <div className="mt-6 flex justify-center">
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#d7b76d] px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#173c46] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2d48e] hover:shadow-xl"
                  >
                    Learn More About Us <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-12 overflow-hidden rounded-xl border border-[#cad5d2] bg-white p-3 shadow-2xl shadow-[#173c46]/10 sm:p-5">
                <div className="mb-4 bg-[#f1ede4] py-4 text-center rounded-t-lg border-b border-[#e2dad0]">
                  <h3 className="font-serif text-[22px] font-bold tracking-widest text-[#173c46] sm:text-[32px]">
                    PALLOTTI HILL PUBLIC SCHOOL
                  </h3>
                </div>
                <div className="relative overflow-hidden rounded-b-lg">
                  <img
                    src={`${base}/images/meet_team.jpeg`}
                    alt="Pallotti Hill Public School Teachers and Staff Team"
                    className="w-full object-cover rounded-lg shadow-inner"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Alumni Speak Section */}
        <section className="relative overflow-hidden bg-[#173c46] px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28 border-b-8 border-[#f6f5f0]">
          <img
            src={`${base}/images/alumni_speak_bg.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#173c46] via-[#173c46]/90 to-[#173c46]/60" />

          <div className="relative mx-auto max-w-[950px] text-center">
            <Reveal>
              <p className="eyebrow text-[#f2d48e]">OUR EX STUDENTS</p>
              <h2 className="mt-3 font-serif text-[32px] font-bold tracking-tight text-white sm:text-[46px] lg:text-[56px]">
                ALUMNI SPEAK
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative mt-10 min-h-[220px] sm:mt-12 sm:min-h-[190px]">
                {testimonials.map((t, index) => (
                  <div
                    key={t.name}
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      opacity: activeTestimonial === index ? 1 : 0,
                      transform: activeTestimonial === index ? 'translateY(0)' : 'translateY(30px)',
                      pointerEvents: activeTestimonial === index ? 'auto' : 'none',
                    }}
                  >
                    <p className="font-serif text-[16px] leading-8 text-white/95 sm:text-[20px] sm:leading-9 lg:text-[24px] lg:leading-10">
                      "{t.quote}"
                    </p>
                    <div className="mt-6 sm:mt-8">
                      <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#f2d48e] sm:text-[15px]">
                        {t.name}, {t.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="mt-8 flex justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className="h-2.5 rounded-full transition-all duration-400"
                  style={{
                    width: activeTestimonial === index ? '32px' : '10px',
                    background: activeTestimonial === index ? '#d7b76d' : 'rgba(255,255,255,0.3)',
                  }}
                  aria-label={`Show alumni quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="admissions" className="relative overflow-hidden bg-[#173c46] px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <img
            src="https://images.pexels.com/photos/8199671/pexels-photo-8199671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-15"
            loading="lazy"
            style={{ animation: 'kenBurns 25s ease-in-out infinite alternate' }}
          />
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_auto]">
            <Reveal direction="right">
              <div>
                <p className="eyebrow text-[#f2d48e]">Start your story</p>
                <h2 className="mt-4 max-w-[700px] font-serif text-[30px] leading-[1.02] tracking-[-0.03em] sm:mt-5 sm:text-[47px] lg:text-[66px]">
                  The next chapter begins <em className="font-normal text-[#f2d48e]">here.</em>
                </h2>
                <p className="mt-4 max-w-[500px] text-[14px] leading-6 text-white/70 sm:mt-5 sm:text-[16px] sm:leading-7">
                  Discover a school community built around your child's potential. We would love to show you around.
                </p>
              </div>
            </Reveal>
            <Reveal direction="scale" delay={200}>
              <a href="#contact" className="group flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border border-[#d7b76d] text-center transition-all duration-500 hover:scale-105 hover:bg-[#d7b76d] hover:text-[#173c46] sm:h-36 sm:w-36">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.14em]">Book a visit</span>
                <ArrowRight size={15} className="mt-2 transition-transform group-hover:translate-x-1 sm:size-[18px] sm:mt-3" />
              </a>
            </Reveal>
          </div>
        </section>

        <AppFooter />
      </main>
    </div>
  );
}
