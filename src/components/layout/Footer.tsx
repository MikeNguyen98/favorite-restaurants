const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center py-4 mt-8 flex flex-col">
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full mx-auto bg-white border-t flex justify-around p-3">
        <button className="flex flex-col items-center text-gray-500">
          <span>🏠</span>
          <span className="text-xs">홈</span>
        </button>
        <button className="flex flex-col items-center text-orange-500">
          <span>🔍</span>
          <span className="text-xs">검색</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <span>📋</span>
          <span className="text-xs">피드</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <span>👤</span>
          <span className="text-xs">나의 예약</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
