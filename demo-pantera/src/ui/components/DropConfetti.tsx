import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export function DropConfetti({ active, onComplete }: { active: boolean, onComplete: () => void }) {
  const [drops, setDrops] = useState<{ id: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    if (active) {
      // Generar 20 gotas
      const newDrops = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setDrops(newDrops);

      const timer = setTimeout(() => {
        setDrops([]);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || drops.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="absolute top-[-10%] text-2xl animate-confetti-fall"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            color: '#38bdf8' // sky-400
          }}
        >
          💧
        </div>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
