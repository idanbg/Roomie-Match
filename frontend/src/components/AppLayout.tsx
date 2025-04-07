import React from "react";
import AppNavbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top navigation */}
      <AppNavbar />

      {/* Main page content */}
      <main className="flex-grow-1 container py-4">
        {children}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default AppLayout;
