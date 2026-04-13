const HeroSection = () => {
  return (
    <section className="py-10 text-center">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
        style={{ background: "hsl(var(--primary) / 0.15)" }}
      >
        <span className="text-[12px] font-medium text-primary">Channel</span>
      </div>
      <h1 className="text-[32px] font-bold text-foreground leading-[40px] mb-3">
        Explore Creative Templates
      </h1>
      <p className="text-[16px] text-foreground/60 leading-[24px]">
        Browse curated AI video templates and start creating in one click.
      </p>
    </section>
  );
};

export default HeroSection;
