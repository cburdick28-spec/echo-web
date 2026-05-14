export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import { Trophy } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: unseenBadges } = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true })
    .eq("seen", false);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Echo</h1>
          <p className="text-gray-500 text-sm">Pronunciation practice</p>
        </div>
        <Link
          href="/achievements"
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Trophy className="w-6 h-6 text-yellow-500" />
          {unseenBadges ? (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {unseenBadges > 9 ? "9+" : unseenBadges}
            </span>
          ) : null}
        </Link>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-3">Your Courses</h2>
        {courses && courses.length > 0 ? (
          <div className="space-y-2">
            {(courses as Course[]).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No courses yet</p>
            <Link href="/download" className="text-blue-500 underline mt-2 inline-block">
              Download a course
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
