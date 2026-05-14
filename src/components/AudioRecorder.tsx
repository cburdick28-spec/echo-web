"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [state, setState] = useState<"idle" | "recording" | "processing">("idle");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setState("processing");
        onRecordingComplete(blob);
        setState("idle");
      };

      recorder.onerror = () => {
        setError("Recording failed");
        setState("idle");
      };

      recorder.start();
      setState("recording");
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access denied"
          : "Could not access microphone"
      );
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-sm text-center">
        <p>{error}</p>
        <button onClick={startRecording} className="underline mt-1">Try again</button>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="flex items-center justify-center gap-2 text-blue-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Processing...</span>
      </div>
    );
  }

  return (
    <button
      onClick={state === "idle" ? startRecording : stopRecording}
      disabled={disabled}
      className={`p-4 rounded-full transition-all ${
        state === "recording"
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white disabled:opacity-50`}
      aria-label={state === "recording" ? "Stop recording" : "Start recording"}
    >
      {state === "recording" ? (
        <Square className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}
