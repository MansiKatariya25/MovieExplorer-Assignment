// Fixed app/auth/signin/page.tsx with proper TypeScript
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, getSession, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Film, Eye, EyeOff, Loader2 } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("raj")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  
  // Get the callback URL from search params or default to "/"
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Debug session changes
  useEffect(() => {
    console.log("🔍 Session status changed:", status)
    console.log("👤 Session data:", session)
    setDebugInfo(prev => prev + `\nSession: ${status} - ${session?.user?.email || 'No user'}`)
  }, [session, status])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("✅ User already authenticated, redirecting to:", callbackUrl)
      setDebugInfo(prev => prev + `\n🔄 Redirecting to: ${callbackUrl}`)
      
      // Try multiple redirect methods
      setTimeout(() => {
        console.log("Using router.push...")
        router.push(callbackUrl)
      }, 100)
      
      setTimeout(() => {
        console.log("Using router.replace...")
        router.replace(callbackUrl)
      }, 500)
      
      setTimeout(() => {
        console.log("Using window.location...")
        window.location.href = callbackUrl
      }, 1000)
    }
  }, [status, session, callbackUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo("🚀 Starting authentication...")
    setIsLoading(true)

    console.log("🚀 Starting signin process...")
    console.log("📧 Email:", email)
    console.log("🔗 Callback URL:", callbackUrl)

    try {
      // Try Method 1: Let NextAuth handle redirect
      console.log("Trying NextAuth automatic redirect...")
      setDebugInfo(prev => prev + "\n🔄 Trying NextAuth automatic redirect...")
      
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        callbackUrl: callbackUrl,
        redirect: true, // Let NextAuth handle redirect
      })

      // This shouldn't execute if redirect worked
      console.log("⚠️ Redirect didn't work, result:", result)
      setDebugInfo(prev => prev + "\n⚠️ Automatic redirect failed")
      setIsLoading(false)
      
    } catch (error) {
      console.error("❌ SignIn exception:", error)
      setError("❌ Network error occurred. Please try again.")
      setDebugInfo(prev => prev + `\n❌ Error: ${error}`)
      setIsLoading(false)
    }
  }

  const handleManualRedirect = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo("🚀 Starting manual authentication...")
    setIsLoading(true)

    try {
      console.log("Trying manual redirect method...")
      setDebugInfo(prev => prev + "\n🔄 Trying manual redirect...")
      
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false, // Handle manually
      })

      console.log("🔍 SignIn result:", result)
      setDebugInfo(prev => prev + `\nResult: ${JSON.stringify(result, null, 2)}`)

      if (result?.error) {
        console.error("❌ SignIn error:", result.error)
        setError(`❌ Authentication failed: ${result.error}`)
        setDebugInfo(prev => prev + `\n❌ Auth error: ${result.error}`)
        setIsLoading(false)
      } else if (result?.ok) {
        console.log("✅ Authentication successful!")
        setDebugInfo(prev => prev + "\n✅ Auth success! Getting session...")
        
        // Force session refresh
        const newSession = await getSession()
        console.log("👤 New session:", newSession)
        setDebugInfo(prev => prev + `\nNew session: ${newSession?.user?.email || 'No user'}`)
        
        if (newSession?.user) {
          setDebugInfo(prev => prev + "\n🔄 Session confirmed, redirecting...")
          
          // Try multiple redirect strategies
          console.log("Trying router.push to:", callbackUrl)
          try {
            await router.push(callbackUrl)
            setDebugInfo(prev => prev + "\n✅ router.push attempted")
          } catch (routerError) {
            console.error("Router error:", routerError)
            setDebugInfo(prev => prev + `\n❌ router.push failed: ${routerError}`)
          }
          
          // Fallback to window.location after a delay
          setTimeout(() => {
            console.log("Fallback: Using window.location.href")
            setDebugInfo(prev => prev + "\n🔄 Fallback: window.location redirect")
            window.location.href = callbackUrl
          }, 2000)
        } else {
          setError("❌ Session not created properly")
          setDebugInfo(prev => prev + "\n❌ No session after login")
          setIsLoading(false)
        }
      } else {
        setError("❌ Unknown authentication error")
        setDebugInfo(prev => prev + "\n❌ Unknown error")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("❌ Exception:", error)
      setError("❌ Network error occurred")
      setDebugInfo(prev => prev + `\n❌ Exception: ${error}`)
      setIsLoading(false)
    }
  }

  // Show loading if checking authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't show login form if already authenticated
  if (status === "authenticated" && session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">✅ Already signed in as {session.user.email}</div>
          <p>Redirecting to: {callbackUrl}</p>
          <Button onClick={() => window.location.href = callbackUrl} className="mt-4">
            Manual Redirect
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Film className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Movie Explorer</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
              {callbackUrl !== '/' && (
                <div className="mt-2 text-xs text-muted-foreground">
                  You'll be redirected to: {callbackUrl}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link 
                  href={`/auth/signup${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">📧 Email: demo@example.com</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">🔑 Password: raj</p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}