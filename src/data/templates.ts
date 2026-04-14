import template11 from "@/assets/template-11.png";
import template05 from "@/assets/template-05.png";
import template08 from "@/assets/template-08.png";
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
];
