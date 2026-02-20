import Image from "next/image"

export default function AdminLoginPage() {
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

        {/* Form */}
        <form className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-[14px] font-bold text-[#344054] mb-2">
              Email<span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="email"
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
              className="w-full h-[40px] px-3 border border-[#D0D5DD] rounded-[4px] outline-none focus:border-[#336DF2] focus:ring-1 focus:ring-[#336DF2]"
            />
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full h-[44px] bg-[#336DF2] hover:bg-[#1852D6] text-white text-[14px] font-medium rounded-[6px] transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}

