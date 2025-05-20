import 'dotenv/config';

const {
  APS_CLIENT_ID,
  APS_CLIENT_SECRET,
  APS_BUCKET: rawBucket,
  NEXT_PUBLIC_PORT,
} = process.env;

if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
  console.error('MISSING APS CREDENTIALS');
  process.exit(1);
}

export const PORT = NEXT_PUBLIC_PORT || '3000';
export const APS_BUCKET = rawBucket || `${APS_CLIENT_ID.toLowerCase()}-projects`;
export const APS_CLIENT = {
  id: APS_CLIENT_ID,
  secret: APS_CLIENT_SECRET,
};