import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { listObjects,uploadObject,translateObject,urnify } from '@/services/aps'

export async function GET() {
    const items = await listObjects()
    return NextResponse.json(
      items.map(o => ({ name: o.objectKey, urn: urnify(o.objectId!) }))
    )
}

export async function POST(request: NextRequest) {
    const form = await request.formData()
    const file = form.get('model-file') as File | null
    const entry = (form.get('model-zip-entrypoint') as string) || undefined
  
    if (!file) {
      return NextResponse.json({ error: 'Missing "model-file"' }, { status: 400 })
    }
  
    const buffer = Buffer.from(await file.arrayBuffer())
    const tmpPath = path.join(os.tmpdir(), file.name)
    await fs.writeFile(tmpPath, buffer)
  
    const obj = await uploadObject(file.name, tmpPath)
    await translateObject(urnify(obj.objectId!), entry)
  
    return NextResponse.json({ name: obj.objectKey, urn: urnify(obj.objectId!) })
  }