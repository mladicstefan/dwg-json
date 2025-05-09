import 'dotenv/config'
import { AuthenticationClient, Scopes } from '@aps_sdk/authentication'
import { APS_BUCKET, APS_CLIENT } from '../config'
import { ModelDerivativeClient,View,OutputType } from '@aps_sdk/model-derivative'
import {
  OssClient,
  Region,
  PolicyKey
} from '@aps_sdk/oss'
import { getInternalToken } from './auth'


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



