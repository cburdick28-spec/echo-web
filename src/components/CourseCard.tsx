import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Course } from "@/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/lesson/${course.id}`}
      className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.word_count} words · {course.language}</p>
        </div>
        <span className="text-gray-400">→</span>
      </div>
    </Link>
  );
}
