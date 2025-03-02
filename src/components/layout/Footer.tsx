import { HomeIcon, SearchIcon, ChatIcon, BookingIcon, MenuIcon } from "../Icon";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center flex flex-col">
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full mx-auto bg-white border-t flex justify-around p-3">
        <button className="flex flex-col items-center text-gray-500">
          <span>
            <HomeIcon className="w-[24px] h-[24px]" />
          </span>
          <span className="text-xs">홈</span>
        </button>
        <button className="flex flex-col items-center text-orange-500">
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
      </div>
    </footer>
  );
};

export default Footer;
