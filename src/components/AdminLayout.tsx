import React from "react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F6F7FB] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 font-prompt">
        {/* The Header and Content will be managed by the page components */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
