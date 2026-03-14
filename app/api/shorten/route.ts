import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encodeBase62 } from "@/lib/base62";

export async function POST(req: NextRequest) {
  try {
    const { originalUrl } = await req.json();

    if (!originalUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Step 1: create DB entry
    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl: ""
      }
    });

    // Step 2: generate shortcode from ID
    const shortCode = encodeBase62(url.id);

    // Step 3: update DB with shortcode
    await prisma.url.update({
      where: { id: url.id },
      data: { shortUrl: shortCode }
    });

    // Step 4: return final short link
    return NextResponse.json({
      shortUrl: `http://localhost:3000/${shortCode}`
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}