import AdminLayout from "@/components/AdminLayout";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Calendar, Hash, Loader2 } from "lucide-react";
import axios from "axios";


const AdminAddPromotion = () => {
  const router = useRouter();
  
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    code: "",
    type: "fixed",
    discount_value: "",
    usage_limit: "",
    expiry_date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation เบื้องต้น
    if (!formData.code || !formData.discount_value || !formData.usage_limit || !formData.expiry_date) {
      setError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:4000/api/promotions",{
        code: formData.code.trim().toUpperCase(), // บังคับตัวพิมพ์ใหญ่
        type: formData.type,
        discount_value: Number(formData.discount_value),
        usage_limit: Number(formData.usage_limit),
        expiry_date: formData.expiry_date,
      });
      router.push("/AdminPromotion");
    } catch (err) {
      console.error("Failed to create promotion:", err);
      setError("ไม่สามารถสร้าง Promotion Code ได้ โปรดตรวจสอบข้อมูลอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="flex flex-col h-full font-prompt">
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">เพิ่ม Promotion Code</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/AdminPromotion"
              className="px-8 py-2 border border-[#336DF2] text-[#336DF2] rounded-[8px] font-medium hover:bg-blue-50 transition-colors flex items-center justify-center min-w-[120px]"
            >
              ยกเลิก
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "สร้าง"}
            </button>
          </div>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 py-16 shadow-sm space-y-10">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-[8px]">
                {error}
              </div>
            )}

            {/* ชื่อโค้ด */}
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[160px]">
                ชื่อโค้ด<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder=""
                className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 uppercase"
              />
            </div>

            {/* ประเภทส่วนลด */}
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[160px]">
                ประเภทส่วนลด<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 w-[200px] cursor-pointer"
                >
                  <option value="fixed">Fix Amount (฿)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
                <input 
                  type="number" 
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  placeholder="จำนวน" 
                  className="h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 w-[224px]"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* โควต้า */}
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[160px] flex items-center gap-2">
                <Hash size={18} /> โควต้าการใช้งาน<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  name="usage_limit"
                  value={formData.usage_limit}
                  onChange={handleChange}
                  placeholder="ระบุจำนวน" 
                  className="h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 w-[200px]"
                />
                <span className="text-[#646C80] text-[16px]">ครั้ง</span>
              </div>
            </div>

            {/* วันหมดอายุ */}
            <div className="flex items-center gap-10">
              <label className="text-[#646C80] text-[16px] w-[160px] flex items-center gap-2">
                <Calendar size={18} /> วันหมดอายุ<span className="text-red-500">*</span>
              </label>
              <input 
                type="datetime-local" 
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 w-[300px]"
              />
            </div>
          </div>
        </main>
      </form>
    </AdminLayout>
  );
};

export default AdminAddPromotion;
