type Phase = "intro" | "loop" | "cards-fly" | "ready";

interface HeroSectionProps {
  phase: Phase;
}

const HeroSection = ({ phase }: HeroSectionProps) => {
  const isLarge = phase === "intro";

  return (
    <section
      className="text-center transition-all duration-700 ease-out"
      style={{
        paddingTop: isLarge ? "30vh" : "0px",
        paddingBottom: "16px",
      }}
    >
      <h1
        className="font-bold text-foreground leading-tight mb-3"
        style={{
          fontSize: isLarge ? "48px" : "40px",
          textShadow: "0 2px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.4), 0 0 60px rgba(113,240,246,0.15)",
          transition: "font-size 0.5s ease-out, padding 0.7s ease-out",
        }}
      >
        3D Creation Studio
      </h1>
      <p
        className="text-foreground/50 leading-[24px]"
        style={{
          fontSize: isLarge ? "20px" : "16px",
          textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3)",
          transition: "font-size 0.5s ease-out",
        }}
      >
        Explore immersive 3D templates and bring your vision to life.
      </p>
    </section>
  );
};

export default HeroSection;
