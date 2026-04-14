const HeroSection = () => {
  return (
    <section className="pt-8 pb-4 text-center">
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
