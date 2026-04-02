/**
 * LinkedIn API client via MATON Gateway.
 *
 * Routes LinkedIn REST API calls through gateway.maton.ai, which handles
 * OAuth token injection automatically based on the authorized MATON connection.
 *
 * Required env vars:
 *   MATON_API_KEY — MATON API key for gateway authentication
 *
 * Optional env vars:
 *   MATON_LINKEDIN_CONNECTION_ID — specific connection ID (if multiple LinkedIn connections)
 */

import { readFileSync } from 'node:fs';

const GATEWAY_BASE = 'https://gateway.maton.ai/linkedin';
const CTRL_BASE = 'https://ctrl.maton.ai';

function getApiKey(): string {
  const key = process.env['MATON_API_KEY'];
  if (!key) {
    throw new Error('MATON_API_KEY not set. Required for LinkedIn API access via MATON gateway.');
  }
  return key;
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202401',
    ...extra,
  };
  const connId = process.env['MATON_LINKEDIN_CONNECTION_ID'];
  if (connId) {
    h['x-maton-connection-id'] = connId;
  }
  return h;
}

// ---------------------------------------------------------------------------
// Connection management
// ---------------------------------------------------------------------------

export interface LinkedInConnection {
  connection_id: string;
  status: string;
  url: string;
  app: string;
  metadata: Record<string, any>;
}

/** Check LinkedIn connection status in MATON. */
export async function getConnectionStatus(): Promise<LinkedInConnection | null> {
  const res = await fetch(`${CTRL_BASE}/connections?app=linkedin`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to check LinkedIn connections: ${res.status}`);
  }
  const data = (await res.json()) as { connections: LinkedInConnection[] };
  const active = data.connections.find((c) => c.status === 'ACTIVE');
  return active ?? data.connections[0] ?? null;
}

/** Create a new LinkedIn connection in MATON. Returns the OAuth authorization URL. */
export async function createConnection(): Promise<{ connectionId: string; authUrl: string }> {
  const res = await fetch(`${CTRL_BASE}/connections`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ app: 'linkedin' }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create LinkedIn connection: ${res.status}`);
  }
  const data = (await res.json()) as { connection_id: string };

  // Fetch the connection to get the auth URL
  const connRes = await fetch(`${CTRL_BASE}/connections/${data.connection_id}`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
  });
  const connData = (await connRes.json()) as { connection: LinkedInConnection };
  return { connectionId: data.connection_id, authUrl: connData.connection.url };
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface LinkedInProfile {
  sub: string;
  name: string;
  email?: string;
}

/** Fetch the authenticated user's profile to verify connection. */
export async function getProfile(): Promise<LinkedInProfile> {
  const res = await fetch(`${GATEWAY_BASE}/v2/userinfo`, {
    headers: headers(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn profile fetch failed (${res.status}): ${body}`);
  }

  return (await res.json()) as LinkedInProfile;
}

// ---------------------------------------------------------------------------
// Posting
// ---------------------------------------------------------------------------

export interface TextPostResult {
  id: string;
}

/** Post a text-only update to LinkedIn. */
export async function postText(text: string, authorUrn: string): Promise<TextPostResult> {
  const payload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch(`${GATEWAY_BASE}/v2/ugcPosts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn post failed (${res.status}): ${body}`);
  }

  const id = res.headers.get('x-restli-id') ?? 'unknown';
  return { id };
}

/** Register an image upload via the gateway, upload the binary directly to LinkedIn's CDN. */
async function uploadImage(imagePath: string, ownerUrn: string): Promise<string> {
  // Step 1: Register upload through gateway
  const registerPayload = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: ownerUrn,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    },
  };

  const regRes = await fetch(`${GATEWAY_BASE}/v2/assets?action=registerUpload`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(registerPayload),
  });

  if (!regRes.ok) {
    const body = await regRes.text();
    throw new Error(`Image register failed (${regRes.status}): ${body}`);
  }

  const regData = (await regRes.json()) as any;
  const uploadUrl =
    regData.value.uploadMechanism[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ].uploadUrl;
  const asset = regData.value.asset as string;

  // Step 2: Upload binary directly to LinkedIn's CDN (NOT through the gateway)
  const imageBuffer = readFileSync(imagePath);
  const upRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: imageBuffer,
  });

  if (!upRes.ok) {
    const body = await upRes.text();
    throw new Error(`Image upload failed (${upRes.status}): ${body}`);
  }

  return asset;
}

export interface ImagePostResult {
  id: string;
  imageAsset: string;
}

/** Post a text + image update to LinkedIn. */
export async function postWithImage(
  text: string,
  imagePath: string,
  authorUrn: string,
  imageTitle?: string,
): Promise<ImagePostResult> {
  const imageAsset = await uploadImage(imagePath, authorUrn);

  const payload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'IMAGE',
        media: [
          {
            status: 'READY',
            media: imageAsset,
            title: { text: imageTitle ?? 'Post image' },
          },
        ],
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch(`${GATEWAY_BASE}/v2/ugcPosts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn image post failed (${res.status}): ${body}`);
  }

  const id = res.headers.get('x-restli-id') ?? 'unknown';
  return { id, imageAsset };
}

/** Verify credentials by fetching profile. Returns person URN sub. */
export async function verifyCredentials(): Promise<{ sub: string; name: string }> {
  const profile = await getProfile();
  return { sub: profile.sub, name: profile.name };
}
