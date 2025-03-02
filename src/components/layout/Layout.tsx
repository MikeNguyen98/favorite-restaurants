import React from "react";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow container mx-auto">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
