/// Reference:
/// https://firebase.google.com/docs/auth/admin/verify-id-tokens

import * as jose from "jose";
import { firebaseConfig } from "$lib/firebase";

// some ugly code that i am too lazy to refactor rn
let __keyExpiresAt: number | undefined;
let __keys: Record<string, string> | undefined;

async function getGoogleKeys(): Promise<Record<string, string>> {
  if (__keyExpiresAt! >= Date.now() || !__keys) {
    const response = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
    );
    __keys = await response.json();
    // @ts-ignore
    __keyExpiresAt = response.headers.expiration! * 1000;
  }
  return __keys!;
}

function validateHeader(
  header: jose.ProtectedHeaderParameters,
  keys: Record<string, string>,
): boolean {
  if (header.alg != "RS256") return false;
  if (!header.kid) return false;
  if (!Object.keys(keys).includes(header.kid)) return false;

  return true;
}

function validatePayload(payload: jose.JWTPayload): { success: boolean, message: string } {
  const projectId = firebaseConfig.projectId;
  const requiredFields = ["exp", "iat", "aud", "iss", "sub", "auth_time"];

  // validate that each key is present within the payload
  for (const field in requiredFields.values()) {
    if (!requiredFields.includes(field)) {
      return { success: false, message: `Missing field ${field}` }
    };
  }

  const now = Math.floor(Date.now() / 1000);

  // `exp` expiration time must take place in the future
  if (payload.exp! <= now) return { success: false, message: `Expiratio time must take place in the future` }
  //
  // 'iat' issued-at-time must be in the past
  if (payload.iat! >= now) return { success: false, message: `issued-at-time must be in the past` }

  // 'aud' must correspond to the firebase projectId
  if (payload.aud! != projectId) return { success: false, message: `must correspond to the firebase projectId` }

  if (payload.iss! != `https://securetoken.google.com/${projectId}`)
    return { success: false, message: `invalid iss` }

  // Must be a non - empty string and must be the uid of the user or device.
  if (payload.sub!.length === 0) {
    return { success: false, message: `sub must not be nonempty` }
  }

  if (typeof payload.auth_time !== "number") return { success: false, message: `auth_time must be a number` }

  if (payload.auth_time >= now) return { success: false, message: `auth_time must be a number` }

  return { success: true, message: "success" };
}

export async function verifyIdToken(
  idToken: string | undefined,
): Promise<{ success: boolean, message: string }> {

  if (!idToken) return { success: false, message: "invalid id token" }

  // ensure that we have a valid payload and header
  const keys = await getGoogleKeys();
  const header = jose.decodeProtectedHeader(idToken);
  const payload = jose.decodeJwt(idToken);

  if (!validateHeader(header, keys)) {
    return { success: false, message: "Invalid payload" }
  }

  const { success, message } = validatePayload(payload);
  if (!success) {
    return { success: false, message }
  }

  // verify integrity of JSON Web Token
  const publicKey = keys[header.kid!];
  const jwtKey = await jose.importX509(publicKey, header.alg!);

  try {
    await jose.compactVerify(idToken, jwtKey);
    return { success: true, message: "success" };
  } catch (e) {
    return { success: false, message: "Failed to verify signature" };
  }
}
