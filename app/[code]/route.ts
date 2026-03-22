import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { redis } from "@/lib/redis"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  // redis first for fast
  const cachedUrl = await redis.get<string>(`url:${code}`)

  if(cachedUrl){
    await redis.incr(`clicks:${code}`)
    return Response.redirect(cachedUrl)
  }

  // if not found in redis, use db
  const url = await prisma.url.findUnique({
    where: {
      shortUrl: code
    }
  })

  if (!url) {
    return new Response("URL not found", { status: 404 })
  }

  // store in redis
  const originalUrl = url.originalUrl
  await redis.set(`url${code}`, originalUrl, {ex: 60 * 60})

  //increment clicks in redis
  await redis.incr(`click:${code}`)

  redirect(url.originalUrl)
}