export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  category: string;
  gradient: string;
}

export const categories = [
  "All",
  "Image Play",
  "Narrative",
  "Music Video",
  "Education",
  "Commercial",
  "2D/3D",
] as const;

export const templates: Template[] = [
  {
    id: "1",
    title: "Cinematic City Flyover",
    description: "Aerial drone shot sweeping over a neon-lit cyberpunk metropolis at twilight.",
    prompt: "A breathtaking aerial drone shot sweeping over a neon-lit cyberpunk metropolis at twilight. The camera glides smoothly between towering skyscrapers with holographic billboards, rain-slicked streets reflecting vibrant lights below. Cinematic color grading with deep teals and warm ambers. 4K, film grain, anamorphic lens flare.",
    tags: ["Cinematic", "Aerial", "Sci-Fi"],
    category: "Narrative",
    gradient: "from-indigo-500/30 via-purple-500/20 to-pink-500/30",
  },
  {
    id: "2",
    title: "Product Reveal — Glass",
    description: "Elegant product showcase with liquid glass reflections and soft caustics.",
    prompt: "A premium product reveal sequence: a sleek glass perfume bottle materializes from swirling mist on a reflective obsidian surface. Soft caustic light patterns dance across the scene. Camera slowly orbits the product with shallow depth of field. Studio lighting, luxury brand aesthetic, photorealistic rendering.",
    tags: ["Product", "Luxury", "3D"],
    category: "Commercial",
    gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
  },
  {
    id: "3",
    title: "Nature Timelapse",
    description: "Seasonal transformation of a forest landscape from winter to spring bloom.",
    prompt: "A mesmerizing timelapse of a pristine mountain forest transitioning from deep winter snow to vibrant spring bloom. Snow melts, streams flow, flowers burst open, and sunlight filters through emerging canopy. Golden hour lighting throughout, with volumetric fog. National Geographic quality, 8K resolution feel.",
    tags: ["Nature", "Timelapse", "Cinematic"],
    category: "Image Play",
    gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
  },
  {
    id: "4",
    title: "Abstract Data Flow",
    description: "Flowing streams of luminous data particles forming neural network patterns.",
    prompt: "Abstract visualization of luminous data particles flowing through a vast neural network. Streams of light in cool blue and violet tones converge, branch, and pulse with energy. Depth of field creates a sense of infinite scale. Dark background, bioluminescent aesthetic, smooth camera movement through the data landscape.",
    tags: ["Abstract", "Tech", "Motion"],
    category: "2D/3D",
    gradient: "from-violet-500/30 via-indigo-500/20 to-blue-500/30",
  },
  {
    id: "5",
    title: "Music Video — Retro Wave",
    description: "Synthwave-inspired visual with chrome text, neon grids, and sunset palette.",
    prompt: "A synthwave music video sequence: chrome 3D text floats over an infinite neon grid stretching to the horizon. A retrofuturistic sun sets in gradient layers of pink, orange, and purple. Geometric shapes pulse to an imagined beat. VHS scanlines, lens bloom, and chrome reflections. 80s nostalgia meets modern rendering.",
    tags: ["Music", "Retro", "Neon"],
    category: "Music Video",
    gradient: "from-pink-500/30 via-rose-500/20 to-orange-500/30",
  },
  {
    id: "6",
    title: "Explainer — How AI Learns",
    description: "Educational visual breaking down machine learning concepts with clean motion graphics.",
    prompt: "An educational explainer video about how artificial intelligence learns. Clean, minimal motion graphics with a white background. Animated diagrams show data flowing into neural network layers, weights adjusting, and patterns emerging. Smooth transitions between concepts. Friendly, approachable design language with soft blue and green accents.",
    tags: ["Education", "Motion Graphics", "AI"],
    category: "Education",
    gradient: "from-sky-500/30 via-blue-500/20 to-indigo-500/30",
  },
  {
    id: "7",
    title: "Fashion Editorial",
    description: "High-fashion model walking through surreal dreamscape environments.",
    prompt: "A high-fashion editorial video: a model in avant-garde couture walks through surreal dreamscape environments — floating fabric, liquid mirrors, and soft particle effects. Each step transitions the environment from desert dunes to underwater coral gardens. Vogue-quality cinematography, dramatic lighting, slow motion at 120fps.",
    tags: ["Fashion", "Surreal", "Editorial"],
    category: "Image Play",
    gradient: "from-rose-500/30 via-pink-500/20 to-fuchsia-500/30",
  },
  {
    id: "8",
    title: "Food — Chef's Table",
    description: "Macro close-ups of ingredients and cooking with dramatic lighting.",
    prompt: "A Chef's Table inspired food sequence: extreme macro close-ups of fresh ingredients — water droplets on herbs, oil shimmering in a hot pan, steam rising from perfectly seared protein. Each shot transitions smoothly to the next. Dramatic side lighting, shallow depth of field, slow motion. Rich warm color palette, cinematic food photography.",
    tags: ["Food", "Macro", "Cinematic"],
    category: "Commercial",
    gradient: "from-amber-500/30 via-orange-500/20 to-red-500/30",
  },
  {
    id: "9",
    title: "Anime Character Intro",
    description: "Dynamic anime-style character reveal with speed lines and dramatic poses.",
    prompt: "An anime-style character introduction sequence: a warrior character appears in a dramatic pose against a stormy sky. Speed lines radiate outward, cape billowing in the wind. Camera zooms in on determined eyes, then pulls back to reveal full figure with glowing energy aura. Japanese animation style, dynamic angles, cel-shaded rendering.",
    tags: ["Anime", "2D", "Character"],
    category: "2D/3D",
    gradient: "from-red-500/30 via-orange-500/20 to-yellow-500/30",
  },
  {
    id: "10",
    title: "Real Estate Walkthrough",
    description: "Smooth interior walkthrough of a luxury modern home with natural light.",
    prompt: "A cinematic real estate walkthrough of a luxury modern home. The camera glides smoothly through sun-drenched open-plan living spaces with floor-to-ceiling windows. Natural light casts soft shadows across minimalist furniture and warm wood floors. Each room transition is seamless. Golden hour, architectural photography quality, wide-angle perspective.",
    tags: ["Real Estate", "Architecture", "Smooth"],
    category: "Commercial",
    gradient: "from-stone-500/30 via-neutral-500/20 to-slate-500/30",
  },
  {
    id: "11",
    title: "Storytelling — Fairy Tale",
    description: "Enchanted forest narrative with magical particles and warm storybook lighting.",
    prompt: "A fairy tale narrative sequence: a young adventurer steps into an enchanted forest where bioluminescent flowers bloom at their feet. Magical golden particles drift upward, ancient trees whisper with animated faces. Warm storybook lighting with painterly textures. Pixar-quality rendering meets classical illustration style.",
    tags: ["Story", "Fantasy", "Magical"],
    category: "Narrative",
    gradient: "from-yellow-500/30 via-amber-500/20 to-green-500/30",
  },
  {
    id: "12",
    title: "Lyric Video — Minimal",
    description: "Clean typography animation with kinetic text synchronized to music.",
    prompt: "A minimal lyric video: clean white and black typography animates with kinetic energy against soft gradient backgrounds. Words appear, scale, rotate, and dissolve in rhythm. Occasional geometric shapes accent the transitions. Swiss design influenced, modern and elegant. Smooth easing on all animations, satisfying visual rhythm.",
    tags: ["Music", "Typography", "Minimal"],
    category: "Music Video",
    gradient: "from-gray-500/30 via-slate-500/20 to-zinc-500/30",
  },
];
