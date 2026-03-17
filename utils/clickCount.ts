import { prisma } from "@/lib/prisma"

export async function incrementClickCount(shortUrl: string) {
  await prisma.url.update({
    where: { shortUrl },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  })
}