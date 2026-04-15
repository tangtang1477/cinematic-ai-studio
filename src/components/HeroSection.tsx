type Phase = "intro" | "loop" | "cards-fly" | "ready";

interface HeroSectionProps {
  phase: Phase;
}

const HeroSection = ({ phase }: HeroSectionProps) => {
  const showTitle = phase === "intro" || phase === "loop";
  const isFading = phase === "cards-fly";
  const isHidden = phase === "ready";

  return (
    <section
      className="text-center transition-all duration-700 ease-out"
      style={{
        opacity: isHidden ? 0 : isFading ? 0 : 1,
        transform: showTitle ? "translateY(0)" : "translateY(-20px)",
        pointerEvents: isHidden ? "none" : "auto",
        paddingTop: showTitle ? "30vh" : "32px",
        paddingBottom: "16px",
      }}
    >
      <h1
        className="text-[32px] font-bold text-foreground leading-[40px] mb-2"
        style={{ textShadow: "0 0 30px rgba(113,240,246,0.3), 0 0 60px rgba(113,240,246,0.1)" }}
      >
        3D Creation Studio
      </h1>
      <p
        className="text-[14px] text-foreground/50 leading-[20px]"
        style={{ textShadow: "0 0 20px rgba(113,240,246,0.15)" }}
      >
        Explore immersive 3D templates and bring your vision to life.
      </p>
    </section>
  );
};

export default HeroSection;
