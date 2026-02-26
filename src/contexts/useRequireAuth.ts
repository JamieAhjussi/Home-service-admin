import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "./AuthContext"

export function useRequireAuth() {

  const { user, loading } = useAuth()

  const router = useRouter()

  useEffect(() => {

    if (!loading && !user) {

      router.replace("/AdminLogin")

    }

  }, [user, loading, router])

  return {

    user,
    loading,
    isAuthenticated: !!user

  }

}
