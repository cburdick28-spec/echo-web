import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id");
  const supabase = await createClient();
  let query = supabase.from("words").select("*");
  if (courseId) query = query.eq("course_id", courseId);
  const { data, error } = await query.order("order_index");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
