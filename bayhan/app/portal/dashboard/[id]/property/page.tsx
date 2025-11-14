import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { PortalHeader } from "@/components/portal-header"
import { PropertyImageUpload } from "@/components/property-image-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/portal")
  }

  const { id } = await params

  // Fetch property
  const property = await prisma.property.findFirst({
    where: {
      id,
      userId: user.id,
    },
  })

  if (!property) {
    redirect("/portal/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/portal/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kontrol Paneline Dön
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <p className="text-muted-foreground mb-8">{property.description}</p>
        <PropertyImageUpload propertyId={id} userId={user.id} />
      </div>
    </main>
  )
}
