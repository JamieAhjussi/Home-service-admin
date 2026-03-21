import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  role: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
})

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserRole = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle()

      if (error) {
        console.error("AuthContext: Error fetching user role:", error)
        return null
      }
      return data?.role || null
    } catch (err) {
      console.error("AuthContext: Catch error fetching role:", err)
      return null
    }
  }

  useEffect(() => {

    let mounted = true

    // โหลด session ครั้งแรก
    const getSession = async () => {

      const { data } =
        await supabase.auth.getSession()

      if (!mounted) return

      const currentUser = data.session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const userRole = await fetchUserRole(currentUser)
        if (mounted) setRole(userRole)
      } else {
        setRole(null)
      }
      
      setLoading(false)
    }

    getSession()


    // listen auth change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: any, session: Session | null) => {

        if (!mounted) return

        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          const userRole = await fetchUserRole(currentUser)
          if (mounted) setRole(userRole)
        } else {
          setRole(null)
        }
        
        setLoading(false)
      }
    )

    return () => {

      mounted = false

      subscription.unsubscribe()

    }

  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
