import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SubServiceItem {
  id: number;
  name: string;
  unit: string;
  price_per_unit: string;
}

interface ServiceDetail {
  id: number;
  name: string;
  category_name_th: string;
  image: string;
  created_at: string;
  updated_at: string;
  items: SubServiceItem[];
}

const AdminServiceDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get service ID from URL query parameters
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return; // Wait for ID to be available
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/services/${id}`);
        setService(data);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลบริการได้");
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  //  Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 font-prompt">กำลังโหลดข้อมูล...</p>
        </div>
      </AdminLayout>
    );
  }

  //  Error state
  if (error || !service) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 font-prompt">
            {error || "ไม่พบข้อมูลบริการ"}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link
              href="/AdminService"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={28} />
            </Link>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500">บริการ</span>
              <h1 className="text-[20px] font-semibold text-black">
                {service.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/AdminEditService?id=${service.id}`}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-md font-medium transition-colors text-[16px]"
            >
              แก้ไข
            </Link>
          </div>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-lg border border-gray-200 p-10 py-12 shadow-sm space-y-10">
            <div className="space-y-10">
              {/* ชื่อบริการ */}
              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  ชื่อบริการ
                </span>
                <span className="text-black text-[16px] font-medium">
                  {service.name}
                </span>
              </div>

              {/* หมวดหมู่ */}
              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  หมวดหมู่
                </span>
                <span className="text-black text-[16px] font-medium">
                  {service.category_name_th}
                </span>
              </div>

              {/* รูปภาพ */}
              <div className="flex items-start gap-10">
                <span className="text-[#646C80] text-[16px] w-35">รูปภาพ</span>
                <div className="relative w-full max-w-110 h-56.25 border border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="440px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services */}
            <div className="space-y-8">
              <h2 className="text-[#646C80] text-[16px] font-medium">
                รายการบริการย่อย
              </h2>
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6 text-[#646C80] text-[14px]">
                  <span>ชื่อรายการ</span>
                  <span>หน่วยการบริการ</span>
                  <span>ค่าบริการ / 1 หน่วย</span>
                </div>
                <div className="space-y-6">
                  {service.items.length > 0 ? (
                    service.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-3 gap-6 text-black text-[16px] font-medium"
                      >
                        <span>{item.name}</span>
                        <span>{item.unit}</span>
                        <span>
                          {Number(item.price_per_unit).toLocaleString()} ฿
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-[14px]">
                      ไม่มีรายการบริการย่อย
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Timestamps */}
            <div className="space-y-10 pb-4">
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  สร้างเมื่อ
                </span>
                {/* ✨ เปลี่ยนจาก mock date → วันที่จริง */}
                <span className="text-black text-[16px]">
                  {new Date(service.created_at).toLocaleString("th-TH")}
                </span>
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  แก้ไขล่าสุด
                </span>
                <span className="text-black text-[16px]">
                  {new Date(service.updated_at).toLocaleString("th-TH")}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminServiceDetail;
