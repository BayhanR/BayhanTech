import { auth } from "@/auth"
import { prisma } from "./prisma"

/**
 * NextAuth session'dan kullanıcıyı al
 * Server component'lerde kullan
 */
export async function getCurrentUser() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          company: true,
        },
      },
    },
  })

  return user
}

