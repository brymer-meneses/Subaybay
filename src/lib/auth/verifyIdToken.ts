/// Reference: 
/// https://firebase.google.com/docs/auth/admin/verify-id-tokens

import * as jose from "jose";
import { firebaseConfig } from "$lib/firebase";

async function getGoogleKeys(): Promise<Record<string, string>> {
  const response = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
  const keys = await response.json();
  return keys;
}

function validateHeader(header: jose.ProtectedHeaderParameters, keys: Record<string, string>): boolean {
  if (header.alg != "RS256") return false;
  if (!header.kid) return false;
  if (!Object.keys(keys).includes(header.kid)) return false;

  return true;
}

function validatePayload(payload: jose.JWTPayload): boolean {
  const projectId = firebaseConfig.projectId;
  const requiredFields = ["exp", "iat", "aud", "iss", "sub", "auth_time"];

  // validate that each key is present within the payload
  for (const field in requiredFields.values()) {
    if (!requiredFields.includes(field)) {
      return false;
    }
  }
  const now = Math.ceil(Date.now() / 1000);

  // `exp` expiration time must take place in the future
  if (payload.exp! <= now)
    return false;
  //
  // 'iat' issued-at-time must be in the past
  if (payload.iat! >= now)
    return false;

  // 'aud' must correspond to the firebase projectId
  if (payload.aud! != projectId)
    return false;

  if (payload.iss! != `https://securetoken.google.com/${projectId}`)
    return false

  // Must be a non - empty string and must be the uid of the user or device.
  if (payload.sub!.length === 0) {
    return false;
  }

  if (typeof payload.auth_time !== "number")
    return false;

  if (payload.auth_time >= now)
    return false;

  return true;
}

export async function verifyIdToken(idToken: string | null | undefined): Promise<boolean> {

  if (!idToken) return false;

  // ensure that we have a valid payload and header
  const keys = await getGoogleKeys();
  const header = jose.decodeProtectedHeader(idToken);
  const payload = jose.decodeJwt(idToken);

  if (!validatePayload(payload) || !validateHeader(header, keys)) {
    return false;
  }

  // verify integrity of JSON Web Token
  const publicKey = keys[header.kid!];
  const jwtKey = await jose.importX509(publicKey, header.alg!);

  try {
    await jose.jwtVerify(idToken, jwtKey);
    return true;
  } catch (_) {
    return false;
  }
}
