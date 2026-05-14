export interface Course {
  id: string;
  language: string;
  name: string;
  description: string;
  word_count: number;
  created_at: string;
}

export interface Word {
  id: string;
  course_id: string;
  text: string;
  native_text: string;
  audio_url?: string;
  order_index: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: 'enable_microphone' | 'download_course' | 'practice_word' | 'practice_ten' | 'reminder_7days';
  unlocked_at: string;
  seen: boolean;
}

export interface UserProgress {
  id: string;
  user_id: string;
  word_id: string;
  checked: boolean;
  last_practiced_at?: string;
}
