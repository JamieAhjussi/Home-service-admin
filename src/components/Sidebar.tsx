import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { LayoutGrid, ClipboardList, Ticket, LogOut } from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    {
      name: "หมวดหมู่",
      path: "/AdminCategory",
      icon: <LayoutGrid size={22} strokeWidth={1.5} />,
    },
    {
      name: "บริการ",
      path: "/AdminService",
      icon: <ClipboardList size={22} strokeWidth={1.5} />,
    },
    {
      name: "Promotion Code",
      path: "/AdminPromotion",
      icon: <Ticket size={22} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="w-[240px] h-screen bg-blue-950 flex flex-col font-prompt shrink-0">
      {/* Logo Section */}
      <div className="pt-8 pb-10 px-6">
        <div className="bg-blue-100 rounded-[10px] py-[10px] px-4 flex items-center justify-center gap-3">
          <Image
            src="/assets/HomeIcon.png"
            alt="HomeServices Logo"
            width={26}
            height={26}
            className="object-contain"
          />
          <span className="text-blue-600 font-bold text-[18px]">
            HomeServices
          </span>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 px-0 flex flex-col">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "text-blue-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-blue-200"}>
                {item.icon}
              </span>
              <span className="text-[16px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="pb-10 pt-4">
        <button 
          onClick={() => {
            // Handle logout logic here
            router.push("/AdminLogin");
          }}
          className="flex items-center gap-4 px-6 py-4 text-blue-200 hover:text-white w-full transition-colors cursor-pointer"
        >
          <LogOut size={22} strokeWidth={1.5} />
          <span className="text-[16px] font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
