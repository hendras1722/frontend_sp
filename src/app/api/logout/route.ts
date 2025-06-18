import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookiesStore = await cookies()
  cookiesStore.delete('me')
  return NextResponse.json({ message: 'Logged out' })
}
