import AdminLayout from "@/components/AdminLayout";
import React, { useState, useRef } from "react";
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
  ImagePlus
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Image from "next/image";

interface SubService {
  id: string;
  name: string;
  unit: string;
  price: string;
}

const AdminEditService = () => {
  const router = useRouter();
  const serviceName = "ล้างแอร์";
  
  const [subServices, setSubServices] = useState<SubService[]>([
    { id: "1", name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.20" },
    { id: "2", name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.50" },
    { id: "3", name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
    { id: "4", name: "9,000 - 18,000 BTU, แบบติดผนัง", unit: "เครื่อง", price: "800.00" },
  ]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>("https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์มีขนาดใหญ่เกิน 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์มีขนาดใหญ่เกิน 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(subServices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubServices(items);
  };

  const addSubService = () => {
    const newId = Date.now().toString();
    setSubServices([...subServices, { id: newId, name: "", unit: "", price: "" }]);
  };

  const removeSubService = (id: string) => {
    if (subServices.length > 1) {
      setSubServices(subServices.filter(item => item.id !== id));
    }
  };

  const handleConfirmDelete = () => {
    // Logic to delete the whole service
    setIsDeleteModalOpen(false);
    router.push("/AdminService");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt relative">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
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
              href="/AdminService"
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors text-[16px]"
            >
              ยกเลิก
            </Link>
            <button 
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors text-[16px]"
            >
              ยืนยัน
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10 pb-20">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 shadow-sm space-y-10">
            {/* Main Form Fields */}
            <div className="space-y-8">
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px]">
                  ชื่อบริการ<span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  defaultValue={serviceName}
                  className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px]">
                  หมวดหมู่<span className="text-red-500">*</span>
                </label>
                <div className="relative w-full max-w-[440px]">
                  <select 
                    defaultValue="1"
                    className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="1">บริการทั่วไป</option>
                    <option value="2">บริการห้องครัว</option>
                    <option value="3">บริการห้องน้ำ</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="flex items-start gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px] pt-4">
                  รูปภาพ<span className="text-red-500">*</span>
                </label>
                <div className="w-full max-w-[440px] space-y-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className={`relative w-full h-[225px] border-2 border-dashed rounded-[8px] overflow-hidden transition-colors cursor-pointer group flex flex-col items-center justify-center gap-4 ${
                      imagePreview ? "border-solid border-gray-200" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <Image 
                          src={imagePreview} 
                          alt="Service Image"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">เปลี่ยนรูปภาพ</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                          <ImagePlus size={40} strokeWidth={1} />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-blue-500 text-[14px]">
                            อัพโหลดรูปภาพ <span className="text-gray-500">หรือ ลากและวางที่นี่</span>
                          </p>
                          <p className="text-gray-400 text-[12px]">PNG, JPG ขนาดไม่เกิน 5MB</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-400">ขนาดภาพที่แนะนำ: 1440 x 225 PX</span>
                    {imagePreview && (
                      <button 
                        onClick={removeImage}
                        className="text-blue-600 underline font-medium hover:text-blue-800 transition-colors"
                      >
                        ลบรูปภาพ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services Section */}
            <div className="space-y-6">
              <h2 className="text-[#646C80] text-[16px] font-medium">รายการบริการย่อย</h2>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="subservices">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-6"
                    >
                      {subServices.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-start gap-6 relative p-2 -m-2 rounded-lg transition-colors ${snapshot.isDragging ? "bg-blue-50" : ""}`}
                            >
                              <div className="pt-10" {...provided.dragHandleProps}>
                                <GripVertical size={20} className="text-[#CCD0D7] cursor-grab active:cursor-grabbing" />
                              </div>
                              
                              <div className="flex-1 grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">ชื่อรายการ<span className="text-red-500">*</span></label>
                                  <input 
                                    type="text" 
                                    defaultValue={item.name}
                                    className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">หน่วยการบริการ<span className="text-red-500">*</span></label>
                                  <input 
                                    type="text" 
                                    defaultValue={item.unit}
                                    className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[#646C80] text-[14px]">ค่าบริการ / 1 หน่วย<span className="text-red-500">*</span></label>
                                  <div className="relative">
                                    <input 
                                      type="text" 
                                      defaultValue={item.price}
                                      className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">฿</span>
                                  </div>
                                </div>
                                
                              </div>

                              <div className="pt-10">
                                <button 
                                  onClick={() => removeSubService(item.id)}
                                  className={`text-blue-600 font-medium hover:text-blue-800 transition-colors text-[16px] underline decoration-blue-600/30 underline-offset-4 ${subServices.length <= 1 ? "opacity-30 cursor-not-allowed no-underline" : ""}`}
                                  disabled={subServices.length <= 1}
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
                className="mt-6 px-10 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                เพิ่มรายการ <Plus size={20} />
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* Timestamps */}
            <div className="space-y-6">
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

          {/* Delete Service Button Area */}
          <div className="flex justify-end mt-12 px-2">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 text-[#646C80] hover:text-[#C82438] transition-colors group cursor-pointer"
            >
              <Trash2 size={24} strokeWidth={1.5} />
              <span className="underline text-[16px] font-medium decoration-[#646C80]/30 underline-offset-4">ลบบริการ</span>
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
                คุณต้องการลบรายการ &lsquo;{serviceName}&rsquo; <br /> ใช่หรือไม่
              </p>

              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 h-[44px] bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors"
                >
                  ลบรายการ
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

export default AdminEditService;
