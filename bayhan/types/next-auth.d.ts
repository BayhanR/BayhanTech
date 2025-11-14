import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    profile?: {
      category: string
      company: {
        name: string
        logo: string
      }
    }
  }

  interface Session {
    user: {
      id: string
      email: string
      profile?: {
        category: string
        company: {
          name: string
          logo: string
        }
      }
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    profile?: {
      category: string
      company: {
        name: string
        logo: string
      }
    }
  }
}

