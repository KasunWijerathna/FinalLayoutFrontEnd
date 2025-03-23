import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getUser() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  return token;
} 