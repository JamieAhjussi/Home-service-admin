import AdminLayout from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  AlertCircle,
  X,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import axios from "axios";
import { getCategoryColor } from "@/types/CategoryColors"; // Req3: import สีตาม category
import { formatDate } from "@/lib/formatDate";

interface Service {
  id: number; // ✅ Req2: เก็บ id จริงเป็น number
  name: string;
  category_id: number;
  category_name: string;
  category_name_th: string;
  created_at: string;
  updated_at: string;
}

const AdminService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Req1: fetch services ตอน mount
  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Req2: drag & drop — ใช้ index เป็น key แทน id เพราะ draggableId ต้องเป็น string ที่ unique
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return; // ไม่ขยับ ไม่ต้องทำอะไร

    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setServices(items);
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await axios.delete(
        `http://localhost:4000/api/services/${serviceToDelete.id}`,
      );
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt">
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">บริการ</h1>
          <div className="flex items-center gap-6">
            <div className="relative w-87.5">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md outline-none focus:border-blue-500"
              />
            </div>
            <Link href="/AdminAddService">
              <button className="bg-[#336DF2] hover:bg-blue-600 text-white h-11 px-6 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer">
                เพิ่มบริการ <Plus size={20} />
              </button>
            </Link>
          </div>
        </header>

        <main className="p-10">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFEFF2] text-[#646C80] text-[14px]">
                  <th className="py-3 px-6 w-20"></th>
                  <th className="py-3 px-6 font-medium">ลำดับ</th>
                  <th className="py-3 px-6 font-medium">ชื่อบริการ</th>
                  <th className="py-3 px-6 font-medium">หมวดหมู่</th>
                  <th className="py-3 px-6 font-medium">สร้างเมื่อ</th>
                  <th className="py-3 px-6 font-medium">แก้ไขล่าสุด</th>
                  <th className="py-3 px-6 font-medium text-center">Action</th>
                </tr>
              </thead>

              {/* Req2: DragDropContext ต้องครอบ Droppable และ Draggable */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="services-list">
                  {(provided) => (
                    <tbody
                      className="text-gray-900 text-[16px]"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {services.map((service, index) => {
                        // Req3: ดึงสีตาม category_name (EN)
                        const color = getCategoryColor(service.category_name);

                        return (
                          // Req2: draggableId ต้องเป็น string ที่ unique → แปลง id เป็น string
                          <Draggable
                            key={String(service.id)}
                            draggableId={String(service.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border-t border-gray-100 transition-colors ${
                                  snapshot.isDragging
                                    ? "bg-blue-50 shadow-md"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                {/* drag handle */}
                                <td className="py-6 px-6">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical
                                      size={20}
                                      className="text-[#CCD0D7] cursor-grab active:cursor-grabbing"
                                    />
                                  </div>
                                </td>

                                <td className="py-6 px-6">{index + 1}</td>

                                <td className="py-6 px-6">
                                  <Link
                                    href="/AdminServiceDetail"
                                    className="hover:underline cursor-pointer"
                                  >
                                    {service.name}
                                  </Link>
                                </td>

                                {/* Req3: แสดงสีตาม category */}
                                <td className="py-6 px-6">
                                  <span
                                    className={`px-3 py-1 rounded-lg text-[12px] font-medium ${color.bg} ${color.text}`}
                                  >
                                    {service.category_name_th}
                                  </span>
                                </td>

                                <td className="py-6 px-6 text-gray-500">
                                  {formatDate(service.created_at)}
                                </td>
                                <td className="py-6 px-6 text-gray-500">
                                  {formatDate(service.updated_at)}
                                </td>

                                <td className="py-6 px-6">
                                  <div className="flex items-center justify-center gap-6">
                                    <button
                                      onClick={() => openDeleteModal(service)}
                                      className="text-[#C82438] hover:opacity-75 cursor-pointer"
                                    >
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
                        );
                      })}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        </main>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-prompt">
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
              <p className="text-[#646C80] text-[16px] mb-8">
                คุณต้องการลบรายการ &lsquo;{serviceToDelete?.name}&rsquo; <br />{" "}
                ใช่หรือไม่
              </p>
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-11 bg-[#336DF2] hover:bg-blue-600 text-white rounded-md font-medium"
                >
                  ลบรายการ
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-11 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50"
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

export default AdminService;
