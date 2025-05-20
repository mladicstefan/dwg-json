import 'dotenv/config'
import { APS_BUCKET } from '../config'
import { ModelDerivativeClient,View,OutputType } from '@aps_sdk/model-derivative'
import {
  OssClient,
  Region,
  PolicyKey
} from '@aps_sdk/oss'
import { getInternalToken } from './auth'

const BASE_URL = 'https://developer.api.autodesk.com'

const derivativeClient = new ModelDerivativeClient();
const ossClient = new OssClient();

export async function ensureBucketExists(bucketKey: string){
    const token = await getInternalToken();
    try{
        await ossClient.getBucketDetails(bucketKey, {accessToken: token});
    } catch(err:any) {
        if(err.axiosError?.response?.status === 404){
            await ossClient.createBucket(
                Region.Us,
                {bucketKey, policyKey: PolicyKey.Temporary},
                {accessToken: token}
            )
        } else {
            throw err
        }
    }
}

export async function listObjects(){
    await ensureBucketExists(APS_BUCKET);
    const token = await getInternalToken();
    let resp = await ossClient.getObjects(APS_BUCKET, {limit: 64, accessToken:token});
    let items = resp.items;
    while (resp.next){
        const startAt = new URL(resp.next).searchParams.get("startAt")!
        resp = await ossClient.getObjects(APS_BUCKET, {limit: 64, accessToken:token});
        items = items.concat(resp.items);
    }
    return items;
}

export async function uploadObject(objectName: string, filePath: string) {
    await ensureBucketExists(APS_BUCKET)
    const token = await getInternalToken()
    return await ossClient.uploadObject(APS_BUCKET, objectName, filePath, { accessToken: token })
    }


export async function getManifest(urn: string) {
    const token = await getInternalToken()
    try {
      return await derivativeClient.getManifest(urn, { accessToken: token })
    } catch (err: any) {
      if (err.axiosError?.response?.status === 404) return null
      throw err
    }
  }
  
  export function urnify(id: string) {
    return Buffer.from(id).toString('base64').replace(/=/g, '')
  }

/**
 * Kick off a SVF2 translation job.
 * @param urn  Base64 URN from `urnify(...)`
 * @param rootFilename optional entry‐point inside a zip
 */
export async function translateObject(
  urn: string,
  rootFilename?: string
): Promise<void> {
  const token = await getInternalToken()
  const body: any = {
    input: { urn }
  }
  if (rootFilename) body.input.rootFilename = rootFilename
  body.output = {
    formats: [{ type: 'svf2', views: ['2d', '3d'] }]
  }

const res = await fetch(
    `${BASE_URL}/modelderivative/v2/designdata/job`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
  if (!res.ok) {
    throw new Error(`translateObject failed: ${res.statusText}`)
  }
}


export async function listModelViews(
  urn: string
): Promise<Array<{ name: string; role: string; guid: string }>> {
  const token = await getInternalToken()
  const res = await fetch(
    `${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    throw new Error(`listModelViews failed: ${res.statusText}`)
  }
  const { data } = await res.json()
  return data.metadata
}

/**
 * 2 & 4. Get object hierarchy (optional `objectId` for a sub‐tree)
 * Returns `{ result: 'success' }` if still processing, otherwise full tree
 */
export async function getObjectTree(
  urn: string,
  modelGuid: string,
  objectId?: number
): Promise<any> {
  const token = await getInternalToken()
  let url = `${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}`
  if (objectId != null) url += `?${objectId}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    throw new Error(`getObjectTree failed: ${res.statusText}`)
  }
  return res.json()
}

/** 3. Fetch all properties for every object in the viewable */
export async function getAllProperties(
  urn: string,
  modelGuid: string
): Promise<any> {
  const token = await getInternalToken()
  const res = await fetch(
    `${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    throw new Error(`getAllProperties failed: ${res.statusText}`)
  }
  return res.json()
}

/**
 * 5. Query specific object IDs & property categories
 * @param objectIds     array of integer object IDs
 * @param propCategories array of category names (e.g. ["Dimensions"])
 */
export async function queryProperties(
  urn: string,
  modelGuid: string,
  objectIds: number[],
  propCategories: string[]
): Promise<any> {
  const token = await getInternalToken()
  const body = {
    objectIds,
    propFilter: { categories: propCategories }
  }
  const res = await fetch(
    `${BASE_URL}/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties:query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
  if (!res.ok) {
    throw new Error(`queryProperties failed: ${res.statusText}`)
  }
  return res.json()
}