import AdminLayout from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, Trash2, AlertCircle, X, Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

const AdminEditCategory = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      setName(response.data.name);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch category:", err);
      setError("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !id) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await axios.put(`/categories/${id}`, { name: name.trim() });
      router.push("/AdminCategory");
    } catch (err) {
      console.error("Failed to update category:", err);
      setError("ไม่สามารถอัปเดตหมวดหมู่ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await axios.delete(`/categories/${id}`);
      setIsDeleteModalOpen(false);
      router.push("/AdminCategory");
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("ไม่สามารถลบรายการได้");
    } finally {
      setIsSubmitting(false);
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
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
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
              href="/AdminCategory"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors text-[16px] min-w-[120px] text-center"
            >
              ยกเลิก
            </Link>
            <button 
              onClick={handleUpdate}
              disabled={isSubmitting || !name.trim() || name === category?.name}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors text-[16px] min-w-[120px] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "ยืนยัน"}
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10 pb-0">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 pt-16 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-[8px]">
                {error}
              </div>
            )}
            {/* Category Name Input */}
            <div className="flex items-center gap-10 mb-10">
              <label className="text-[#646C80] text-[16px] w-[120px]">
                ชื่อหมวดหมู่<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 transition-colors text-[16px]"
              />
            </div>

            <div className="border-t border-gray-100 my-10 w-full"></div>

            {/* Timestamps */}
            <div className="space-y-6">
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[120px]">สร้างเมื่อ</span>
                <span className="text-black text-[16px]">
                  {category?.created_at ? new Date(category.created_at).toLocaleString('th-TH') : "-"}
                </span>
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-[120px]">แก้ไขล่าสุด</span>
                <span className="text-black text-[16px]">
                  {category?.updated_at ? new Date(category.updated_at).toLocaleString('th-TH') : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Button Area */}
          <div className="flex justify-end mt-4 mb-20 px-2">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors group cursor-pointer"
            >
              <Trash2 size={20} />
              <span className="underline text-[16px] font-medium">ลบหมวดหมู่</span>
            </button>
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] py-8 px-12 max-w-[420px] w-full relative flex flex-col items-center text-center shadow-xl animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-[60px] h-[60px] bg-[#C82438] rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-white" />
              </div>

              <h2 className="text-[20px] font-semibold text-black mb-4">
                ยืนยันการลบรายการ?
              </h2>

              <p className="text-[#646C80] text-[16px] mb-8 leading-relaxed">
                คุณต้องการลบรายการ &lsquo;{category?.name}&rsquo; <br /> ใช่หรือไม่
              </p>

              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 h-[44px] bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? <Loader2 className="animate-spin inline mr-2" size={20} /> : "ลบรายการ"}
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-[44px] border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEditCategory;
