const LoadingIndicator = () => (
  <div className="flex justify-center py-3 sm:py-4">
    <div className="loader w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#FF692E] border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-2 text-xs sm:text-sm text-gray-600">
      Loading more...
    </span>
  </div>
);

export default LoadingIndicator;
