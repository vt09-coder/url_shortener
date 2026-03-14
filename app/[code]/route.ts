import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const url = await prisma.url.findUnique({
    where: {
      shortUrl: code
    }
  })

  if (!url) {
    return new Response("URL not found", { status: 404 })
  }

  redirect(url.originalUrl)
}