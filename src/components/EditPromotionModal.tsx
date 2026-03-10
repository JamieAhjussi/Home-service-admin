// src/components/EditPromotionModal.tsx
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import axios from "axios";

interface Promotion {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  discount_value: number;
  expiry_date: string;
  usage_limit: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo: Promotion | null;
  onSuccess: () => void; // ดึงข้อมูลใหม่เมื่อบันทึกสำเร็จ
}

const EditPromotionModal: React.FC<EditModalProps> = ({ isOpen, onClose, promo, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // เมื่อเปิด Modal ให้ดึงข้อมูลโปรโมชันเดิมมาใส่ใน Form
  useEffect(() => {
    if (promo) {
      // แปลงรูปแบบวันที่ให้เข้ากับ <input type="datetime-local">
      const formattedDate = promo.expiry_date 
        ? new Date(promo.expiry_date).toISOString().slice(0, 16) 
        : "";

      setFormData({
        code: promo.code,
        type: promo.type,
        discount_value: promo.discount_value,
        usage_limit: promo.usage_limit,
        expiry_date: formattedDate,
      });
    }
  }, [promo]);

  if (!isOpen || !promo) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // ยิง API ไปอัปเดตข้อมูล
      await axios.put(`http://localhost:4000/api/promotions/${promo.id}`, {
        ...formData,
        code: formData.code?.trim().toUpperCase(),
        discount_value: Number(formData.discount_value),
        usage_limit: Number(formData.usage_limit),
      });
      onSuccess(); // รีเฟรชตาราง
      onClose(); // ปิด Modal
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-prompt">
      <div className="bg-white rounded-[16px] w-full max-w-2xl relative shadow-xl">
        <header className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-black">แก้ไข Promotion Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">ชื่อโค้ด</label>
              <input 
                type="text" name="code" value={formData.code || ""} onChange={handleChange}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] uppercase outline-none focus:border-[#336DF2]" 
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">วันหมดอายุ</label>
              <input 
                type="datetime-local" name="expiry_date" value={formData.expiry_date || ""} onChange={handleChange}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-[#336DF2]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">ประเภทส่วนลด</label>
              <select 
                name="type" value={formData.type || "percentage"} onChange={handleChange}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-[#336DF2]"
              >
                <option value="fixed">Fix Amount (฿)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">มูลค่าส่วนลด</label>
              <input 
                type="number" name="discount_value" value={formData.discount_value || ""} onChange={handleChange}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-[#336DF2]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">โควต้าทั้งหมด (ครั้ง)</label>
              <input 
                type="number" name="usage_limit" value={formData.usage_limit || ""} onChange={handleChange}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-[#336DF2]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-[#336DF2] text-[#336DF2] rounded-[8px] font-medium hover:bg-blue-50">
              ยกเลิก
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium flex items-center justify-center min-w-[120px]">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPromotionModal;  