"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mic, Download, MessageCircle, Star, Bell, Lock } from "lucide-react";
import type { Achievement } from "@/types";

const BADGES = [
  { type: "enable_microphone", icon: Mic, label: "First Mic", desc: "Enabled microphone access", color: "text-red-500" },
  { type: "download_course", icon: Download, label: "Learner", desc: "Downloaded your first course", color: "text-blue-500" },
  { type: "practice_word", icon: MessageCircle, label: "First Practice", desc: "Practiced your first word", color: "text-green-500" },
  { type: "practice_ten", icon: Star, label: "Dedicated", desc: "Practiced 10 words", color: "text-yellow-500" },
  { type: "reminder_7days", icon: Bell, label: "Consistent", desc: "7-day practice streak", color: "text-purple-500" },
] as const;

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("achievements").select("*").then(({ data }) => {
      if (data) setAchievements(data as Achievement[]);
    });
  }, []);

  const unlockedMap = Object.fromEntries(
    achievements.map((a) => [a.type, a])
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Achievements</h1>

      <div className="space-y-3">
        {BADGES.map((badge) => {
          const unlocked = unlockedMap[badge.type];
          return (
            <div
              key={badge.type}
              className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                unlocked
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-gray-200 opacity-50"
              }`}
            >
              <div className={`p-2 rounded-lg ${unlocked ? "bg-white" : "bg-gray-100"}`}>
                {unlocked ? (
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{badge.label}</h3>
                <p className="text-sm text-gray-500">
                  {unlocked
                    ? `Unlocked ${new Date(unlocked.unlocked_at).toLocaleDateString()}`
                    : badge.desc}
                </p>
              </div>
              {unlocked && !unlocked.seen && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
