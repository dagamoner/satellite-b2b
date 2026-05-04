import { handlers } from "../../../auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  cookies();
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  cookies();
  return handlers.POST(req);
}

export const dynamic = "force-dynamic";
