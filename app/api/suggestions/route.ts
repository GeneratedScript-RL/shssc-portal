import { NextResponse } from "next/server";
import { getPublicSuggestions } from "@/lib/supabase/queries";

export async function GET() {
  const suggestions = await getPublicSuggestions();
  return NextResponse.json({ suggestions });
}
