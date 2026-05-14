"use client";

import { useState, useRef, useCallback } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  label?: string;
}

export default function AudioPlayer({ src, label }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      setLoading(true);
      audio.play().catch(console.error);
    }
  }, [playing]);

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => { setPlaying(true); setLoading(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => { setLoading(false); setPlaying(false); }}
        preload="auto"
      />
      <button
        onClick={toggle}
        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        ) : playing ? (
          <Pause className="w-5 h-5 text-gray-700" />
        ) : (
          <Play className="w-5 h-5 text-gray-700" />
        )}
      </button>
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}
