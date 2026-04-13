import { categories } from "@/data/templates";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 pb-6 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200
            ${
              selected === cat
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/8 text-foreground/60 hover:bg-foreground/12 hover:text-foreground/80"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
