import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type StatCounterProps = {
  target: number;
  suffix?: string;
  label: string;
  delay?: number;
};

export function StatCounter({ target, suffix = '', label, delay = 0 }: StatCounterProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const value = useCountUp(target, 2000, visible);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="font-serif text-5xl text-[#f2d48e] lg:text-6xl">
        {value}
        <span className="text-[#d7b76d]">{suffix}</span>
      </div>
      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">{label}</div>
    </div>
  );
}
