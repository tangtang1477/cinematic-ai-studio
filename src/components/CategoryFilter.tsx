import { categories } from "@/data/templates";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-6 mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
            px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              selected === cat
                ? "bg-primary text-primary-foreground shadow-glass"
                : "glass text-muted-foreground hover:bg-secondary hover:text-foreground"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
