// A very simple, insecure pseudo-JWT implementation for demonstration purposes.
// In a real application, use a library like 'jsonwebtoken' and a secret key.

import { User } from "./types";

const SECRET_KEY = 'your-super-secret-key-that-is-long-and-secure';

// Base64Url encoding
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Base64Url decoding
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}


export function createToken(payload: Omit<User, 'password'>): string {
    const header = { alg: 'none', typ: 'JWT' }; // Insecure, for demo only
    
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    // In a real JWT, a signature would be created here using the secret key.
    // e.g., const signature = crypto.createHmac('sha256', SECRET_KEY).update(`${encodedHeader}.${encodedPayload}`).digest('base64url');
    // For this demo, we'll use an empty signature.
    const signature = '';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function decodeToken(token: string): User | null {
    try {
        const [encodedHeader, encodedPayload, signature] = token.split('.');

        if (!encodedHeader || !encodedPayload) {
            return null;
        }

        // In a real JWT, you would verify the signature here.
        // For this demo, we skip verification.

        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        return payload as User;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}
