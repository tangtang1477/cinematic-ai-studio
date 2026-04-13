const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-12 text-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="absolute top-[-10%] right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-400/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-[40%] w-[600px] h-[300px] rounded-full bg-primary/[0.04] blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Powered by Seedance 2.0
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6">
          Create Cinematic
          <br />
          <span className="bg-gradient-to-r from-primary via-cyan-300 to-teal-400 bg-clip-text text-transparent">
            AI Videos
          </span>{" "}
          in Minutes
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform your ideas into stunning, production-ready videos with AI.
          Choose a template, customize your vision, and generate cinematic content — no editing skills required.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
