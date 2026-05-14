"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, Check, Loader2, BookOpen, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", desc: "Master 500+ essential English words", learners: "1.5B+", words: 500 },
  { code: "es", name: "Español", flag: "🇪🇸", desc: "500+ palabras españolas esenciales", learners: "600M+", words: 500 },
  { code: "fr", name: "Français", flag: "🇫🇷", desc: "Maîtrisez le vocabulaire français essentiel", learners: "300M+", words: 50 },
  { code: "de", name: "Deutsch", flag: "🇩🇪", desc: "Meistern Sie den deutschen Grundwortschatz", learners: "200M+", words: 50 },
  { code: "ja", name: "日本語", flag: "🇯🇵", desc: "必須日本語単語をマスター", learners: "130M+", words: 50 },
  { code: "ko", name: "한국어", flag: "🇰🇷", desc: "필수 한국어 단어 마스터", learners: "80M+", words: 50 },
  { code: "it", name: "Italiano", flag: "🇮🇹", desc: "Padroneggia il vocabolario italiano essenziale", learners: "70M+", words: 50 },
  { code: "pt", name: "Português", flag: "🇧🇷", desc: "Domine o vocabulário português essencial", learners: "260M+", words: 50 },
];

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState<Record<string, string>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("courses").select("id, language").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((c: any) => { map[c.language] = c.id; });
        setDownloaded(map);
      }
    });
  }, []);

  const downloadCourse = useCallback(async (lang: typeof LANGUAGES[0]) => {
    setDownloading(lang.code);
    setMessage("");
    try {
      // Create course in Supabase
      const { data: course } = await supabase.from("courses").insert({
        language: lang.code, name: lang.name,
        description: lang.desc, word_count: 0
      }).select().single();

      if (!course) throw new Error("Failed to create course");

      // Seed words via API
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang.code, courseId: course.id }),
      });
      const result = await res.json();
      
      if (result.success) {
        setDownloaded(prev => ({ ...prev, [lang.code]: course.id }));
        setMessage(`✅ ${result.count} words added to ${lang.name}!`);
      } else {
        setMessage(`❌ ${result.error || "Failed to seed words"}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setDownloading(null);
    }
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-gray-500 text-sm mt-1">Download a language pack to start practicing pronunciation</p>
        {message && <p className="text-sm mt-2 font-medium">{message}</p>}
      </div>

      <div className="space-y-3">
        {LANGUAGES.map((lang) => (
          <div key={lang.code} className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{lang.name}</h3>
                <p className="text-sm text-gray-500">{lang.desc}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lang.words}+ words</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {lang.learners} learners</span>
                </div>
              </div>
              {downloaded[lang.code] ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium shrink-0">
                  <Check className="w-4 h-4" /> Downloaded
                </span>
              ) : (
                <button
                  onClick={() => downloadCourse(lang)}
                  disabled={downloading === lang.code}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium shrink-0 transition-colors"
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
          </div>
        ))}
      </div>
    </div>
  );
}
