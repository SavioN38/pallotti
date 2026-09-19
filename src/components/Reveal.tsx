import { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

const hiddenStyles: Record<Direction, CSSProperties> = {
  up: { opacity: 0, transform: 'translateY(48px)' },
  down: { opacity: 0, transform: 'translateY(-48px)' },
  left: { opacity: 0, transform: 'translateX(48px)' },
  right: { opacity: 0, transform: 'translateX(-48px)' },
  scale: { opacity: 0, transform: 'scale(0.92)' },
  fade: { opacity: 0 },
};

type RevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
        ...(visible ? { opacity: 1, transform: 'none' } : hiddenStyles[direction]),
      }}
    >
      {children}
    </Tag>
  );
}
