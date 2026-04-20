import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Template } from "@/data/templates";
import TemplateCard from "./TemplateCard";
import CardBack from "./CardBack";
import LandingSparkle from "./LandingSparkle";

interface FlyingCardsSceneProps {
  templates: Template[];
  onAllSettled: () => void;
}

const CARD_WIDTH = 220;
const CARD_OVERLAP = -16;
const TITLE_TO_CARDS_GAP = 64;
const SIDEBAR_WIDTH = 88;

const CARD_FINAL_TRANSFORMS = [
  { rotate: -12, tx: 36, ty: 18 },
  { rotate: -6, tx: 14, ty: 4 },
  { rotate: 0, tx: 0, ty: -2 },
  { rotate: 6, tx: -14, ty: 4 },
  { rotate: 12, tx: -36, ty: 18 },
];

const START_X_OFFSETS = [-160, -80, 0, 80, 160];
const START_Y = 110;
const DURATION = 1.6;
const STAGGER = 0.06;
const FLIP_HOLD = 0.45;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface SparkleEvent {
  id: number;
  x: number;
  y: number;
}

const FlyingCardsScene = ({ templates, onAllSettled }: FlyingCardsSceneProps) => {
  const [sparkles, setSparkles] = useState<SparkleEvent[]>([]);
  const [settledCount, setSettledCount] = useState(0);
  const sparkleIdRef = useRef(0);

  const layout = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const contentWidth = vw - SIDEBAR_WIDTH;
    const viewportCenterX = SIDEBAR_WIDTH + contentWidth / 2;

    const totalCardsWidth =
      CARD_WIDTH * templates.length + CARD_OVERLAP * (templates.length - 1);
    const fanStartX = SIDEBAR_WIDTH + (contentWidth - totalCardsWidth) / 2;
    const stageTopPx = vh * 0.31;
    const titleHeight = 70;
    const cardsTopY = stageTopPx + titleHeight + TITLE_TO_CARDS_GAP;

    return templates.map((_, i) => {
      const ct = CARD_FINAL_TRANSFORMS[i];
      const startX = viewportCenterX + START_X_OFFSETS[i] - CARD_WIDTH / 2;
      const startY = START_Y;
      const endX = fanStartX + i * (CARD_WIDTH + CARD_OVERLAP) + ct.tx;
      const endY = cardsTopY + ct.ty;
      return {
        startX,
        startY,
        endX,
        endY,
        rotate: ct.rotate,
        zIndex: i === 2 ? 20 : i === 1 || i === 3 ? 10 : 5,
      };
    });
  }, [templates]);

  useEffect(() => {
    if (settledCount >= templates.length) {
      const t = setTimeout(() => onAllSettled(), 250);
      return () => clearTimeout(t);
    }
  }, [settledCount, templates.length, onAllSettled]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[FlyingCardsScene] mounted — animation starting");
  }, []);

  const handleCardComplete = (i: number) => {
    const l = layout[i];
    const x = l.endX + CARD_WIDTH / 2;
    const y = l.endY + (CARD_WIDTH * 4) / 3 / 2;
    const id = ++sparkleIdRef.current;
    setSparkles((prev) => [...prev, { id, x, y }]);
    setSettledCount((c) => c + 1);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 700);
  };

  return (
    <div
      className="cards-scene"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {templates.map((t, i) => {
        const l = layout[i];
        const delay = i * STAGGER;
        return (
          <motion.div
            key={`fly-${t.id}`}
            className="card-wrapper"
            initial={{
              x: l.startX,
              y: l.startY,
              rotate: 0,
              opacity: 0,
              filter: "blur(6px)",
            }}
            animate={{
              x: l.endX,
              y: l.endY,
              rotate: l.rotate,
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: DURATION,
              delay,
              ease: EASE,
              opacity: { duration: 0.5, delay, ease: "easeOut" },
              filter: { duration: 0.7, delay, ease: "easeOut" },
            }}
            onAnimationComplete={() => handleCardComplete(i)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_WIDTH,
              aspectRatio: "3 / 4",
              zIndex: l.zIndex,
              willChange: "transform, opacity, filter",
            }}
          >
            {/* Cyan glow trail */}
            <motion.div
              className="glow-trail"
              initial={{ opacity: 0.85, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.3 }}
              transition={{
                duration: DURATION,
                delay,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "radial-gradient(circle, rgba(113,240,246,0.6) 0%, rgba(113,240,246,0.18) 40%, rgba(113,240,246,0) 70%)",
                filter: "blur(14px)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />

            {/* Per-card 3D stage — isolates perspective from outer 2D matrix */}
            <div
              className="card-3d-stage"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Inner — handles rotateY + scale (true 3D) */}
              <motion.div
                className="card-inner"
                initial={{ rotateY: 180, scale: 0.3 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{
                  rotateY: {
                    duration: DURATION - FLIP_HOLD,
                    delay: delay + FLIP_HOLD,
                    ease: EASE,
                  },
                  scale: {
                    duration: DURATION,
                    delay,
                    ease: EASE,
                  },
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                {/* Front */}
                <div
                  className="card-front"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow:
                      "0 20px 50px -12px rgba(0,0,0,0.55), 0 0 24px rgba(113,240,246,0.15)",
                  }}
                >
                  <TemplateCard template={t} onTry={() => {}} noOverlay />
                </div>

                {/* Back */}
                <div
                  className="card-back"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow:
                      "0 20px 50px -12px rgba(0,0,0,0.55), 0 0 24px rgba(113,240,246,0.25)",
                  }}
                >
                  <CardBack />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Landing sparkles */}
      {sparkles.map((s) => (
        <LandingSparkle key={s.id} x={s.x} y={s.y} />
      ))}
    </div>
  );
};

export default FlyingCardsScene;
