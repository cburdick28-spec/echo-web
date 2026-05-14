"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AudioRecorder from "@/components/AudioRecorder";
import AudioPlayer from "@/components/AudioPlayer";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2 } from "lucide-react";
import type { Word } from "@/types";

export default function WordPracticeClient({ word }: { word: Word }) {
  const [uploading, setUploading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRecording = useCallback(
    async (blob: Blob) => {
      setUploading(true);
      try {
        const filename = `${word.id}/${Date.now()}.webm`;
        const { data, error } = await supabase.storage
          .from("audio")
          .upload(filename, blob, { contentType: "audio/webm" });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("audio")
          .getPublicUrl(filename);

        setRecordingUrl(urlData.publicUrl);
        setChecked(true);
        router.refresh();
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [word.id, supabase, router]
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Play native audio */}
      {word.audio_url && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Listen</p>
          <AudioPlayer src={word.audio_url} label="Native speaker" />
        </div>
      )}

      {/* Record yourself */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {recordingUrl ? "Recorded!" : "Record yourself"}
        </p>
        {uploading ? (
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        ) : recordingUrl ? (
          <div className="flex items-center gap-4">
            <AudioPlayer src={recordingUrl} label="Your recording" />
            <AudioRecorder onRecordingComplete={handleRecording} />
          </div>
        ) : (
          <AudioRecorder onRecordingComplete={handleRecording} />
        )}
      </div>

      {/* Check button */}
      {recordingUrl && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Practiced!</span>
          </div>
        </div>
      )}
    </div>
  );
}
