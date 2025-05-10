// app/api/models/[urn]/metadata/route.ts

import { NextResponse } from 'next/server'
import {
  getManifest,
  listModelViews,
  getObjectTree,
  getAllProperties,
  queryProperties
} from '@/services/aps'

export async function GET(
  _req: Request,
  context: { params: Promise<{ urn: string }> }
) {
  // Await dynamic params
  const { urn } = await context.params

  try {
    const manifest = await getManifest(urn)
    console.log('📝 Manifest:', JSON.stringify(manifest, null, 2))

    const views = await listModelViews(urn)
    console.log('🗂️ Model Views:', JSON.stringify(views, null, 2))

    const objectTrees: Record<string, any> = {}
    const allProperties: Record<string, any> = {}
    const queriedProperties: Record<string, any> = {}

    for (const view of views) {
      const guid = view.guid

      const tree = await getObjectTree(urn, guid)
      console.log(`🌲 Object Tree [${guid}]:`, JSON.stringify(tree, null, 2))
      objectTrees[guid] = tree

      const props = await getAllProperties(urn, guid)
      console.log(`📋 All Properties [${guid}]:`, JSON.stringify(props, null, 2))
      allProperties[guid] = props

      try {
        const ids = tree?.data?.objects?.map((o: any) => o.objectid)
        if (Array.isArray(ids) && ids.length) {
          const subset = ids.slice(0, 10)
          const qp = await queryProperties(urn, guid, subset, ['Dimensions'])
          console.log(`🔍 Queried Dimensions [${guid}]:`, JSON.stringify(qp, null, 2))
          queriedProperties[guid] = qp
        }
      } catch (e) {
        console.warn(`⚠️ queryProperties failed for view ${guid}:`, e)
      }
    }

    return NextResponse.json({ manifest, views, objectTrees, allProperties, queriedProperties })

  } catch (error: any) {
    console.error('❌ Error extracting metadata for URN', context, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
