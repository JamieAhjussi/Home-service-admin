import AdminLayout from "@/components/AdminLayout";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, GripVertical, Trash2, Edit3, AlertCircle, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Service {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  lastModified: string;
}

const AdminService = () => {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "ล้างแอร์", category: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "2", name: "ติดตั้งแอร์", category: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "3", name: "ทำความสะอาดทั่วไป", category: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "4", name: "ซ่อมแอร์", category: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "5", name: "ซ่อมเครื่องซักผ้า", category: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "6", name: "ติดตั้งเตาแก๊ส", category: "บริการห้องครัว", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "7", name: "ติดตั้งเครื่องดูดควัน", category: "บริการห้องครัว", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "8", name: "ติดตั้งชักโครก", category: "บริการห้องน้ำ", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "9", name: "ติดตั้งเครื่องทำน้ำอุ่น", category: "บริการห้องน้ำ", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setServices(items);
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "บริการทั่วไป":
        return "bg-[#E7EEFF] text-[#336DF2]";
      case "บริการห้องครัว":
        return "bg-[#ECE6FF] text-[#4512B4]";
      case "บริการห้องน้ำ":
        return "bg-[#DFF9F6] text-[#00596C]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">บริการ</h1>
          <div className="flex items-center gap-6">
            <div className="relative w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหาบริการ..."
                className="w-full h-[44px] pl-10 pr-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
              />
            </div>
            <Link href="/AdminAddService">
              <button className="bg-[#336DF2] hover:bg-blue-600 text-white h-[44px] px-6 rounded-[8px] flex items-center gap-2 font-medium transition-colors cursor-pointer">
                เพิ่มบริการ <Plus size={20} />
              </button>
            </Link>
          </div>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFEFF2] text-[#646C80] text-[14px]">
                  <th className="py-3 px-6 w-[80px]"></th>
                  <th className="py-3 px-6 font-medium">ลำดับ</th>
                  <th className="py-3 px-6 font-medium">ชื่อบริการ</th>
                  <th className="py-3 px-6 font-medium">หมวดหมู่</th>
                  <th className="py-3 px-6 font-medium">สร้างเมื่อ</th>
                  <th className="py-3 px-6 font-medium">แก้ไขล่าสุด</th>
                  <th className="py-3 px-6 font-medium text-center">Action</th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="services">
                  {(provided) => (
                    <tbody 
                      className="text-[#323640] text-[16px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {services.map((service, index) => (
                        <Draggable key={service.id} draggableId={service.id} index={index}>
                          {(provided, snapshot) => (
                            <tr 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border-t border-gray-100 group transition-colors ${snapshot.isDragging ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                            >
                              <td className="py-6 px-6">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical size={20} className="text-[#CCD0D7] cursor-grab active:cursor-grabbing" />
                                </div>
                              </td>
                              <td className="py-6 px-6">{index + 1}</td>
                              <td className="py-6 px-6">
                                <Link href="/AdminServiceDetail" className="hover:underline cursor-pointer">
                                  {service.name}
                                </Link>
                              </td>
                              <td className="py-6 px-6">
                                <span className={`px-3 py-1 rounded-[10px] text-[12px] font-medium ${getCategoryBadgeClass(service.category)}`}>
                                  {service.category}
                                </span>
                              </td>
                              <td className="py-6 px-6 text-gray-500">{service.createdAt}</td>
                              <td className="py-6 px-6 text-gray-500">{service.lastModified}</td>
                              <td className="py-6 px-6">
                                <div className="flex items-center justify-center gap-6">
                                  <button onClick={() => openDeleteModal(service)} className="text-[#C82438] hover:opacity-75 cursor-pointer">
                                    <Trash2 size={24} strokeWidth={1} />
                                  </button>
                                  <Link href="/AdminEditService">
                                    <button className="text-[#336DF2] hover:opacity-75 cursor-pointer">
                                      <Edit3 size={24} strokeWidth={1} />
                                    </button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        </main>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-prompt">
            <div className="bg-white rounded-[16px] py-8 px-12 max-w-[420px] w-full relative flex flex-col items-center text-center shadow-xl">
              <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              <div className="w-[60px] h-[60px] bg-[#C82438] rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-white" />
              </div>
              <h2 className="text-[20px] font-semibold text-black mb-4">ยืนยันการลบรายการ?</h2>
              <p className="text-[#646C80] text-[16px] mb-8">คุณต้องการลบรายการ &lsquo;{serviceToDelete?.name}&rsquo; <br /> ใช่หรือไม่</p>
              <div className="flex items-center gap-4 w-full">
                <button onClick={confirmDelete} className="flex-1 h-[44px] bg-[#336DF2] hover:bg-blue-600 text-white rounded-[8px] font-medium">ลบรายการ</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-[44px] border border-blue-600 text-blue-600 rounded-[8px] font-medium hover:bg-blue-50">ยกเลิก</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminService;
