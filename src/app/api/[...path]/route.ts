import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const search = req.nextUrl.search;
  const target = `${process.env.NEXT_PUBLIC_API_URL}${path}${search}`;
  console.log("Proxying to:", target);

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  const response = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    // @ts-ignore
    duplex: "half",
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: new Headers(response.headers),
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;