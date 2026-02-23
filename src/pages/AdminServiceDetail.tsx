import AdminLayout from "@/components/AdminLayout";
import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

const AdminServiceDetail = () => {
  const serviceName = "ล้างแอร์";
  const categoryName = "บริการทั่วไป";
  
  const subServices = [
    { name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
    { name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
    { name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
    { name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link href="/AdminService" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronLeft size={28} />
            </Link>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500">บริการ</span>
              <h1 className="text-[20px] font-semibold text-black">{serviceName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/AdminEditService"
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors text-[16px]"
            >
              แก้ไข
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 py-12 shadow-sm space-y-10">
            {/* Basic Info */}
            <div className="space-y-10">
              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">ชื่อบริการ</span>
                <span className="text-black text-[16px] font-medium">{serviceName}</span>
              </div>
              
              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">หมวดหมู่</span>
                <span className="text-black text-[16px] font-medium">{categoryName}</span>
              </div>

              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">รูปภาพ</span>
                <div className="relative w-full max-w-[440px] h-[225px] border border-gray-200 rounded-[8px] overflow-hidden shadow-sm">
                  <Image 
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop" 
                    alt="Service Image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services List */}
            <div className="space-y-8">
              <h2 className="text-[#646C80] text-[16px] font-medium">รายการบริการย่อย</h2>
              
              <div className="space-y-8">
                {/* Table Header for Display */}
                <div className="grid grid-cols-3 gap-6 text-[#646C80] text-[14px]">
                  <span>ชื่อรายการ</span>
                  <span>หน่วยการบริการ</span>
                  <span>ค่าบริการ / 1 หน่วย</span>
                </div>

                {/* Table Body */}
                <div className="space-y-6">
                  {subServices.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-6 text-black text-[16px] font-medium">
                      <span>{item.name}</span>
                      <span>{item.unit}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Timestamps */}
            <div className="space-y-10 pb-4">
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

export default AdminServiceDetail;
