import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Verify the request is from a trusted source
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { tags } = await request.json()

  if (!Array.isArray(tags)) {
    return NextResponse.json({ error: "Invalid tags" }, { status: 400 })
  }

  // Next.js 16'da revalidateTag kullanımı
  try {
    for (const tag of tags) {
      if (typeof tag === 'string') {
        // @ts-ignore - Next.js 16 type definitions may be incorrect
    revalidateTag(tag)
      }
    }
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
