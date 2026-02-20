import AdminLayout from "@/components/AdminLayout";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, GripVertical, Trash2, Edit3, AlertCircle, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
}

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "บริการทั่วไป", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "2", name: "บริการห้องครัว", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "3", name: "บริการห้องน้ำ", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" },
    { id: "4", name: "บริการห้องนอน", createdAt: "12/02/2022 10:30PM", lastModified: "12/02/2022 10:30PM" }
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Handle Drag and Drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);
  };

  // Open Delete Modal
  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full font-prompt relative">
        {/* Top Header Section */}
        <header className="bg-white px-10 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-[20px] font-semibold text-black">หมวดหมู่</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-[350px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหาหมวดหมู่..."
                className="w-full h-[44px] pl-10 pr-4 border border-gray-300 rounded-[8px] outline-none focus:border-blue-500"
              />
            </div>
            <Link href="/AdminAddCategory">
              <button className="bg-[#336DF2] hover:bg-blue-600 text-white h-[44px] px-6 rounded-[8px] flex items-center gap-2 font-medium transition-colors cursor-pointer">
                เพิ่มหมวดหมู่ <Plus size={20} />
              </button>
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFEFF2] text-[#646C80] text-[14px]">
                  <th className="py-3 px-6 w-[80px]"></th>
                  <th className="py-3 px-6 font-medium">ลำดับ</th>
                  <th className="py-3 px-6 font-medium">ชื่อหมวดหมู่</th>
                  <th className="py-3 px-6 font-medium">สร้างเมื่อ</th>
                  <th className="py-3 px-6 font-medium">แก้ไขล่าสุด</th>
                  <th className="py-3 px-6 font-medium text-center">Action</th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <tbody 
                      className="text-[#323640] text-[16px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {categories.map((cat, index) => (
                        <Draggable key={cat.id} draggableId={cat.id} index={index}>
                          {(provided, snapshot) => (
                            <tr 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border-t border-gray-100 group transition-colors relative ${snapshot.isDragging ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                            >
                              <td className="py-6 px-6 relative">
                                <div className="flex items-center gap-6">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical size={20} className="text-[#CCD0D7] cursor-grab active:cursor-grabbing" />
                                  </div>
                                </div>
                              </td>
                              <td className="py-6 px-6 text-[16px]">{index + 1}</td>
                              <td className="py-6 px-6 text-[16px]">
                                <Link href="/AdminCategoryDetail" className="hover:underline cursor-pointer">
                                  {cat.name}
                                </Link>
                              </td>
                              <td className="py-6 px-6 text-[16px] text-gray-500">{cat.createdAt}</td>
                              <td className="py-6 px-6 text-[16px] text-gray-500">{cat.lastModified}</td>
                              <td className="py-6 px-6">
                                <div className="flex items-center justify-center gap-6">
                                  <button 
                                    onClick={() => openDeleteModal(cat)}
                                    className="text-[#C82438] hover:opacity-75 transition-opacity cursor-pointer"
                                  >
                                    <Trash2 size={24} strokeWidth={1} />
                                  </button>
                                  <Link href="/AdminEditCategory">
                                    <button className="text-[#336DF2] hover:opacity-75 transition-opacity cursor-pointer">
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
                คุณต้องการลบรายการ &lsquo;{categoryToDelete?.name}&rsquo; <br /> ใช่หรือไม่
              </p>

              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={confirmDelete}
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

export default AdminCategory;
