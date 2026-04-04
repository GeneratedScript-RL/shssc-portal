import { NextResponse } from "next/server";
import { requireApiUser } from "@/app/api/_helpers";
import { getAccessLevels } from "@/lib/supabase/queries";

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const accessLevels = await getAccessLevels();
  return NextResponse.json({ accessLevels });
}
