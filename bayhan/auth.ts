import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[AUTH] Missing credentials')
            return null
          }

          const email = (credentials.email as string).toLowerCase()
          console.log('[AUTH] Attempting login for:', email)

          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              profile: {
                include: {
                  company: true,
                },
              },
            },
          })

          if (!user) {
            console.log('[AUTH] User not found:', email)
            return null
          }

          if (!user.profile) {
            console.log('[AUTH] User has no profile:', email)
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValidPassword) {
            console.log('[AUTH] Invalid password for:', email)
            return null
          }

          console.log('[AUTH] Login successful for:', email)
          return {
            id: user.id,
            email: user.email,
            name: user.email,
            profile: {
              category: user.profile.company.category,
              company: {
                name: user.profile.company.name,
                logo: user.profile.company.logoPath || "",
              },
            },
          }
        } catch (error) {
          console.error('[AUTH] Error during authorization:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.profile = (user as any).profile
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.profile = token.profile as any
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

