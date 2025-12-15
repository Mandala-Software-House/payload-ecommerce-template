import jwt, { type JwtPayload } from "jsonwebtoken";
import { draftMode } from "next/headers";
import { type NextRequest } from "next/server";
import { getPayload, type User } from "payload";

import { type Locale } from "@/i18n/config";
import { redirect } from "@/i18n/routing";
import configPromise from "@payload-config";

const payloadToken = "payload-token";

export async function GET(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise });
  const token = request.cookies.get(payloadToken)?.value;
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const locale = searchParams.get("locale") as Locale;
  const draft = await draftMode();

  if (!path) {
    return new Response("No path provided", { status: 404 });
  }

  if (!token) {
    new Response("You are not allowed to preview this page", { status: 403 });
  }

  let user: User | JwtPayload | string | null = null;

  try {
    user = jwt.verify(token ?? "", payload.secret);
  } catch (error) {
    payload.logger.error(`Error verifying token for live preview: ${error instanceof Error ? error.message : String(error)}`);
  }

  // You can add additional checks here to see if the user is allowed to preview this page
  if (!user || (user as User).collection !== "administrators") {
    draft.disable();
    return new Response("You are not allowed to preview this page", { status: 403 });
  }

  draft.enable();
  return redirect({ href: path, locale });
}
