// Fixed lib/auth.ts with improved redirect handling
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const users = [
  {
    id: "1",
    email: "demo@example.com",
    password: "$2b$12$3Q81IgEFNOkQpNZqyL.uhOKFJg2emquywOaKl72a96BqallhySa5.", // This is "raj"
    name: "Demo User",
  },
]

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}



export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Authorization attempt started")

        if (!credentials?.email || !credentials?.password) {
          console.log(" Missing credentials")
          return null
        }

        const user = users.find((user) => user.email === credentials.email)
        
        if (!user) {
          console.log(" User not found:", credentials.email)
          return null
        }

        try {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            console.log("❌ Invalid password")
            return null
          }

          console.log("✅ Authentication successful for:", user.email)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
          
        } catch (error) {
          console.error("❌ Password verification error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        console.log("JWT callback - added user ID to token")
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        console.log("Session callback - added user ID to session")
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback triggered")
      console.log("  - url:", url)
      console.log("  - baseUrl:", baseUrl)
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log("  - Redirecting to relative URL:", redirectUrl)
        return redirectUrl
      }
      
      // If it's an absolute URL on the same origin, allow it
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(baseUrl)
        
        if (urlObj.origin === baseUrlObj.origin) {
          console.log("  - Redirecting to same origin URL:", url)
          return url
        }
      } catch (error) {
        console.log("  - Invalid URL format, using baseUrl")
      }
      
      // Default to home page
      console.log("  - Defaulting to baseUrl:", baseUrl)
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("🎉 SignIn event triggered for user:", user.email)
    },
    async session({ session, token }) {
      console.log("📋 Session event - user:", session.user?.email)
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}