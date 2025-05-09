import { NextResponse } from 'next/server'
import { getManifest } from '../../../../../services/aps'

export async function GET(
  _req: Request,
  context: { params: Promise<{ urn: string }> }
) {
  // await the params promise before reading .urn
  const { urn } = await context.params

  const manifest = await getManifest(urn)
  if (!manifest) {
    return NextResponse.json({ status: 'n/a' })
  }

  let messages: any[] = []
  for (const d of manifest.derivatives || []) {
    messages.push(...(d.messages || []))
    for (const c of d.children || []) messages.push(...(c.messages || []))
  }

  return NextResponse.json({
    status: manifest.status,
    progress: manifest.progress,
    messages
  })
}