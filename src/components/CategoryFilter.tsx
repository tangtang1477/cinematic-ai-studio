import { categories } from "@/data/templates";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 pb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`relative flex items-center justify-center px-4 py-2 rounded-lg overflow-hidden transition-all duration-200
            ${
              selected === cat
                ? "bg-primary hover:brightness-110 active:brightness-90"
                : "bg-foreground/10 hover:bg-foreground/15 active:brightness-75"
            }`}
        >
          {selected === cat && (
            <div
              className="absolute inset-0 m-auto bg-primary rounded-full pointer-events-none"
              style={{ width: 80, height: 30, filter: "blur(22.4px)" }}
            />
          )}
          <span
            className={`relative text-[14px] leading-[14px] z-10 transition-colors ${
              selected === cat ? "text-primary-foreground" : "text-foreground/70"
            }`}
          >
            {cat}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
