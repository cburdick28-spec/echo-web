"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, Check, Loader2 } from "lucide-react";
import type { Course } from "@/types";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", sample: [{ text: "Hello", native: "Hello" }, { text: "World", native: "World" }, { text: "Thank you", native: "Thank you" }, { text: "Good morning", native: "Good morning" }, { text: "Goodbye", native: "Goodbye" }] },
  { code: "es", name: "Español", flag: "🇪🇸", sample: [{ text: "Hola", native: "Hello" }, { text: "Mundo", native: "World" }, { text: "Gracias", native: "Thank you" }, { text: "Buenos días", native: "Good morning" }, { text: "Adiós", native: "Goodbye" }] },
];

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("courses").select("id, language").then(({ data }) => {
      if (data) setDownloaded(Object.fromEntries(data.map((c) => [c.language, true])));
    });
  }, []);

  const downloadCourse = useCallback(async (lang: typeof LANGUAGES[0]) => {
    setDownloading(lang.code);
    try {
      const { data: course } = await supabase
        .from("courses")
        .insert({ language: lang.code, name: `${lang.name} Basics`, description: `Basic ${lang.name} words`, word_count: lang.sample.length })
        .select().single();

      if (course) {
        const words = lang.sample.map((w, i) => ({
          course_id: course.id,
          text: w.text,
          native_text: w.native,
          order_index: i,
        }));
        await supabase.from("words").insert(words);
        setDownloaded((prev) => ({ ...prev, [lang.code]: true }));
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  }, [supabase]);

  // Fetch available courses
  useEffect(() => {
    supabase.from("courses").select("*").then(({ data }) => {
      if (data) setCourses(data as Course[]);
    });
  }, [downloaded]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Download Courses</h1>

      <div className="space-y-3">
        {LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            className="p-4 rounded-xl border border-gray-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <h3 className="font-semibold">{lang.name} Basics</h3>
                <p className="text-sm text-gray-500">{lang.sample.length} words</p>
              </div>
            </div>
            {downloaded[lang.code] ? (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <Check className="w-4 h-4" /> Downloaded
              </span>
            ) : (
              <button
                onClick={() => downloadCourse(lang)}
                disabled={downloading === lang.code}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm transition-colors"
              >
                {downloading === lang.code ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download
              </button>
            )}
          </div>
        ))}
      </div>

      {courses.length > 0 && (
        <div className="pt-4">
          <h2 className="text-lg font-semibold mb-2">Downloaded Courses</h2>
          <div className="space-y-1 text-sm text-gray-600">
            {courses.map((c) => (
              <div key={c.id} className="flex justify-between py-1 border-b border-gray-100">
                <span>{c.name}</span>
                <span>{c.word_count} words</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
