import AdminLayout from "@/components/AdminLayout";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminAddCategory = () => {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">เพิ่มหมวดหมู่</h1>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/AdminCategory"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors"
            >
              ยกเลิก
            </Link>
            <button 
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors"
            >
              สร้าง
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 py-16 shadow-sm">
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[120px]">
                ชื่อหมวดหมู่<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminAddCategory;
