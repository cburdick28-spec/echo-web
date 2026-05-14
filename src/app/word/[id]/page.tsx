import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SkipForward } from "lucide-react";
import WordPracticeClient from "./WordPracticeClient";
import type { Word } from "@/types";

export default async function WordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: word } = await supabase
    .from("words")
    .select("*")
    .eq("id", id)
    .single();

  if (!word) notFound();

  const { data: course } = await supabase
    .from("courses")
    .select("id, name")
    .eq("id", word.course_id)
    .single();

  const { data: nextWord } = await supabase
    .from("words")
    .select("id, text")
    .eq("course_id", word.course_id)
    .gt("order_index", word.order_index)
    .order("order_index")
    .limit(1)
    .single();

  return (
    <div className="space-y-8">
      <header>
        <Link
          href={`/lesson/${word.course_id}`}
          className="text-blue-500 text-sm hover:underline"
        >
          ← {course?.name || "Back to lesson"}
        </Link>
      </header>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{word.text}</h1>
        {word.native_text && (
          <p className="text-xl text-gray-400">{word.native_text}</p>
        )}
      </div>

      <WordPracticeClient word={word as Word} />

      {nextWord && (
        <div className="text-center pt-4">
          <Link
            href={`/word/${nextWord.id}`}
            className="inline-flex items-center gap-2 px-5 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5" />
            <span className="text-sm">Skip to {nextWord.text}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
