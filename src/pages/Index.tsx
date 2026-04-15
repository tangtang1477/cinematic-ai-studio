import { useState, useCallback, useRef, useEffect, type CSSProperties } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";

type Phase = "intro" | "loop" | "cards-fly" | "ready";
type FlyStage = "hidden" | "origin" | "moving" | "settled";

type FlyMetrics = {
  originTop: number;
  originLeft: number;
  destTop: number;
  destLeft: number;
};

const CARD_WIDTH = 220;
const CARD_OVERLAP = -16;
const TITLE_TO_CARDS_GAP = 64;
const PANEL_TO_TITLE_GAP = 64;
const CARD_FINAL_TRANSFORMS = [
  { rotate: -8, tx: 20, ty: 10 },
  { rotate: -3, tx: 6, ty: 0 },
  { rotate: 3, tx: -6, ty: 0 },
  { rotate: 8, tx: -20, ty: 10 },
];
const FALLBACK_FLY_METRICS: FlyMetrics = {
  originTop: 170,
  originLeft: 680,
  destTop: 520,
  destLeft: 680,
};

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [flyStage, setFlyStage] = useState<FlyStage>("hidden");
  const [panelHeight, setPanelHeight] = useState(156);
  const [flyMetrics, setFlyMetrics] = useState<FlyMetrics>(FALLBACK_FLY_METRICS);

  const loopPlayCount = useRef(0);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelWrapRef = useRef<HTMLDivElement>(null);
  const landingGuideRef = useRef<HTMLDivElement>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const clearScheduledTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    setShowPanel(true);
  }, []);

  const updateMeasuredLayout = useCallback(() => {
    const rootEl = rootRef.current;
    const panelEl = panelWrapRef.current;
    const landingEl = landingGuideRef.current;

    if (!rootEl || !panelEl || !landingEl) return;

    const rootRect = rootEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    const landingRect = landingEl.getBoundingClientRect();
    const nextPanelHeight = Math.ceil(panelRect.height);

    if (nextPanelHeight > 0) {
      setPanelHeight(nextPanelHeight);
    }

    const nextMetrics: FlyMetrics = {
      originTop: panelRect.top - rootRect.top + panelRect.height - 28,
      originLeft: panelRect.left - rootRect.left + panelRect.width / 2,
      destTop: landingRect.top - rootRect.top + landingRect.height / 2,
      destLeft: landingRect.left - rootRect.left + landingRect.width / 2,
    };

    setFlyMetrics((prev) => {
      const unchanged =
        Math.abs(prev.originTop - nextMetrics.originTop) < 1 &&
        Math.abs(prev.originLeft - nextMetrics.originLeft) < 1 &&
        Math.abs(prev.destTop - nextMetrics.destTop) < 1 &&
        Math.abs(prev.destLeft - nextMetrics.destLeft) < 1;

      return unchanged ? prev : nextMetrics;
    });
  }, []);

  const handleIntroEnded = useCallback(() => {
    setPhase("loop");
    loopPlayCount.current = 0;
  }, []);

  const handleLoopEnded = useCallback(() => {
    loopPlayCount.current += 1;

    if (loopPlayCount.current === 1) {
      clearScheduledTimers();
      updateMeasuredLayout();
      setPhase("cards-fly");
      setFlyStage("origin");

      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          updateMeasuredLayout();
          setFlyStage("moving");
        }, 90),
      );

      timeoutIdsRef.current.push(
        window.setTimeout(() => {
          setFlyStage("settled");
          setPhase("ready");
        }, 1500),
      );
    }

    loopVideoRef.current?.play();
  }, [clearScheduledTimers, updateMeasuredLayout]);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "intro") return;

    const frameId = window.requestAnimationFrame(updateMeasuredLayout);
    const handleResize = () => updateMeasuredLayout();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      updateMeasuredLayout();
    });

    if (rootRef.current) resizeObserver.observe(rootRef.current);
    if (panelWrapRef.current) resizeObserver.observe(panelWrapRef.current);
    if (landingGuideRef.current) resizeObserver.observe(landingGuideRef.current);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [phase, showPanel, updateMeasuredLayout]);

  useEffect(() => {
    return () => {
      clearScheduledTimers();
    };
  }, [clearScheduledTimers]);

  const isIntro = phase === "intro";
  const showFlyingLayer = flyStage === "origin" || flyStage === "moving";
  const showLandedLayer = flyStage === "settled";
  const stageTop = showPanel ? `${panelHeight + PANEL_TO_TITLE_GAP}px` : "31%";

  const getBaseCardStyle = (index: number): CSSProperties => ({
    width: `${CARD_WIDTH}px`,
    marginLeft: index === 0 ? 0 : `${CARD_OVERLAP}px`,
    zIndex: index === 1 || index === 2 ? 10 : 5,
    transformStyle: "preserve-3d",
  });

  const getFanPositionStyle = (index: number): CSSProperties => {
    const cardTransform = CARD_FINAL_TRANSFORMS[index];

    return {
      ...getBaseCardStyle(index),
      transform: `translate3d(${cardTransform.tx}px, ${cardTransform.ty}px, 0) rotate(${cardTransform.rotate}deg)`,
      transformOrigin: "bottom center",
    };
  };

  const getFlyingCardStyle = (index: number): CSSProperties => {
    const delay = index * 55;
    const cardTransform = CARD_FINAL_TRANSFORMS[index];

    if (flyStage === "origin") {
      return {
        ...getBaseCardStyle(index),
        transform: `scale(0.06) rotateY(145deg) rotateX(16deg) rotateZ(${(index - 1.5) * 8}deg)`,
        opacity: 0.16,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        willChange: "transform, opacity",
        transition: "none",
      };
    }

    return {
      ...getBaseCardStyle(index),
      transform: `translate3d(${cardTransform.tx}px, ${cardTransform.ty}px, 0) rotate(${cardTransform.rotate}deg) scale(1) rotateY(0deg) rotateX(0deg)`,
      opacity: 1,
      transformOrigin: "bottom center",
      backfaceVisibility: "hidden",
      willChange: "transform, opacity",
      transition: `transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.4s ease-out ${delay}ms`,
    };
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AppSidebar />

      <div ref={rootRef} className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <video
            ref={introVideoRef}
            src="/videos/intro.mp4"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: phase === "intro" ? 1 : 0 }}
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnded}
          />
          <video
            ref={loopVideoRef}
            src="/videos/loop.mp4"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: phase !== "intro" ? 1 : 0 }}
            muted
            playsInline
            onEnded={handleLoopEnded}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div
            ref={panelWrapRef}
            className="absolute inset-x-0 top-0 z-30"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              transition: "opacity 0.45s ease-out, transform 0.45s ease-out",
            }}
          >
            <CreationPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              duration={duration}
              onDurationChange={setDuration}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              voiceover={voiceover}
              onVoiceoverChange={setVoiceover}
            />
          </div>

          {isIntro ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <HeroSection phase={phase} />
            </div>
          ) : (
            <div
              className="absolute inset-x-0 z-10 flex flex-col items-center"
              style={{
                top: stageTop,
                transition: "top 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: "none",
              }}
            >
              <HeroSection phase={phase} />

              <div
                aria-hidden="true"
                style={{
                  marginTop: `${TITLE_TO_CARDS_GAP}px`,
                  height: 0,
                  overflow: "visible",
                  visibility: "hidden",
                }}
              >
                <div ref={landingGuideRef} className="flex items-end justify-center">
                  {templates.map((template, index) => (
                    <div key={`${template.id}-guide`} style={getFanPositionStyle(index)}>
                      <div style={{ aspectRatio: "3 / 4", width: "100%" }} />
                    </div>
                  ))}
                </div>
              </div>

              {showLandedLayer && (
                <div style={{ marginTop: `${TITLE_TO_CARDS_GAP}px`, pointerEvents: "auto" }}>
                  <div className="flex items-end justify-center">
                    {templates.map((template, index) => (
                      <div key={template.id} style={getFanPositionStyle(index)}>
                        <div className="transition-transform duration-300 ease-out hover:-translate-y-5 hover:rotate-0">
                          <TemplateCard template={template} onTry={handleTry} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showFlyingLayer && (
            <div
              className="pointer-events-none absolute z-20"
              style={{
                top: `${flyStage === "origin" ? flyMetrics.originTop : flyMetrics.destTop}px`,
                left: `${flyStage === "origin" ? flyMetrics.originLeft : flyMetrics.destLeft}px`,
                transform: "translate(-50%, -50%)",
                transition:
                  flyStage === "moving"
                    ? "top 1.2s cubic-bezier(0.22, 1, 0.36, 1), left 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none",
                perspective: "1800px",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="flex items-end justify-center" style={{ transformStyle: "preserve-3d" }}>
                {templates.map((template, index) => (
                  <div key={`${template.id}-flying`} style={getFlyingCardStyle(index)}>
                    <TemplateCard template={template} onTry={handleTry} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
