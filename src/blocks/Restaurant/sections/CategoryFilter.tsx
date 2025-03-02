import { STORE_CATEGORY, textByStoreCategory } from "@/types/categoryType";

const CategoryFilter = ({
  selected,
  onChange,
}: {
  selected: STORE_CATEGORY;
  onChange: (category: STORE_CATEGORY) => void;
}) => (
  <div className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
    <div className="flex gap-1 sm:gap-2 whitespace-nowrap pb-1">
      {Object.values(STORE_CATEGORY).map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors border border-gray-200 ${
            selected === category
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-pressed={selected === category}
          aria-label={`Filter by ${textByStoreCategory[category]}`}
        >
          {textByStoreCategory[category]}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryFilter;