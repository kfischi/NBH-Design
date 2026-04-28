/**
 * Edge middleware — protects /admin/* with HTTP Basic Auth.
 *
 * This is intentionally simple. NextAuth is documented in INTEGRATIONS.md
 * but isn't actually wired up yet, so Basic Auth is the temporary measure
 * until that work happens.
 *
 * Set ADMIN_BASIC_USER and ADMIN_BASIC_PASSWORD in Netlify env.
 */

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="NBH Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest): NextResponse {
  const expectedUser = process.env.ADMIN_BASIC_USER;
  const expectedPass = process.env.ADMIN_BASIC_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const header = req.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized();
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  if (
    !constantTimeEqual(user, expectedUser) ||
    !constantTimeEqual(pass, expectedPass)
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}
