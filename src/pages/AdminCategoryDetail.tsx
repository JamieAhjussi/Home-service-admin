import AdminLayout from "@/components/AdminLayout";
import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const AdminCategoryDetail = () => {
  const categoryName = "บริการห้องครัว";

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link href="/AdminCategory" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronLeft size={28} />
            </Link>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500">หมวดหมู่</span>
              <h1 className="text-[20px] font-semibold text-black">{categoryName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/AdminEditCategory"
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors text-[16px]"
            >
              แก้ไข
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 py-16 shadow-sm">
            {/* Category Name Display */}
            <div className="flex items-start gap-10">
              <span className="text-[#646C80] text-[16px] w-[140px]">
                ชื่อหมวดหมู่
              </span>
              <span className="text-black text-[16px] font-medium">
                {categoryName}
              </span>
            </div>

            <div className="border-t border-gray-100 my-10 w-full"></div>

            {/* Timestamps */}
            <div className="space-y-10">
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">สร้างเมื่อ</span>
                <span className="text-black text-[16px]">12/02/2022 10:30PM</span>
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">แก้ไขล่าสุด</span>
                <span className="text-black text-[16px]">12/02/2022 10:30PM</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoryDetail;
