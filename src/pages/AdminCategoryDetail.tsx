import AdminLayout from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

const AdminCategoryDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/categories/${id}`);
      setCategory(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch category:", err);
      setError("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && id) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      </AdminLayout>
    );
  }

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
              <h1 className="text-[20px] font-semibold text-black">{category?.name || "..."}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/AdminEditCategory?id=${id}`}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors text-[16px]"
            >
              แก้ไข
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 py-16 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-[8px]">
                {error}
              </div>
            )}
            {/* Category Name Display */}
            <div className="flex items-start gap-10">
              <span className="text-[#646C80] text-[16px] w-[140px]">
                ชื่อหมวดหมู่
              </span>
              <span className="text-black text-[16px] font-medium">
                {category?.name}
              </span>
            </div>

            <div className="border-t border-gray-100 my-10 w-full"></div>

            {/* Timestamps */}
            <div className="space-y-10">
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">สร้างเมื่อ</span>
                <span className="text-black text-[16px]">
                  {category?.created_at ? new Date(category.created_at).toLocaleString('th-TH') : "-"}
                </span>
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[140px]">แก้ไขล่าสุด</span>
                <span className="text-black text-[16px]">
                  {category?.updated_at ? new Date(category.updated_at).toLocaleString('th-TH') : "-"}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoryDetail;
