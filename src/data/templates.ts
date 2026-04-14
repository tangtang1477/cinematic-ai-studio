import template01 from "@/assets/template-01.png";
import template02 from "@/assets/template-02.png";
import template03 from "@/assets/template-03.png";
import template04 from "@/assets/template-04.png";
import template05 from "@/assets/template-05.png";
import template06 from "@/assets/template-06.png";
import template07 from "@/assets/template-07.png";
import template08 from "@/assets/template-08.png";
import template09 from "@/assets/template-09.png";
import template10 from "@/assets/template-10.png";
import template11 from "@/assets/template-11.png";
import template12 from "@/assets/template-12.png";

export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  category: string;
  gradient: string;
  image: string;
}

export const categories = [
  "All",
  "Image Play",
  "Narrative",
  "Music Video",
  "Education",
  "Commercial",
  "2D",
  "3D",
] as const;

export const templates: Template[] = [
  {
    id: "1",
    title: "Cinematic Showcase",
    description: "A stunning cinematic montage that brings your story to life with dramatic camera movements, rich color grading, and professional transitions between scenes.",
    prompt: "A breathtaking cinematic showcase with dramatic camera movements, rich color grading in deep teals and warm ambers, professional transitions. 4K, film grain, anamorphic lens flare.",
    tags: [],
    category: "Narrative",
    gradient: "",
    image: template01,
  },
  {
    id: "2",
    title: "Van Gogh Style",
    description: "Transform any scene into a living Van Gogh painting with swirling brushstrokes, vibrant impasto textures, and the iconic starry night color palette brought to motion.",
    prompt: "Transform the scene into a living Van Gogh painting with swirling brushstrokes, vibrant impasto textures, and starry night color palette. Animated oil painting style, rich yellows and blues.",
    tags: [],
    category: "Image Play",
    gradient: "",
    image: template02,
  },
  {
    id: "3",
    title: "Pet Daydreams",
    description: "Capture the whimsical inner world of pets as they drift into dreamland. Soft pastel colors, floating elements, and gentle animations create a heartwarming fantasy sequence.",
    prompt: "A whimsical pet daydream sequence with soft pastel colors, floating dream elements, gentle particle animations. Heartwarming fantasy style, shallow depth of field.",
    tags: [],
    category: "Image Play",
    gradient: "",
    image: template03,
  },
  {
    id: "4",
    title: "Narrative Animation MV",
    description: "Create a compelling music video with narrative-driven animation. Character arcs unfold through expressive motion, dynamic camera angles, and emotionally charged color storytelling.",
    prompt: "A narrative-driven animated music video with expressive character animation, dynamic camera angles, emotionally charged color grading. Cinematic animation style with rich storytelling.",
    tags: [],
    category: "Music Video",
    gradient: "",
    image: template04,
  },
  {
    id: "5",
    title: "Giant Pets",
    description: "Imagine a world where beloved pets tower over city skylines. This playful template blends photorealistic environments with oversized adorable animals for maximum visual impact.",
    prompt: "Giant adorable pets towering over city skylines, photorealistic environments with oversized animals, playful and whimsical tone, cinematic wide shots, dramatic scale contrast.",
    tags: [],
    category: "Commercial",
    gradient: "",
    image: template05,
  },
  {
    id: "6",
    title: "Toy Box Teachers",
    description: "Bring educational content to life with charming toy-like characters in a miniature classroom world. Perfect for children's learning content with warm, inviting aesthetics.",
    prompt: "Charming toy-like characters in a miniature classroom world, warm inviting aesthetics, stop-motion feel, soft lighting, educational and playful tone.",
    tags: [],
    category: "Education",
    gradient: "",
    image: template06,
  },
  {
    id: "7",
    title: "Halloween Love Story",
    description: "A romantic tale set against a hauntingly beautiful Halloween backdrop. Gothic architecture, moonlit scenes, and supernatural elements weave together in this darkly romantic narrative.",
    prompt: "A darkly romantic Halloween narrative with gothic architecture, moonlit scenes, supernatural elements, warm candlelight against cool night tones, cinematic romance.",
    tags: [],
    category: "Narrative",
    gradient: "",
    image: template07,
  },
  {
    id: "8",
    title: "Beyond Commercials",
    description: "Elevate brand storytelling beyond traditional ads. Cinematic production values meet compelling narrative arcs, creating commercial content that feels like premium short films.",
    prompt: "Premium cinematic commercial storytelling with film-quality production values, compelling narrative arc, luxury brand aesthetic, dramatic lighting and composition.",
    tags: [],
    category: "Commercial",
    gradient: "",
    image: template08,
  },
  {
    id: "9",
    title: "K-Pop Visual",
    description: "High-energy K-Pop inspired visuals with bold color palettes, synchronized choreography sequences, and trendsetting fashion aesthetics that define the genre's iconic style.",
    prompt: "High-energy K-Pop music video with bold neon color palettes, synchronized choreography, trendsetting fashion, dynamic camera work, stylish transitions.",
    tags: [],
    category: "Music Video",
    gradient: "",
    image: template09,
  },
  {
    id: "10",
    title: "Hip-Hop Culture",
    description: "Raw, authentic hip-hop visuals capturing urban energy and street culture. Gritty textures, bold typography, and rhythm-driven editing create an unmistakable vibe.",
    prompt: "Authentic hip-hop culture visuals with urban energy, gritty textures, bold typography overlays, rhythm-driven editing, street culture aesthetic, raw and powerful.",
    tags: [],
    category: "Music Video",
    gradient: "",
    image: template10,
  },
  {
    id: "11",
    title: "Dreamcore",
    description: "Surreal, liminal dreamscapes that blur the line between reality and subconscious. Soft focus, impossible geometry, and nostalgic color tones create an ethereal atmosphere.",
    prompt: "Surreal dreamcore visuals with liminal spaces, soft focus, impossible geometry, nostalgic washed-out color tones, ethereal atmosphere, uncanny and beautiful.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template11,
  },
  {
    id: "12",
    title: "Space Cowboys",
    description: "A retro-futuristic space western blending frontier aesthetics with cosmic visuals. Dusty desert planets, vintage spacecraft, and lone wanderers against infinite starscapes.",
    prompt: "Retro-futuristic space western with dusty desert planets, vintage spacecraft designs, lone cowboy silhouettes against cosmic backdrops, warm sepia mixed with cool space blues.",
    tags: [],
    category: "Narrative",
    gradient: "",
    image: template12,
  },
];
