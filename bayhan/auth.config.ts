import type { AuthConfig } from "@auth/core"

export const authConfig = {
  pages: {
    signIn: "/portal",
  },
  providers: [], // Providers are added in auth.ts
  trustHost: true, // NextAuth.js 5'te localhost için gerekli
} satisfies AuthConfig

