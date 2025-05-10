
import { NextResponse } from 'next/server'
import {
  getManifest,
  listModelViews,
  getObjectTree,
  getAllProperties
} from '@/services/aps'

export async function GET(
  _req: Request,
  context: { params: Promise<{ urn: string }> }
) {
  const { urn } = await context.params

  try {
    const manifest = await getManifest(urn)
    console.log('📝 Full Manifest:', JSON.stringify(manifest, null, 2))

    if (manifest.progress !== 'complete' || manifest.status !== 'success') {
      return NextResponse.json(
        { status: manifest.progress || manifest.status },
        { status: 202 }
      )
    }

    const views = await listModelViews(urn)
    console.log('🗂️ Model Views:', JSON.stringify(views, null, 2))

    const results: Record<string, any> = {}

    for (const { guid, name, role } of views) {
      let tree
      do {
        tree = await getObjectTree(urn, guid)
      } while (!tree.data || !Array.isArray(tree.data.objects))
      console.log(`🌲 Object Tree [${guid} - ${role}/${name}]:`, JSON.stringify(tree.data.objects, null, 2))

      let props
      do {
        props = await getAllProperties(urn, guid)
      } while (!props.data || !Array.isArray(props.data.collection))
      console.log(`📋 Properties [${guid} - ${role}/${name}]:`, JSON.stringify(props.data.collection, null, 2))

      results[guid] = {
        viewName: name,
        viewRole: role,
        objects: tree.data.objects,
        properties: props.data.collection
      }
    }

    return NextResponse.json({ manifest, views, results })
  } catch (error: any) {
    console.error('❌ Error extracting metadata for URN', urn, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
