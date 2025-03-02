import React from "react";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow container mx-auto">
        {children}
        <div className="pb-[180px] sm:pb-[200px]"></div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
