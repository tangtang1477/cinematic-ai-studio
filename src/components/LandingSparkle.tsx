import { motion } from "framer-motion";
import { useMemo } from "react";

interface LandingSparkleProps {
  x: number;
  y: number;
}

/**
 * Particle burst at card landing position.
 * Renders 8 particles radiating outward, white + cyan mix.
 */
const LandingSparkle = ({ x, y }: LandingSparkleProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 60 + Math.random() * 30;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const isCyan = i % 2 === 0;
      return { dx, dy, isCyan, size: 3 + Math.random() * 3 };
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.isCyan
              ? "radial-gradient(circle, rgba(113,240,246,1) 0%, rgba(113,240,246,0) 70%)"
              : "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
            boxShadow: p.isCyan
              ? "0 0 8px rgba(113,240,246,0.8)"
              : "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
};

export default LandingSparkle;
