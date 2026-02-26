import { useAuth } from "@/contexts/AuthContext";
import AdminLoginPage from "./AdminLogin";
import { supabase } from "@/lib/supabase";
import AdminCategory from "./AdminCategory";
import Link from "next/link";


export default function Home() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0E1B3E]">Admin Dashboard</h1>
            <p className="text-gray-600">ยินดีต้อนรับ, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            ออกจากระบบ
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E4E7EC]">
            <h2 className="text-xl font-semibold mb-4 text-[#0E1B3E]">จัดการข้อมูล</h2>
            <p className="text-gray-600 mb-4">คุณสามารถเพิ่ม แก้ไข และลบข้อมูลหมวดหมู่และบริการได้ที่หน้าแอดมิน</p>
            {/* We will add links here as more pages are developed */}
            <div className="flex gap-4">
              <Link href="/AdminService">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  เข้าสู่หน้าจัดการ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
