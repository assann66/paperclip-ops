/**
 * LinkedIn API client for posting content.
 *
 * Uses LinkedIn's REST API v2 with OAuth2 Bearer token.
 * Token can come from MATON connection or direct LinkedIn developer app.
 *
 * Required env vars:
 *   LINKEDIN_ACCESS_TOKEN — OAuth2 token with w_member_social scope
 *   LINKEDIN_PERSON_URN   — e.g. "urn:li:person:xxxxx" (your LinkedIn member URN)
 */

import { readFileSync } from 'node:fs';

const API_BASE = 'https://api.linkedin.com';

function getConfig() {
  const accessToken = process.env['LINKEDIN_ACCESS_TOKEN'];
  const personUrn = process.env['LINKEDIN_PERSON_URN'];

  if (!accessToken) {
    throw new Error(
      'LINKEDIN_ACCESS_TOKEN not set. Provide an OAuth2 token with w_member_social scope.',
    );
  }
  if (!personUrn) {
    throw new Error(
      'LINKEDIN_PERSON_URN not set. Set it to your LinkedIn member URN (e.g. urn:li:person:xxxxx).',
    );
  }

  return { accessToken, personUrn };
}

function headers(token: string, extra: Record<string, string> = {}): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202401',
    ...extra,
  };
}

export interface LinkedInProfile {
  sub: string;
  name: string;
  email?: string;
}

/** Fetch the authenticated user's profile to verify token and get person URN. */
export async function getProfile(): Promise<LinkedInProfile> {
  const { accessToken } = getConfig();

  const res = await fetch(`${API_BASE}/v2/userinfo`, {
    headers: headers(accessToken),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn profile fetch failed (${res.status}): ${body}`);
  }

  return (await res.json()) as LinkedInProfile;
}

export interface TextPostResult {
  id: string;
}

/** Post a text-only update to LinkedIn. */
export async function postText(text: string): Promise<TextPostResult> {
  const { accessToken, personUrn } = getConfig();

  const payload = {
    author: personUrn,
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

  const res = await fetch(`${API_BASE}/v2/ugcPosts`, {
    method: 'POST',
    headers: headers(accessToken),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn post failed (${res.status}): ${body}`);
  }

  const id = res.headers.get('x-restli-id') ?? 'unknown';
  return { id };
}

/** Register an image upload, upload the binary, then return the media asset URN. */
async function uploadImage(imagePath: string): Promise<string> {
  const { accessToken, personUrn } = getConfig();

  // Step 1: Register upload
  const registerPayload = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: personUrn,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    },
  };

  const regRes = await fetch(`${API_BASE}/v2/assets?action=registerUpload`, {
    method: 'POST',
    headers: headers(accessToken),
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

  // Step 2: Upload binary
  const imageBuffer = readFileSync(imagePath);
  const upRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
  imageTitle?: string,
): Promise<ImagePostResult> {
  const { accessToken, personUrn } = getConfig();

  const imageAsset = await uploadImage(imagePath);

  const payload = {
    author: personUrn,
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

  const res = await fetch(`${API_BASE}/v2/ugcPosts`, {
    method: 'POST',
    headers: headers(accessToken),
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
export async function verifyCredentials(): Promise<string> {
  const profile = await getProfile();
  return profile.sub;
}
