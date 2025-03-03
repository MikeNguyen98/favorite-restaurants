import React from "react";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden max-w-2xl mx-auto border">
      <main className="flex-grow container mx-auto bg-white">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
