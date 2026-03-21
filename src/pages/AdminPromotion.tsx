import AdminLayout from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Edit3, AlertCircle, X, Loader2 } from "lucide-react";
import axios from "axios";
import { formatDate } from "@/lib/formatDate";
import EditPromotionModal from "@/components/EditPromotionModal";

interface Promotion {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  discount_value: number;
  expiry_date: string;
  usage_limit: number;
  used_count?: number; // ใส่ ? เผื่อกรณีสร้างใหม่แล้วยังไม่มีคนใช้
  created_at: string;
}

const AdminPromotion = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<Promotion | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/promotions`);
      setPromotions(response.data);
    } catch (err) {
      console.error("Failed to fetch promotions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!promoToDelete) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/promotions/${promoToDelete.id}`);
      setPromotions(promotions.filter((p) => p.id !== promoToDelete.id));
    } catch (error) {
      console.error("Error deleting promotion:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
    }
  };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [promoToEdit, setPromoToEdit] = useState<Promotion | null>(null);

    const openEditModal = (promo: Promotion) => {
      setPromoToEdit(promo);
      setIsEditModalOpen(true);
    };

  const filteredPromotions = promotions.filter((p) =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">Promotion Code</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหา Promotion Code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-600 transition-colors"
              />
            </div>
            <Link href="/AdminAddPromotion">
              <button className="bg-[#336DF2] hover:bg-blue-600 text-white h-[44px] px-6 rounded-[8px] flex items-center gap-2 font-medium transition-colors cursor-pointer">
                Code <Plus size={20} />
              </button>
            </Link>
          </div>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#EFEFF2] text-[#646C80] text-[14px]">
                    <th className="py-3 px-6 font-medium">ลำดับ</th>
                    <th className="py-3 px-6 font-medium">Promotion Code</th>
                    <th className="py-3 px-6 font-medium">ประเภท</th>
                    <th className="py-3 px-6 font-medium">ส่วนลด</th>
                    <th className="py-3 px-6 font-medium">โควต้า (ใช้ไป/ทั้งหมด)</th>
                    <th className="py-3 px-6 font-medium">สร้างเมื่อ</th> {/* ✨ นำกลับมาแล้ว */}
                    <th className="py-3 px-6 font-medium">วันหมดอายุ</th>
                    <th className="py-3 px-6 font-medium text-center">จัดการ</th> {/* ✨ เปลี่ยนจาก Action */}
                    </tr>
                </thead>
                <tbody className="text-gray-900 text-[16px]">
                    {isLoading ? (
                    <tr>
                        <td colSpan={8} className="py-20 text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
                        </td>
                    </tr>
                    ) : filteredPromotions.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="py-20 text-center text-gray-500">
                        {searchTerm ? `ไม่พบโปรโมชันที่ตรงกับ "${searchTerm}"` : "ไม่พบข้อมูล Promotion Code"}
                        </td>
                    </tr>
                    ) : (
                    filteredPromotions.map((promo, index) => (
                        <tr 
                          key={promo.id} 
                          onClick={() => openEditModal(promo)}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="py-6 px-6">{index + 1}</td>
                          <td className="py-6 px-6 font-medium text-[#336DF2]">
                            {promo.code}
                          </td>
                          <td className="py-6 px-6">
                              <span className={`px-3 py-1 rounded-lg text-[12px] font-medium ${
                              promo.type === "fixed" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                              }`}>
                              {promo.type === "fixed" ? "Fix Amount" : "Percentage"}
                              </span>
                          </td>
                          <td className="py-6 px-6">
                              {promo.discount_value !== null && promo.discount_value !== undefined
                                ? Number(promo.discount_value).toLocaleString()
                                : "-"}{" "}
                              {promo.type === "fixed" ? "฿" : "%"}
                          </td>
                          <td className="py-6 px-6">
                              <div className="flex flex-col w-32">
                              <span className="text-[14px] text-gray-700">
                                  {promo.used_count ?? 0} / {promo.usage_limit}
                              </span>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                                  <div 
                                  className="bg-[#336DF2] h-1.5 rounded-full transition-all" 
                                  style={{ width: `${Math.min(((promo.used_count ?? 0) / promo.usage_limit) * 100, 100)}%` }}
                                  ></div>
                              </div>
                              </div>
                          </td>
                          <td className="py-6 px-6 text-gray-500">
                              {formatDate(promo.created_at)}
                          </td>
                          <td className="py-6 px-6 text-gray-500">
                              {formatDate(promo.expiry_date)}
                          </td>
                          <td className="py-6 px-6">
                              <div className="flex items-center justify-center gap-6">
                                <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setPromoToDelete(promo); 
                                      setIsDeleteModalOpen(true); 
                                    }}
                                    className="text-[#C82438] hover:opacity-75 cursor-pointer"
                                >
                                    <Trash2 size={24} strokeWidth={1} />
                                </button>
                              </div>
                          </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
          </div>
        </main>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] py-8 px-12 max-w-[420px] w-full relative flex flex-col items-center text-center shadow-xl">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                คุณต้องการลบโค้ด &lsquo;{promoToDelete?.code}&rsquo; <br /> ใช่หรือไม่
              </p>
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={confirmDelete}
                  className="flex-1 h-[44px] bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors cursor-pointer"
                >
                  ลบรายการ
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-[44px] border border-[#336DF2] text-[#336DF2] rounded-[8px] font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✨ เพิ่ม Edit Modal เข้ามาตรงนี้ ✨ */}
        <EditPromotionModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          promo={promoToEdit}
          onSuccess={() => {
            fetchPromotions(); // โหลดข้อมูลใหม่หลังจากบันทึก
          }}
        />

      </div>
    </AdminLayout>
  );
};

export default AdminPromotion;