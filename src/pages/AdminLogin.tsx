import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Helper function to fetch user role
  const fetchUserRole = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle()

      if (error) {
        console.error("Error fetching user role:", error)
        return { data: null, error }
      }
      return { data, error: null }
    } catch (err) {
      console.error("Catch error fetching role:", err)
      return { data: null, error: err }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const trimmedEmail = email.trim()
    const passwordValue = password // Don't trim passwords as they can contain spaces

    try {
      console.log("Attempting login for:", trimmedEmail)
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: passwordValue,
      })

      if (loginError) {
        console.error("Login error:", loginError)
        setError(loginError.message)
        setIsLoading(false)
        return
      }

      // Check if user has admin role - trying both ID and Email match
      if (data.user) {
        const { data: roleData, error: roleError } = await fetchUserRole(data.user)

        if (roleError || !roleData || roleData.role !== 'admin') {
          console.error("Role verify failed:", { roleData, roleError })
          await supabase.auth.signOut()
          
          if (!roleData && !roleError) {
            setError("ไม่พบข้อมูลผู้ใช้ในตาราง users กรุณาตรวจสอบว่าได้สร้าง Profile ให้ Admin แล้ว")
          } else {
            setError(`คุณไม่มีสิทธิ์เข้าถึงระบบแอดมิน (Role: ${roleData?.role || 'None'})`)
          }
          
          setIsLoading(false)
          return
        }
      }

      console.log("Login successful:", data.user?.email)
      // Redirect to admin dashboard on success
      router.push("/")
    } catch (err: any) {
      console.error("Catch error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image 
          src="/assets/HomeIcon.png" 
          alt="HomeServices Logo" 
          width={44} 
          height={44} 
          className="object-contain"
          priority
        />
        <h1 className="text-[36px] font-prompt font-semibold text-blue-600 tracking-tight">
          HomeServices
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[520px] bg-white border border-[#E4E7EC] rounded-[4px] shadow-sm px-16 py-12">
        
        {/* Card Title */}
        <h2 className="text-center text-[24px] font-semibold text-[#0E1B3E] mb-10">
          เข้าสู่ระบบแอดมิน
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-[14px] font-bold text-[#344054] mb-2">
              Email<span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full h-[40px] px-3 border border-[#D0D5DD] rounded-[4px] outline-none focus:border-[#336DF2] focus:ring-1 focus:ring-[#336DF2]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[14px] font-bold text-[#344054] mb-2">
              Password<span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full h-[40px] px-3 border border-[#D0D5DD] rounded-[4px] outline-none focus:border-[#336DF2] focus:ring-1 focus:ring-[#336DF2]"
            />
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] bg-[#336DF2] hover:bg-[#1852D6] disabled:bg-blue-300 text-white text-[14px] font-medium rounded-[6px] transition-colors"
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}


