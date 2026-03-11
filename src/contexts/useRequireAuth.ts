import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "./AuthContext"

export function useRequireAuth() {

  const { user, role, loading } = useAuth()

  const router = useRouter()

  useEffect(() => {

    if (!loading) {
      if (!user) {
        router.replace("/AdminLogin")
      } else if (role !== "admin") {
        // If logged in but not an admin, sign out and redirect
        // This is a safety measure
        router.replace("/AdminLogin")
      }
    }

  }, [user, role, loading, router])

  return {

    user,
    role,
    loading,
    isAuthenticated: !!user && role === "admin"

  }

}
