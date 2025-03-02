import { CloseIcon, SearchIcon } from "@/components/Icon";

const SearchBar = ({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => (
  <div className="p-3 sm:p-4">
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="맛집 이름을 검색해보세요"
        className="w-full p-2 sm:p-3 pl-8 sm:pl-10 text-sm text-black border rounded-xl sm:rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none transition"
        aria-label="Search restaurants"
      />
      <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <SearchIcon stroke="#98A2B3" className="w-[20px] h-[20px]" />
      </span>
      {!!value && (
        <span
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={onClear}
        >
          <CloseIcon className="w-[20px] h-[20px]" />
        </span>
      )}
    </div>
  </div>
);

export default SearchBar;
