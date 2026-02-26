import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ImagePlus, GripVertical, Plus, ChevronDown } from "lucide-react";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";


// ใช้ axios instance จาก @/lib/axios แทนการกำหนด API_URL เอง

// Type สำหรับ Category ที่ดึงมาจาก API
interface Category {
  id: number;
  name: string;
  name_th: string;
}

// Type สำหรับ Sub-service ที่จะใช้ใน state
interface SubService {
  id: number;
  name: string;
  price: string;
  unit: string;
}

const AdminAddService = () => {
  const [serviceName, setServiceName] = useState(""); // State สำหรับชื่อบริการ
  const [categoryId, setCategoryId] = useState(""); // State สำหรับหมวดหมู่ที่เลือก
  const [categories, setCategories] = useState<Category[]>([]); // State สำหรับเก็บหมวดหมู่ที่ดึงมาจาก API
  const [imageFile, setImageFile] = useState<File | null>(null); // State สำหรับเก็บไฟล์รูปภาพที่อัพโหลด
  const [imagePreview, setImagePreview] = useState<string>(""); // State สำหรับเก็บ URL ของรูปภาพที่แสดงตัวอย่าง
  const [subServices, setSubServices] = useState<SubService[]>([
    { id: 1, name: "", price: "", unit: "" },
    { id: 2, name: "", price: "", unit: "" },
  ]); // State สำหรับเก็บรายการบริการย่อย
  const [isSubmitting, setIsSubmitting] = useState(false); // State สำหรับแสดงสถานะการส่งข้อมูล
  const [errors, setErrors] = useState<string[]>([]); // State สำหรับเก็บข้อความแสดงข้อผิดพลาด

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref สำหรับ input อัพโหลดไฟล์

  // ฟังก์ชันสำหรับดึงหมวดหมู่จาก API เมื่อ component ถูก mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get<Category[]>(
          "/categories",
        );
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // เช็คขนาดไฟล์ที่อัพโหลดไม่เกิน 5MB และแสดงตัวอย่างรูปภาพ
  const handleImageChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(["รูปภาพต้องมีขนาดไม่เกิน 5MB"]);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // สร้าง URL ชั่วคราวสำหรับแสดงตัวอย่างรูปภาพ
    setErrors([]); // ล้างข้อความแสดงข้อผิดพลาด
  };

  // Drag and Drop สำหรับอัพโหลดรูปภาพ
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  // ฟังก์ชันสำหรับเพิ่มรายการบริการย่อยใหม่
  const addSubService = () => {
    setSubServices([
      ...subServices,
      { id: Date.now(), name: "", price: "", unit: "" },
    ]);
  };

  // ฟังก์ชันสำหรับลบรายการบริการย่อยตาม id
  const removeSubService = (id: number) => {
    setSubServices(subServices.filter((item) => item.id !== id));
  };

  // ฟังก์ชันสำหรับอัพเดตรายการบริการย่อยตาม id
  const updateSubService = (
    id: number,
    field: keyof SubService,
    value: string,
  ) => {
    setSubServices(
      subServices.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = async () => {
    setErrors([]);

    // Client-side validation เบื้องต้น (backend จะ validate ซ้ำอีกครั้ง)
    const validationErrors: string[] = [];
    if (!serviceName.trim()) validationErrors.push("กรุณากรอกชื่อบริการ");
    if (!categoryId) validationErrors.push("กรุณาเลือกหมวดหมู่");
    if (!imageFile) validationErrors.push("กรุณาอัพโหลดรูปภาพ");
    if (subServices.length === 0)
      validationErrors.push("กรุณาเพิ่มรายการบริการย่อยอย่างน้อย 1 รายการ");

    subServices.forEach((item, index) => {
      if (!item.name.trim())
        validationErrors.push(`กรุณากรอกชื่อรายการบริการย่อยที่ ${index + 1}`);
      if (!item.price.trim() || isNaN(Number(item.price)))
        validationErrors.push(
          `กรุณากรอกค่าบริการที่ถูกต้องสำหรับรายการที่ ${index + 1}`,
        );
      if (!item.unit.trim())
        validationErrors.push(
          `กรุณากรอกหน่วยการบริการสำหรับรายการที่ ${index + 1}`,
        );
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // สร้าง FormData เพราะ request มีทั้ง text และ file
    // FormData คือ format ที่ใช้ส่ง multipart/form-data ซึ่งเหมาะสำหรับการส่งไฟล์
    const formData = new FormData();
    formData.append("name", serviceName.trim());
    formData.append("category_id", categoryId);
    formData.append("imageFile", imageFile!); // ! เพราะเราตรวจสอบแล้วว่า imageFile ไม่เป็น null

    // items ต้องแปลงเป็น JSON string ก่อนส่ง
    // เพราะ FormData ส่งได้แค่ string หรือ file
    // backend จะรับ string นี้แล้วแปลงกลับเป็น object ด้วย JSON.parse ใน middleware
    const itemsPayload = subServices.map((item) => ({
      name: item.name.trim(),
      price_per_unit: Number(item.price.trim()),
      unit: item.unit.trim(),
    }));
    formData.append("items", JSON.stringify(itemsPayload));

    try {
      setIsSubmitting(true);
      await axios.post("/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = "/AdminService"; // เปลี่ยนเส้นทางกลับไปหน้าแอดมินบริการหลังจากสร้างสำเร็จ
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
      } else {
        setErrors(["เกิดข้อผิดพลาดในการสร้างบริการ กรุณาลองใหม่อีกครั้ง"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">เพิ่มบริการ</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/AdminService"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              ยกเลิก
            </Link>
            {/* เพิ่ม onClick และ disabled ตอน submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังสร้าง..." : "สร้าง"}
              <Loader2
                size={16}
                className={`ml-2 animate-spin ${isSubmitting ? "inline-block" : "hidden"}`}
              />
            </button>
          </div>
        </header>

        <main className="p-10 space-y-10">
          {/* แสดง error messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          <div className="bg-white rounded-md border border-gray-200 p-10 shadow-sm space-y-10">
            <div className="space-y-8">
              {/* Service Name */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-35">
                  ชื่อบริการ<span className="text-red-500">*</span>
                </label>
                {/* เพิ่ม value และ onChange */}
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full max-w-110 h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-35">
                  หมวดหมู่<span className="text-red-500">*</span>
                </label>
                <div className="relative w-full max-w-110">
                  {/* เปลี่ยนจาก mock data → render จาก categories state */}
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 appearance-none bg-white transition-colors cursor-pointer text-gray-500"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name_th}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex items-start gap-10">
                <label className="text-[#646C80] text-[16px] w-35 pt-4">
                  รูปภาพ<span className="text-red-500">*</span>
                </label>
                <div className="w-full max-w-110 flex flex-col gap-2">
                  {/* เพิ่ม drag & drop, click to upload, และ preview */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full h-45 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group overflow-hidden"
                  >
                    {imagePreview ? (
                      // แสดง preview รูปที่เลือก
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                          <ImagePlus size={40} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                          <p className="text-blue-500 text-[14px]">
                            อัพโหลดรูปภาพ{" "}
                            <span className="text-gray-500">
                              หรือ ลากและวางที่นี่
                            </span>
                          </p>
                          <p className="text-gray-400 text-[12px]">
                            PNG, JPG ขนาดไม่เกิน 5MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {/* ✨ input file ซ่อนไว้ เปิดผ่านการคลิก drop zone */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageChange(file);
                    }}
                  />
                  <p className="text-gray-400 text-[12px]">
                    ขนาดภาพที่แนะนำ: 1440 x 225 PX
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services Section */}
            <div className="space-y-6">
              <h2 className="text-[#646C80] text-[16px] font-medium">
                รายการบริการย่อย
              </h2>
              <div className="space-y-6">
                {subServices.map((item) => (
                  <div key={item.id} className="flex items-start gap-6 group">
                    <div className="pt-10">
                      <GripVertical
                        size={20}
                        className="text-[#CCD0D7] cursor-grab"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">
                          ชื่อรายการ
                        </label>
                        {/* เพิ่ม value และ onChange ทุก input */}
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateSubService(item.id, "name", e.target.value)
                          }
                          className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">
                          ค่าบริการ / 1 หน่วย
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateSubService(item.id, "price", e.target.value)
                            }
                            className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 pr-10"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ฿
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">
                          หน่วยการบริการ
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) =>
                            updateSubService(item.id, "unit", e.target.value)
                          }
                          className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="pt-10">
                      <button
                        onClick={() => removeSubService(item.id)}
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors text-[16px] underline decoration-blue-600/30 underline-offset-4"
                      >
                        ลบบริการ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addSubService}
                className="mt-6 px-10 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                เพิ่มรายการ <Plus size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminAddService;
