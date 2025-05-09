import 'dotenv/config'
import { AuthenticationClient, Scopes } from '@aps_sdk/authentication'
import { APS_CLIENT } from '../config'

const authClient = new AuthenticationClient();


export async function getViewerToken(): Promise<string> {
  const creds = await authClient.getTwoLeggedToken(
    APS_CLIENT.id,
    APS_CLIENT.secret,
    [Scopes.ViewablesRead]
  );
  return creds.access_token;
}

export async function getInternalToken(): Promise<string> {
  const creds = await authClient.getTwoLeggedToken(
    APS_CLIENT.id,
    APS_CLIENT.secret,
    [
      Scopes.DataRead,
      Scopes.DataWrite,
      Scopes.DataCreate,
      Scopes.BucketRead,
      Scopes.BucketCreate
    ]
  );
  return creds.access_token;
}


