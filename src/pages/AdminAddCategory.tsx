import AdminLayout from "@/components/AdminLayout";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

const AdminAddCategory = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await axios.post("/categories", { name: name.trim() });
      router.push("/AdminCategory");
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("ไม่สามารถสร้างหมวดหมู่ได้ โปรดตรวจสอบข้อมูลอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="flex flex-col h-full font-prompt">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">เพิ่มหมวดหมู่</h1>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/AdminCategory"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors flex items-center justify-center min-w-[120px]"
            >
              ยกเลิก
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "สร้าง"}
            </button>
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
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[120px]">
                ชื่อหมวดหมู่<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อหมวดหมู่"
                className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>
        </main>
      </form>
    </AdminLayout>
  );
};

export default AdminAddCategory;
