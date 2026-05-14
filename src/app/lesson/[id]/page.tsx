import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shuffle, ArrowRight } from "lucide-react";
import type { Word } from "@/types";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const { data: words } = await supabase
    .from("words")
    .select("*")
    .eq("course_id", id)
    .order("order_index");

  const wordList = (words || []) as Word[];
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[randomIndex];

  return (
    <div className="space-y-6">
      <header>
        <Link href="/" className="text-blue-500 text-sm hover:underline">← Back</Link>
        <h1 className="text-xl font-bold mt-1">{course.name}</h1>
        <p className="text-gray-500 text-sm">{wordList.length} words</p>
      </header>

      {randomWord && (
        <div className="text-center">
          <Link
            href={`/word/${randomWord.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Shuffle className="w-5 h-5" />
            <span>Shuffle</span>
          </Link>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">All Words</h2>
        <div className="space-y-1">
          {wordList.map((word) => (
            <Link
              key={word.id}
              href={`/word/${word.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div>
                <span className="font-medium">{word.text}</span>
                {word.native_text && (
                  <span className="text-gray-400 text-sm ml-2">{word.native_text}</span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
