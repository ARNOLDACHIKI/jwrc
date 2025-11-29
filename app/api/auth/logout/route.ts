import { NextResponse } from "next/server"

export async function POST() {
  // Clear cookie by setting Max-Age=0
  const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  return NextResponse.json({ ok: true }, { status: 200, headers: { "Set-Cookie": cookie } })
}
