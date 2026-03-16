import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encodeBase62 } from "@/lib/base62";
import { isValidURL } from "@/utils/validation";

export async function POST(req: NextRequest) {
  try {
    const { originalUrl } = await req.json();

    // check if url is empty
    if (!originalUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // check if it's a valid url
    if (!isValidURL(originalUrl)) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
      );
    }

    // check if url already exists in db
   const exsisting = await prisma.url.findFirst({
    where : {
      originalUrl : originalUrl
    }
   });
   if (exsisting) {
    return NextResponse.json({
      shortCode : `http://localhost:3000/${exsisting.shortUrl}`
    })
   }

    // create DB entry
    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl: ""
      }
    });

    // generate shortcode from ID
    const shortCode = encodeBase62(url.id);

    // update DB with shortcode
    await prisma.url.update({
      where: { id: url.id },
      data: { shortUrl: shortCode }
    });

    // return final short link
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