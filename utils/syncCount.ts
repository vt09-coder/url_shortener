import { redis } from "@/lib/redis"
import { prisma } from "@/lib/prisma"

export async function syncCount(shortUrl: string) {
  const redisClicks = await redis.get<number>(`clicks:${shortUrl}`)

  if (redisClicks === null) return

  await prisma.url.update({
    where: { shortUrl },
    data: {
      clickCount: redisClicks,
    },
  })
}