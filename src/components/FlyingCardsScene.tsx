import { useEffect, useMemo, useRef, useState } from "react";
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

// Aideo Studio mirrored timing
const TRANSFORM_DURATION = 2.4; // s — wrapper translate + inner scale
const OPACITY_DURATION = 1.6;   // s
const OPACITY_DELAY = 0.2;      // s — opacity starts later → "fly first, reveal after"
const FLIP_DURATION = 1.4;      // s
const FLIP_DELAY = 0.6;         // s — back visible for first 0.6s
const STAGGER = 0.05;           // s
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

interface SparkleEvent {
  id: number;
  x: number;
  y: number;
}

const FlyingCardsScene = ({ templates, onAllSettled }: FlyingCardsSceneProps) => {
  const [sparkles, setSparkles] = useState<SparkleEvent[]>([]);
  const [animateIn, setAnimateIn] = useState(false);
  const sparkleIdRef = useRef(0);
  const settledCountRef = useRef(0);

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

  // Mount with source state, then on next frame switch to target → CSS transitions fire
  useEffect(() => {
    // double rAF for guaranteed paint of initial state before transition
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        // eslint-disable-next-line no-console
        console.log("[FlyingCardsScene] triggering CSS fly-out (Aideo mirror, 2.4s)");
        setAnimateIn(true);
      });
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  const handleWrapperTransitionEnd = (i: number, e: React.TransitionEvent<HTMLDivElement>) => {
    // Only react to the wrapper's transform transition (longest one)
    if (e.propertyName !== "transform") return;
    if (e.currentTarget !== e.target) return;

    const l = layout[i];
    const x = l.endX + CARD_WIDTH / 2;
    const y = l.endY + (CARD_WIDTH * 4) / 3 / 2;
    const id = ++sparkleIdRef.current;
    setSparkles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 700);

    settledCountRef.current += 1;
    if (settledCountRef.current >= templates.length) {
      setTimeout(() => onAllSettled(), 200);
    }
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

        // Wrapper translates from start → end
        const wrapperTransform = animateIn
          ? `translate3d(${l.endX}px, ${l.endY}px, 0) rotate(${l.rotate}deg)`
          : `translate3d(${l.startX}px, ${l.startY}px, 0) rotate(0deg)`;

        // Inner scales + flips
        const innerTransform = animateIn
          ? `scale(1) rotateY(0deg)`
          : `scale(0.05) rotateY(180deg)`;

        return (
          <div
            key={`fly-${t.id}`}
            className="card-wrapper"
            onTransitionEnd={(e) => handleWrapperTransitionEnd(i, e)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_WIDTH,
              aspectRatio: "3 / 4",
              zIndex: l.zIndex,
              transform: wrapperTransform,
              opacity: animateIn ? 1 : 0,
              willChange: "transform, opacity",
              transition: [
                `transform ${TRANSFORM_DURATION}s ${EASE} ${delay}s`,
                `opacity ${OPACITY_DURATION}s ease ${delay + OPACITY_DELAY}s`,
              ].join(", "),
            }}
          >
            {/* Per-card 3D stage */}
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
              {/* Inner — scale + rotateY */}
              <div
                className="card-inner"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  transform: innerTransform,
                  transition: [
                    `transform ${TRANSFORM_DURATION}s ${EASE} ${delay}s`,
                    // override rotateY-portion with its own delayed timing via second transform? Not possible —
                    // so we keep one combined transform on inner. To get the "back visible 0.6s" effect,
                    // we instead split: scale stays on inner, rotateY moves to its own child.
                  ].join(", "),
                }}
              >
                {/* Flip layer — only handles rotateY with delayed start */}
                <div
                  className="card-flip"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    transform: animateIn ? "rotateY(0deg)" : "rotateY(180deg)",
                    transition: `transform ${FLIP_DURATION}s ${EASE} ${delay + FLIP_DELAY}s`,
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
                </div>
              </div>
            </div>
          </div>
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
