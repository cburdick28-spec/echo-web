# Echo — Pronunciation Practice (Web)

> The best way to practice speaking English or Spanish — now on the web.

Built from the [fulldecent/echo](https://github.com/fulldecent/echo) iOS app, this is a web-based version using modern tooling.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, React Server Components, Turbopack) |
| Hosting | **Vercel** (edge-optimized deployment) |
| Database | **Supabase** (PostgreSQL + Auth + Storage) |
| Styling | **Tailwind CSS v4** |
| Icons | **Lucide React** |
| Audio | **Web Audio API** (MediaRecorder + getUserMedia) |
| Auth | **Supabase Auth** (email/password, magic link, OAuth) |

## Features

- **Home Screen** — Active courses list, achievement badge count
- **Lesson Screen** — Shuffle button, word list for each course
- **Word Practice** — Play native audio, record yourself, skip to next word
- **Download** — Download language courses (English, Spanish)
- **Achievements** — Unlock badges: First Mic, Learner, First Practice, Dedicated, Consistent

## Audio Architecture (fixes from iOS)

The original app relied on native AVAudioEngine. The web version uses:

- **MediaRecorder API** with `audio/webm;codecs=opus` for efficient recording
- **`getUserMedia`** with optimized constraints: `echoCancellation: false`, `noiseSuppression: true`, `autoGainControl: true`
- Recordings upload to **Supabase Storage** (public bucket `audio`)
- Playback via `<audio>` element with preloading

### Audio fixes applied:
- Removed echo cancellation (was causing garbled audio)
- Added noise suppression for cleaner recordings
- OPUS codec for 10x smaller files vs WAV
- Mono channel (44.1kHz) optimized for speech

## Getting Started

### 1. Set up Supabase

```bash
# Go to https://supabase.com and create a new project
# Run the migration:
supabase db push
```

### 2. Configure environment

Copy `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

```bash
# Push to GitHub, then import in Vercel
# Or deploy directly:
npx vercel
```

## Project Structure

```
src/
├── app/
│   ├── achievements/     # Badge/achievements screen
│   ├── api/              # REST API (courses, words)
│   ├── download/         # Course download screen
│   ├── lesson/[id]/      # Lesson view with word list
│   ├── word/[id]/        # Word practice (record + playback)
│   ├── layout.tsx        # Root layout + NavBar
│   └── page.tsx          # Home page
├── components/
│   ├── AudioRecorder.tsx  # Web Audio API recorder
│   ├── AudioPlayer.tsx    # Audio playback component
│   ├── CourseCard.tsx     # Course listing card
│   └── NavBar.tsx         # Bottom navigation
├── lib/supabase/          # Supabase client configs
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client (RSC)
│   └── middleware.ts       # Session refresh middleware
└── types/                 # TypeScript types
supabase/
└── migrations/            # Database schema
```

## Database Schema

- **courses** — Language courses (id, language, name, word_count)
- **words** — Words in courses (text, native_text, audio_url, order_index)
- **achievements** — User badge unlocks (type, unlocked_at, seen)
- **user_progress** — Per-word practice tracking (checked, last_practiced_at)

## License

MIT — built by studying [fulldecent/echo](https://github.com/fulldecent/echo) (c) William Entriken.
