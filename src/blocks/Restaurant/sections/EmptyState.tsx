const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <span className="text-4xl sm:text-5xl mb-3 sm:mb-4">🍽️</span>
    <p className="text-sm sm:text-base">
      No restaurants found. Try another search.
    </p>
  </div>
);
export default EmptyState