import { HomeIcon, SearchIcon, ChatIcon, BookingIcon, MenuIcon } from "../Icon";

const Footer = () => {
  return (
    <footer className="z-50 fixed bottom-0 shadow-lg w-full max-w-2xl mx-auto bg-white border-t flex justify-around p-3">
      {/* Bottom Navigation */}
      <button className="flex flex-col items-center text-gray-500">
        <span>
          <HomeIcon className="w-[24px] h-[24px]" />
        </span>
        <span className="text-xs">홈</span>
      </button>
      <button className="flex flex-col items-center text-[#FF692E]">
        <span>
          <SearchIcon stroke="#FF4405" className="w-[24px] h-[24px]" />
        </span>
        <span className="text-xs">검색</span>
      </button>
      <button className="flex flex-col items-center text-gray-500">
        <span>
          <ChatIcon className="w-[24px] h-[24px]" />
        </span>
        <span className="text-xs">피드</span>
      </button>
      <button className="flex flex-col items-center text-gray-500">
        <span>
          <BookingIcon className="w-[24px] h-[24px]" />
        </span>
        <span className="text-xs">내 예약</span>
      </button>
      <button className="flex flex-col items-center text-gray-500">
        <span>
          <MenuIcon className="w-[24px] h-[24px]" />
        </span>
        <span className="text-xs">메뉴</span>
      </button>
    </footer>
  );
};

export default Footer;
