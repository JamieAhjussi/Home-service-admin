import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect, useRef } from "react"; // ✨ เพิ่ม useEffect, useRef
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronLeft,
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  AlertCircle,
  X,
  ImagePlus, // ✨ เพิ่ม ImagePlus
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import axios from "@/lib/axios";

// ใช้ axios instance จาก @/lib/axios แทนการกำหนด API_URL เอง

// ✨ เพิ่มใหม่: Types
interface Category {
  id: number;
  name: string;
  name_th: string;
}

interface SubService {
  id: string;
  name: string;
  unit: string;
  price: string;
}

const AdminEditService = () => {
  const router = useRouter();
  const { id } = router.query; // ✨ ดึง service id จาก URL query string

  // ── State: ข้อมูล form ──────────────────────────────────────────────
  const [serviceName, setServiceName] = useState(""); // ✨ ชื่อบริการ
  const [categoryId, setCategoryId] = useState(""); // ✨ หมวดหมู่ที่เลือก
  const [categories, setCategories] = useState<Category[]>([]); // ✨ รายการหมวดหมู่
  const [imageUrl, setImageUrl] = useState(""); // ✨ URL รูปเดิมจาก DB
  const [imageFile, setImageFile] = useState<File | null>(null); // ✨ ไฟล์รูปใหม่ (ถ้ามี)
  const [imagePreview, setImagePreview] = useState(""); // ✨ preview รูป
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [createdAt, setCreatedAt] = useState(""); // ✨ วันที่สร้าง
  const [updatedAt, setUpdatedAt] = useState(""); // ✨ วันที่แก้ไขล่าสุด

  // ── State: UI ───────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true); // ✨ loading ตอนดึงข้อมูล
  const [isSubmitting, setIsSubmitting] = useState(false); // ✨ ป้องกันกด submit ซ้ำ
  const [errors, setErrors] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // ✨ ref สำหรับ input file

  // ── useEffect: ดึงข้อมูล service เมื่อ id พร้อม ─────────────────────
  // ✨ เพิ่มใหม่ทั้งหมด
  // รอจนกว่า router.query.id จะมีค่า (Next.js Pages Router จะ undefined ตอนแรก)
  // แล้วค่อย fetch ข้อมูล service และ categories พร้อมกัน
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // fetch พร้อมกัน 2 request ด้วย Promise.all เพื่อประหยัดเวลา
        const [serviceRes, categoriesRes] = await Promise.all([
          axios.get(`/services/${id}`),
          axios.get<Category[]>("/categories"),
        ]);

        const service = serviceRes.data;

        // เติมข้อมูลลงใน state ทั้งหมด
        setServiceName(service.name);
        setCategoryId(String(service.category_id));
        setImageUrl(service.image);
        setImagePreview(service.image); // แสดงรูปเดิมเป็น preview
        setCategories(categoriesRes.data);

        // แปลง items จาก API เป็น format ที่ UI ใช้
        // API ส่ง price_per_unit เป็น string จาก postgres ต้อง toString() ไว้
        if (service.items && service.items.length > 0) {
          setSubServices(
            service.items.map((item: any) => ({
              id: String(item.id),
              name: item.name,
              unit: item.unit,
              price: String(item.price_per_unit),
            })),
          );
        } else {
          // ถ้าไม่มี items ให้ default 1 แถวว่าง
          setSubServices([{ id: "new-1", name: "", unit: "", price: "" }]);
        }

        // Format วันที่ให้อ่านง่าย
        setCreatedAt(formatDate(service.created_at));
        setUpdatedAt(formatDate(service.updated_at));
      } catch (error) {
        console.error("Error fetching service:", error);
        setErrors(["ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่"]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // รัน useEffect ใหม่ทุกครั้งที่ id เปลี่ยน

  // ✨ เพิ่มใหม่: helper แปลง ISO date เป็น dd/mm/yyyy hh:mm
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Handler: เปลี่ยนรูปภาพ ──────────────────────────────────────────
  // ✨ เพิ่มใหม่: เช็คขนาดไฟล์ไม่เกิน 5MB
  const handleImageChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(["รูปภาพต้องมีขนาดไม่เกิน 5MB"]);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors([]);
  };

  // ── Drag & Drop ─────────────────────────────────────────────────────
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(subServices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubServices(items);
  };

  const addSubService = () => {
    setSubServices([
      ...subServices,
      { id: `new-${Date.now()}`, name: "", unit: "", price: "" },
    ]);
  };

  const removeSubService = (id: string) => {
    if (subServices.length > 1) {
      setSubServices(subServices.filter((item) => item.id !== id));
    }
  };

  // ✨ เพิ่มใหม่: อัปเดตค่า field ใน sub-service
  const updateSubService = (
    id: string,
    field: keyof SubService,
    value: string,
  ) => {
    setSubServices(
      subServices.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // ── Handler: Submit (PUT) ────────────────────────────────────────────
  // ✨ เพิ่มใหม่ทั้งหมด
  const handleSubmit = async () => {
    setErrors([]);

    const validationErrors: string[] = [];
    if (!serviceName.trim()) validationErrors.push("กรุณากรอกชื่อบริการ");
    if (!categoryId) validationErrors.push("กรุณาเลือกหมวดหมู่");

    subServices.forEach((item, index) => {
      if (!item.name.trim())
        validationErrors.push(`รายการที่ ${index + 1}: กรุณากรอกชื่อ`);
      if (!item.price || isNaN(Number(item.price)))
        validationErrors.push(`รายการที่ ${index + 1}: ค่าบริการไม่ถูกต้อง`);
      if (!item.unit.trim())
        validationErrors.push(`รายการที่ ${index + 1}: กรุณากรอกหน่วย`);
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // สร้าง FormData เพราะอาจมีไฟล์รูปใหม่
    const formData = new FormData();
    formData.append("name", serviceName.trim());
    formData.append("category_id", categoryId);

    // ✨ ส่งรูปใหม่เฉพาะตอนที่ user เลือกรูปใหม่เท่านั้น
    // ถ้าไม่มี imageFile → backend จะใช้รูปเดิม
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    // แปลง items เป็น JSON string เหมือน POST
    const itemsPayload = subServices.map((item) => ({
      name: item.name.trim(),
      price_per_unit: Number(item.price),
      unit: item.unit.trim(),
    }));
    formData.append("items", JSON.stringify(itemsPayload));

    try {
      setIsSubmitting(true);
      await axios.put(`/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/AdminService");
    } catch (error: any) {
      const backendError = error.response?.data?.error;
      setErrors([backendError ?? "เกิดข้อผิดพลาด กรุณาลองใหม่"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handler: ลบ service ──────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/services/${id}`);
      setIsDeleteModalOpen(false);
      router.push("/AdminService");
    } catch (error) {
      setErrors(["ไม่สามารถลบบริการได้ กรุณาลองใหม่"]);
      setIsDeleteModalOpen(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 font-prompt">กำลังโหลดข้อมูล...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt relative">
        {/* Header */}
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
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
                {serviceName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/AdminService"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors text-[16px]"
            >
              ยกเลิก
            </Link>
            {/* ✨ เพิ่ม onClick และ disabled */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-md font-medium transition-colors text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </button>
          </div>
        </header>

        <main className="p-10 pb-20">
          {/* ✨ Error messages */}
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-10 shadow-sm space-y-10">
            <div className="space-y-8">
              {/* Service Name */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-35">
                  ชื่อบริการ<span className="text-red-500">*</span>
                </label>
                {/* ✨ เปลี่ยนจาก defaultValue → value + onChange */}
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full max-w-110 h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-35">
                  หมวดหมู่<span className="text-red-500">*</span>
                </label>
                <div className="relative w-full max-w-110">
                  {/* ✨ เปลี่ยนจาก mock options → render จาก categories state */}
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
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

              {/* Image */}
              <div className="flex items-start gap-10">
                <label className="text-[#646C80] text-[16px] w-35 pt-4">
                  รูปภาพ<span className="text-red-500">*</span>
                </label>
                <div className="w-full max-w-110 space-y-2">
                  {imagePreview ? (
                    // ✨ แสดงรูปที่มีอยู่ (เดิมหรือใหม่ที่เพิ่งเลือก)
                    <div className="relative w-full h-56 border border-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Service Image"
                        sizes="440px"
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    // ✨ ถ้ายังไม่มีรูป แสดง drop zone
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files[0];
                        if (f) handleImageChange(f);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="w-full h-45 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center gap-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <ImagePlus
                        size={40}
                        strokeWidth={1}
                        className="text-gray-300"
                      />
                      <p className="text-blue-500 text-[14px]">อัพโหลดรูปภาพ</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-400">
                      ขนาดภาพที่แนะนำ: 1440 x 225 PX
                    </span>
                    {/* ✨ ปุ่มเปลี่ยนรูป/ลบรูป */}
                    {imagePreview && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 underline font-medium hover:text-blue-800 transition-colors"
                        >
                          เปลี่ยนรูปภาพ
                        </button>
                        <button
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          className="text-red-500 underline font-medium hover:text-red-700 transition-colors"
                        >
                          ลบรูปภาพ
                        </button>
                      </div>
                    )}
                  </div>
                  {/* ✨ input file ซ่อนไว้ */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageChange(f);
                    }}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services */}
            <div className="space-y-6">
              <h2 className="text-[#646C80] text-[16px] font-medium">
                รายการบริการย่อย
              </h2>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="subservices">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-6"
                    >
                      {subServices.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-start gap-6 relative p-2 -m-2 rounded-lg transition-colors ${snapshot.isDragging ? "bg-blue-50" : ""}`}
                            >
                              <div
                                className="pt-10"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical
                                  size={20}
                                  className="text-[#CCD0D7] cursor-grab active:cursor-grabbing"
                                />
                              </div>
                              <div className="flex-1 grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">
                                    ชื่อรายการ
                                    <span className="text-red-500">*</span>
                                  </label>
                                  {/* ✨ เปลี่ยนจาก defaultValue → value + onChange */}
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) =>
                                      updateSubService(
                                        item.id,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">
                                    หน่วยการบริการ
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updateSubService(
                                        item.id,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">
                                    ค่าบริการ / 1 หน่วย
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) =>
                                        updateSubService(
                                          item.id,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                      ฿
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-10">
                                <button
                                  onClick={() => removeSubService(item.id)}
                                  disabled={subServices.length <= 1}
                                  className={`text-blue-600 font-medium hover:text-blue-800 transition-colors text-[16px] underline decoration-blue-600/30 underline-offset-4 ${subServices.length <= 1 ? "opacity-30 cursor-not-allowed" : ""}`}
                                >
                                  ลบบริการ
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button
                onClick={addSubService}
                className="mt-6 px-10 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                เพิ่มรายการ <Plus size={20} />
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* ✨ Timestamps จาก API */}
            <div className="space-y-6">
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  สร้างเมื่อ
                </span>
                <span className="text-black text-[16px]">{createdAt}</span>
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#646C80] text-[16px] w-35">
                  แก้ไขล่าสุด
                </span>
                <span className="text-black text-[16px]">{updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end mt-12 px-2">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 text-[#646C80] hover:text-[#C82438] transition-colors group cursor-pointer"
            >
              <Trash2 size={24} strokeWidth={1.5} />
              <span className="underline text-[16px] font-medium decoration-[#646C80]/30 underline-offset-4">
                ลบบริการ
              </span>
            </button>
          </div>
        </main>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] py-8 px-12 max-w-105 w-full relative flex flex-col items-center text-center shadow-xl">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <div className="w-15 h-15 bg-[#C82438] rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-white" />
              </div>
              <h2 className="text-[20px] font-semibold text-black mb-4">
                ยืนยันการลบรายการ?
              </h2>
              <p className="text-[#646C80] text-[16px] mb-8 leading-relaxed">
                คุณต้องการลบรายการ &lsquo;{serviceName}&rsquo; <br /> ใช่หรือไม่
              </p>
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 h-11 bg-[#336DF2] hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                >
                  ลบรายการ
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-11 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors"
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

export default AdminEditService;
