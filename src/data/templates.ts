import template11 from "@/assets/template-11-sm.webp";
import template05 from "@/assets/template-05-sm.webp";
import template08 from "@/assets/template-08-sm.webp";
import template12 from "@/assets/template-12-sm.webp";
import template03 from "@/assets/template-03-sm.webp";
import template01 from "@/assets/template-01-sm.webp";
import template02 from "@/assets/template-02-sm.webp";
import template04 from "@/assets/template-04-sm.webp";
import template06 from "@/assets/template-06-sm.webp";
import template09 from "@/assets/template-09-sm.webp";

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

export const templates: Template[] = [
  {
    id: "1",
    title: "Dreamcore",
    description: "Surreal, liminal dreamscapes that blur the line between reality and subconscious. Soft focus, impossible geometry, and nostalgic color tones create an ethereal atmosphere.",
    prompt: "Surreal dreamcore visuals with liminal spaces, soft focus, impossible geometry, nostalgic washed-out color tones, ethereal atmosphere, uncanny and beautiful.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template11,
  },
  {
    id: "2",
    title: "Giant Pets",
    description: "Imagine a world where beloved pets tower over city skylines. This playful template blends photorealistic 3D environments with oversized adorable animals for maximum visual impact.",
    prompt: "Giant adorable pets towering over city skylines, photorealistic 3D environments with oversized animals, playful and whimsical tone, cinematic wide shots, dramatic scale contrast.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template05,
  },
  {
    id: "3",
    title: "Beyond Commercials",
    description: "Elevate brand storytelling with cinematic 3D production values. Premium rendering meets compelling narrative arcs, creating commercial content that feels like premium short films.",
    prompt: "Premium cinematic 3D commercial storytelling with film-quality production values, compelling narrative arc, luxury brand aesthetic, dramatic lighting and composition.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template08,
  },
  {
    id: "4",
    title: "Space Cowboys",
    description: "A retro-futuristic space western blending frontier aesthetics with cosmic 3D visuals. Dusty desert planets, vintage spacecraft, and lone wanderers against infinite starscapes.",
    prompt: "Retro-futuristic space western with dusty desert planets, vintage spacecraft designs, lone cowboy silhouettes against cosmic backdrops, warm sepia mixed with cool space blues.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template12,
  },
  {
    id: "5",
    title: "Cyberpunk Noir",
    description: "Neon-soaked cyberpunk streets meet film noir storytelling. Rain-slick alleys, holographic billboards, and shadowy characters create a moody, atmospheric near-future world.",
    prompt: "Cyberpunk noir cityscape with neon-drenched rain-slick streets, holographic billboards, shadowy trench-coated figures, moody atmospheric lighting, near-future dystopia aesthetic.",
    tags: [],
    category: "3D",
    gradient: "",
    image: template03,
  },
];

export const templatesAudiobook: Template[] = [
  {
    id: "a1",
    title: "Midnight Tales",
    description: "Whispered late-night stories with intimate narration. Velvet voices guide listeners through atmospheric soundscapes designed for relaxation and gentle escape.",
    prompt: "Intimate late-night audiobook narration with whispered velvet voice, atmospheric ambient soundscape, relaxing storytelling tone, perfect for bedtime listening.",
    tags: [],
    category: "Audio",
    gradient: "",
    image: template01,
  },
  {
    id: "a2",
    title: "Epic Sagas",
    description: "Sweeping fantasy narrations with cinematic scoring. Heroic voice acting brings legendary adventures to life through immersive audio production.",
    prompt: "Sweeping epic fantasy audiobook with heroic voice acting, cinematic orchestral scoring, immersive sound design, legendary adventure narration.",
    tags: [],
    category: "Audio",
    gradient: "",
    image: template02,
  },
  {
    id: "a3",
    title: "Mystery Hour",
    description: "Suspenseful detective narratives with noir-inspired delivery. Tension-building pacing and shadowy soundscapes draw listeners into every twist.",
    prompt: "Suspenseful detective audiobook with noir-inspired narration, tension-building pacing, shadowy atmospheric soundscape, mystery storytelling.",
    tags: [],
    category: "Audio",
    gradient: "",
    image: template04,
  },
  {
    id: "a4",
    title: "Kids Wonder",
    description: "Cheerful children's stories with expressive character voices. Playful sound effects and warm narration spark imagination for young listeners.",
    prompt: "Cheerful children's audiobook with expressive character voices, playful sound effects, warm and engaging narration, sparking young imaginations.",
    tags: [],
    category: "Audio",
    gradient: "",
    image: template06,
  },
  {
    id: "a5",
    title: "Mindful Reads",
    description: "Calming meditation and self-help narrations. Gentle pacing with ambient nature sounds creates a serene listening experience for personal growth.",
    prompt: "Calming meditation audiobook with gentle pacing, ambient nature soundscape, serene self-help narration, mindful and grounding tone.",
    tags: [],
    category: "Audio",
    gradient: "",
    image: template09,
  },
];

export function getTemplatesByMode(mode: "story" | "audiobook"): Template[] {
  return mode === "audiobook" ? templatesAudiobook : templates;
}
