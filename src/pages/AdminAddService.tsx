import AdminLayout from "@/components/AdminLayout";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { ImagePlus, GripVertical, Plus, ChevronDown, X } from "lucide-react";

const AdminAddService = () => {
  const [subServices, setSubServices] = useState([
    { id: 1, name: "", price: "", unit: "" },
    { id: 2, name: "", price: "", unit: "" },
  ]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const addSubService = () => {
    setSubServices([...subServices, { id: Date.now(), name: "", price: "", unit: "" }]);
  };

  const removeSubService = (id: number) => {
    setSubServices(subServices.filter(item => item.id !== id));
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
              className="px-8 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors"
            >
              ยกเลิก
            </Link>
            <button 
              className="px-10 py-2 bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium transition-colors"
            >
              สร้าง
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10 space-y-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 shadow-sm space-y-10">
            {/* Top Fields */}
            <div className="space-y-8">
              {/* Service Name */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px]">
                  ชื่อบริการ<span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full max-w-[440px] h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px]">
                  หมวดหมู่<span className="text-red-500">*</span>
                </label>
                <div className="relative w-full max-w-[440px]">
                  <select className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 appearance-none bg-white transition-colors cursor-pointer text-gray-500">
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="1">บริการทั่วไป</option>
                    <option value="2">บริการห้องครัว</option>
                    <option value="3">บริการห้องน้ำ</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex items-start gap-10">
                <label className="text-[#646C80] text-[16px] w-[140px] pt-4">
                  รูปภาพ<span className="text-red-500">*</span>
                </label>
                <div className="w-full max-w-[440px] flex flex-col gap-2">
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
                    className={`w-full h-[180px] border-2 border-dashed rounded-[8px] flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer group relative overflow-hidden ${
                      imagePreview ? "border-solid border-gray-200" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">เปลี่ยนรูปภาพ</p>
                        </div>
                        <button 
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-all"
                        >
                          <X size={18} />
                        </button>
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
                  <p className="text-gray-400 text-[12px]">ขนาดภาพที่แนะนำ: 1440 x 225 PX</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-services Section */}
            <div className="space-y-6">
              <h2 className="text-[#646C80] text-[16px] font-medium">รายการบริการย่อย</h2>
              
              <div className="space-y-6">
                {subServices.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-6 group">
                    <div className="pt-10">
                      <GripVertical size={20} className="text-[#CCD0D7] cursor-grab" />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">ชื่อรายการ</label>
                        <input 
                          type="text" 
                          className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">ค่าบริการ / 1 หน่วย</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500 pr-10"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">฿</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#646C80] text-[14px]">หน่วยการบริการ</label>
                        <input 
                          type="text" 
                          className="w-full h-[44px] px-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
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
                className="mt-6 px-10 py-2 border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
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
