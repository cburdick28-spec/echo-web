"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Download, Check, Loader2, Globe, Users, BookOpen } from "lucide-react";

const englishWords = [
  { text: "Hello", native: "Hello" },{ text: "Goodbye", native: "Goodbye" },{ text: "Please", native: "Please" },{ text: "Thank you", native: "Thank you" },{ text: "Sorry", native: "Sorry" },{ text: "Yes", native: "Yes" },{ text: "No", native: "No" },{ text: "Maybe", native: "Maybe" },{ text: "Excuse me", native: "Excuse me" },{ text: "Help", native: "Help" },{ text: "Friend", native: "Friend" },{ text: "Family", native: "Family" },{ text: "Water", native: "Water" },{ text: "Food", native: "Food" },{ text: "House", native: "House" },{ text: "Street", native: "Street" },{ text: "Morning", native: "Morning" },{ text: "Evening", native: "Evening" },{ text: "Night", native: "Night" },{ text: "Today", native: "Today" },{ text: "Tomorrow", native: "Tomorrow" },{ text: "Yesterday", native: "Yesterday" },{ text: "Work", native: "Work" },{ text: "School", native: "School" },{ text: "Money", native: "Money" },{ text: "Beautiful", native: "Beautiful" },{ text: "Happy", native: "Happy" },{ text: "Sad", native: "Sad" },{ text: "Big", native: "Big" },{ text: "Small", native: "Small" },{ text: "Hot", native: "Hot" },{ text: "Cold", native: "Cold" },{ text: "Fast", native: "Fast" },{ text: "Slow", native: "Slow" },{ text: "Open", native: "Open" },{ text: "Close", native: "Close" },{ text: "Love", native: "Love" },{ text: "Time", native: "Time" },{ text: "World", native: "World" },{ text: "Music", native: "Music" },{ text: "Phone", native: "Phone" },{ text: "Computer", native: "Computer" },{ text: "Travel", native: "Travel" },{ text: "Airport", native: "Airport" },{ text: "Hospital", native: "Hospital" },{ text: "Restaurant", native: "Restaurant" },{ text: "Hotel", native: "Hotel" },{ text: "Market", native: "Market" },{ text: "Weather", native: "Weather" },{ text: "Language", native: "Language" }
];

const spanishWords = [
  { text: "Hola", native: "Hello" },{ text: "Adiós", native: "Goodbye" },{ text: "Por favor", native: "Please" },{ text: "Gracias", native: "Thank you" },{ text: "Lo siento", native: "Sorry" },{ text: "Sí", native: "Yes" },{ text: "No", native: "No" },{ text: "Quizás", native: "Maybe" },{ text: "Disculpe", native: "Excuse me" },{ text: "Ayuda", native: "Help" },{ text: "Amigo", native: "Friend" },{ text: "Familia", native: "Family" },{ text: "Agua", native: "Water" },{ text: "Comida", native: "Food" },{ text: "Casa", native: "House" },{ text: "Calle", native: "Street" },{ text: "Mañana", native: "Morning" },{ text: "Tarde", native: "Evening" },{ text: "Noche", native: "Night" },{ text: "Hoy", native: "Today" },{ text: "Bueno", native: "Good" },{ text: "Malo", native: "Bad" },{ text: "Grande", native: "Big" },{ text: "Pequeño", native: "Small" },{ text: "Bonito", native: "Beautiful" },{ text: "Feliz", native: "Happy" },{ text: "Triste", native: "Sad" },{ text: "Dinero", native: "Money" },{ text: "Trabajo", native: "Work" },{ text: "Escuela", native: "School" },{ text: "Hospital", native: "Hospital" },{ text: "Mercado", native: "Market" },{ text: "Caliente", native: "Hot" },{ text: "Frío", native: "Cold" },{ text: "Rápido", native: "Fast" },{ text: "Lento", native: "Slow" },{ text: "Amor", native: "Love" },{ text: "Tiempo", native: "Time" },{ text: "Mundo", native: "World" },{ text: "Música", native: "Music" },{ text: "Teléfono", native: "Phone" },{ text: "Viaje", native: "Travel" },{ text: "Puerta", native: "Door" },{ text: "Ventana", native: "Window" },{ text: "Coche", native: "Car" },{ text: "Perro", native: "Dog" },{ text: "Gato", native: "Cat" },{ text: "Libro", native: "Book" },{ text: "Sol", native: "Sun" },{ text: "Luna", native: "Moon" }
];

const frenchWords = [
  { text: "Bonjour", native: "Hello" },{ text: "Au revoir", native: "Goodbye" },{ text: "Merci", native: "Thank you" },{ text: "Pardon", native: "Sorry" },{ text: "Oui", native: "Yes" },{ text: "Non", native: "No" },{ text: "S'il vous plaît", native: "Please" },{ text: "Eau", native: "Water" },{ text: "Ami", native: "Friend" },{ text: "Famille", native: "Family" },{ text: "Maison", native: "House" },{ text: "Rue", native: "Street" },{ text: "Bon", native: "Good" },{ text: "Mauvais", native: "Bad" },{ text: "Grand", native: "Big" },{ text: "Petit", native: "Small" },{ text: "Beau", native: "Beautiful" },{ text: "Heureux", native: "Happy" },{ text: "Triste", native: "Sad" },{ text: "Aujourd'hui", native: "Today" },{ text: "Nourriture", native: "Food" },{ text: "Travail", native: "Work" },{ text: "École", native: "School" },{ text: "Argent", native: "Money" },{ text: "Amour", native: "Love" },{ text: "Temps", native: "Time" },{ text: "Monde", native: "World" },{ text: "Musique", native: "Music" },{ text: "Voyage", native: "Travel" },{ text: "Hôpital", native: "Hospital" },{ text: "Marché", native: "Market" },{ text: "Chaud", native: "Hot" },{ text: "Froid", native: "Cold" },{ text: "Rapide", native: "Fast" },{ text: "Lent", native: "Slow" },{ text: "Porte", native: "Door" },{ text: "Fenêtre", native: "Window" },{ text: "Voiture", native: "Car" },{ text: "Chien", native: "Dog" },{ text: "Chat", native: "Cat" },{ text: "Livre", native: "Book" },{ text: "Soleil", native: "Sun" },{ text: "Lune", native: "Moon" },{ text: "Matin", native: "Morning" },{ text: "Soir", native: "Evening" },{ text: "Nuit", native: "Night" },{ text: "Restaurant", native: "Restaurant" },{ text: "Hôtel", native: "Hotel" },{ text: "Téléphone", native: "Phone" },{ text: "Ordinateur", native: "Computer" }
];

const germanWords = [
  { text: "Hallo", native: "Hello" },{ text: "Tschüss", native: "Goodbye" },{ text: "Bitte", native: "Please" },{ text: "Danke", native: "Thank you" },{ text: "Entschuldigung", native: "Sorry" },{ text: "Ja", native: "Yes" },{ text: "Nein", native: "No" },{ text: "Vielleicht", native: "Maybe" },{ text: "Hilfe", native: "Help" },{ text: "Freund", native: "Friend" },{ text: "Familie", native: "Family" },{ text: "Wasser", native: "Water" },{ text: "Essen", native: "Food" },{ text: "Haus", native: "House" },{ text: "Straße", native: "Street" },{ text: "Gut", native: "Good" },{ text: "Schlecht", native: "Bad" },{ text: "Groß", native: "Big" },{ text: "Klein", native: "Small" },{ text: "Schön", native: "Beautiful" },{ text: "Glücklich", native: "Happy" },{ text: "Traurig", native: "Sad" },{ text: "Heute", native: "Today" },{ text: "Morgen", native: "Tomorrow" },{ text: "Geld", native: "Money" },{ text: "Arbeit", native: "Work" },{ text: "Schule", native: "School" },{ text: "Liebe", native: "Love" },{ text: "Zeit", native: "Time" },{ text: "Welt", native: "World" },{ text: "Musik", native: "Music" },{ text: "Reise", native: "Travel" },{ text: "Krankenhaus", native: "Hospital" },{ text: "Markt", native: "Market" },{ text: "Heiß", native: "Hot" },{ text: "Kalt", native: "Cold" },{ text: "Schnell", native: "Fast" },{ text: "Langsam", native: "Slow" },{ text: "Tür", native: "Door" },{ text: "Fenster", native: "Window" },{ text: "Auto", native: "Car" },{ text: "Hund", native: "Dog" },{ text: "Katze", native: "Cat" },{ text: "Buch", native: "Book" },{ text: "Sonne", native: "Sun" },{ text: "Mond", native: "Moon" },{ text: "Morgen", native: "Morning" },{ text: "Abend", native: "Evening" },{ text: "Nacht", native: "Night" },{ text: "Telefon", native: "Phone" }
];

const japaneseWords = [
  { text: "こんにちは", native: "Hello" },{ text: "さようなら", native: "Goodbye" },{ text: "ありがとう", native: "Thank you" },{ text: "すみません", native: "Excuse me" },{ text: "はい", native: "Yes" },{ text: "いいえ", native: "No" },{ text: "お願いします", native: "Please" },{ text: "水", native: "Water" },{ text: "友達", native: "Friend" },{ text: "家族", native: "Family" },{ text: "家", native: "House" },{ text: "食べ物", native: "Food" },{ text: "良い", native: "Good" },{ text: "悪い", native: "Bad" },{ text: "大きい", native: "Big" },{ text: "小さい", native: "Small" },{ text: "美しい", native: "Beautiful" },{ text: "嬉しい", native: "Happy" },{ text: "悲しい", native: "Sad" },{ text: "今日", native: "Today" },{ text: "お金", native: "Money" },{ text: "仕事", native: "Work" },{ text: "学校", native: "School" },{ text: "愛", native: "Love" },{ text: "時間", native: "Time" },{ text: "世界", native: "World" },{ text: "音楽", native: "Music" },{ text: "旅行", native: "Travel" },{ text: "病院", native: "Hospital" },{ text: "暑い", native: "Hot" },{ text: "寒い", native: "Cold" },{ text: "速い", native: "Fast" },{ text: "遅い", native: "Slow" },{ text: "ドア", native: "Door" },{ text: "窓", native: "Window" },{ text: "車", native: "Car" },{ text: "犬", native: "Dog" },{ text: "猫", native: "Cat" },{ text: "本", native: "Book" },{ text: "太陽", native: "Sun" },{ text: "月", native: "Moon" },{ text: "朝", native: "Morning" },{ text: "夜", native: "Night" },{ text: "電話", native: "Phone" },{ text: "天気", native: "Weather" },{ text: "駅", native: "Station" },{ text: "空港", native: "Airport" },{ text: "道", native: "Road" },{ text: "花", native: "Flower" },{ text: "海", native: "Sea" }
];

const koreanWords = [
  { text: "안녕하세요", native: "Hello" },{ text: "안녕히 가세요", native: "Goodbye" },{ text: "감사합니다", native: "Thank you" },{ text: "죄송합니다", native: "Sorry" },{ text: "네", native: "Yes" },{ text: "아니요", native: "No" },{ text: "부탁합니다", native: "Please" },{ text: "물", native: "Water" },{ text: "친구", native: "Friend" },{ text: "가족", native: "Family" },{ text: "집", native: "House" },{ text: "음식", native: "Food" },{ text: "좋은", native: "Good" },{ text: "나쁜", native: "Bad" },{ text: "큰", native: "Big" },{ text: "작은", native: "Small" },{ text: "아름다운", native: "Beautiful" },{ text: "행복한", native: "Happy" },{ text: "슬픈", native: "Sad" },{ text: "오늘", native: "Today" },{ text: "돈", native: "Money" },{ text: "일", native: "Work" },{ text: "학교", native: "School" },{ text: "사랑", native: "Love" },{ text: "시간", native: "Time" },{ text: "세계", native: "World" },{ text: "음악", native: "Music" },{ text: "여행", native: "Travel" },{ text: "병원", native: "Hospital" },{ text: "뜨거운", native: "Hot" },{ text: "추운", native: "Cold" },{ text: "빠른", native: "Fast" },{ text: "느린", native: "Slow" },{ text: "문", native: "Door" },{ text: "창문", native: "Window" },{ text: "자동차", native: "Car" },{ text: "개", native: "Dog" },{ text: "고양이", native: "Cat" },{ text: "책", native: "Book" },{ text: "태양", native: "Sun" },{ text: "달", native: "Moon" },{ text: "아침", native: "Morning" },{ text: "밤", native: "Night" },{ text: "전화", native: "Phone" },{ text: "날씨", native: "Weather" },{ text: "역", native: "Station" },{ text: "공항", native: "Airport" },{ text: "길", native: "Road" },{ text: "꽃", native: "Flower" },{ text: "바다", native: "Sea" }
];

const italianWords = [
  { text: "Ciao", native: "Hello" },{ text: "Arrivederci", native: "Goodbye" },{ text: "Grazie", native: "Thank you" },{ text: "Scusa", native: "Sorry" },{ text: "Sì", native: "Yes" },{ text: "No", native: "No" },{ text: "Per favore", native: "Please" },{ text: "Acqua", native: "Water" },{ text: "Amico", native: "Friend" },{ text: "Famiglia", native: "Family" },{ text: "Casa", native: "House" },{ text: "Cibo", native: "Food" },{ text: "Buono", native: "Good" },{ text: "Cattivo", native: "Bad" },{ text: "Grande", native: "Big" },{ text: "Piccolo", native: "Small" },{ text: "Bello", native: "Beautiful" },{ text: "Felice", native: "Happy" },{ text: "Triste", native: "Sad" },{ text: "Oggi", native: "Today" },{ text: "Soldi", native: "Money" },{ text: "Lavoro", native: "Work" },{ text: "Scuola", native: "School" },{ text: "Amore", native: "Love" },{ text: "Tempo", native: "Time" },{ text: "Mondo", native: "World" },{ text: "Musica", native: "Music" },{ text: "Viaggio", native: "Travel" },{ text: "Ospedale", native: "Hospital" },{ text: "Caldo", native: "Hot" },{ text: "Freddo", native: "Cold" },{ text: "Veloce", native: "Fast" },{ text: "Lento", native: "Slow" },{ text: "Porta", native: "Door" },{ text: "Finestra", native: "Window" },{ text: "Macchina", native: "Car" },{ text: "Cane", native: "Dog" },{ text: "Gatto", native: "Cat" },{ text: "Libro", native: "Book" },{ text: "Sole", native: "Sun" },{ text: "Luna", native: "Moon" },{ text: "Mattina", native: "Morning" },{ text: "Sera", native: "Evening" },{ text: "Notte", native: "Night" },{ text: "Telefono", native: "Phone" },{ text: "Mercato", native: "Market" },{ text: "Ristorante", native: "Restaurant" },{ text: "Albergo", native: "Hotel" },{ text: "Stazione", native: "Station" },{ text: "Aeroporto", native: "Airport" }
];

const portugueseWords = [
  { text: "Olá", native: "Hello" },{ text: "Adeus", native: "Goodbye" },{ text: "Obrigado", native: "Thank you" },{ text: "Desculpa", native: "Sorry" },{ text: "Sim", native: "Yes" },{ text: "Não", native: "No" },{ text: "Por favor", native: "Please" },{ text: "Água", native: "Water" },{ text: "Amigo", native: "Friend" },{ text: "Família", native: "Family" },{ text: "Casa", native: "House" },{ text: "Comida", native: "Food" },{ text: "Bom", native: "Good" },{ text: "Mau", native: "Bad" },{ text: "Grande", native: "Big" },{ text: "Pequeno", native: "Small" },{ text: "Bonito", native: "Beautiful" },{ text: "Feliz", native: "Happy" },{ text: "Triste", native: "Sad" },{ text: "Hoje", native: "Today" },{ text: "Dinheiro", native: "Money" },{ text: "Trabalho", native: "Work" },{ text: "Escola", native: "School" },{ text: "Amor", native: "Love" },{ text: "Tempo", native: "Time" },{ text: "Mundo", native: "World" },{ text: "Música", native: "Music" },{ text: "Viagem", native: "Travel" },{ text: "Hospital", native: "Hospital" },{ text: "Quente", native: "Hot" },{ text: "Frio", native: "Cold" },{ text: "Rápido", native: "Fast" },{ text: "Lento", native: "Slow" },{ text: "Porta", native: "Door" },{ text: "Janela", native: "Window" },{ text: "Carro", native: "Car" },{ text: "Cachorro", native: "Dog" },{ text: "Gato", native: "Cat" },{ text: "Livro", native: "Book" },{ text: "Sol", native: "Sun" },{ text: "Lua", native: "Moon" },{ text: "Manhã", native: "Morning" },{ text: "Noite", native: "Night" },{ text: "Telefone", native: "Phone" },{ text: "Mercado", native: "Market" },{ text: "Restaurante", native: "Restaurant" },{ text: "Estação", native: "Station" },{ text: "Aeroporto", native: "Airport" },{ text: "Rua", native: "Street" },{ text: "Praia", native: "Beach" }
];

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", desc: "50 essential words for daily conversation", words: englishWords, learners: "1.5B+" },
  { code: "es", name: "Español", flag: "🇪🇸", desc: "50 palabras esenciales para conversación diaria", words: spanishWords, learners: "600M+" },
  { code: "fr", name: "Français", flag: "🇫🇷", desc: "50 mots essentiels pour la conversation quotidienne", words: frenchWords, learners: "300M+" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", desc: "50 wichtige Wörter für tägliche Gespräche", words: germanWords, learners: "200M+" },
  { code: "ja", name: "日本語", flag: "🇯🇵", desc: "日常会話に必須の50単語", words: japaneseWords, learners: "130M+" },
  { code: "ko", name: "한국어", flag: "🇰🇷", desc: "일상 대화를 위한 50개의 필수 단어", words: koreanWords, learners: "80M+" },
  { code: "it", name: "Italiano", flag: "🇮🇹", desc: "50 parole essenziali per conversazioni quotidiane", words: italianWords, learners: "70M+" },
  { code: "pt", name: "Português", flag: "🇧🇷", desc: "50 palavras essenciais para conversas diárias", words: portugueseWords, learners: "260M+" },
];

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("courses").select("*").then(({ data }) => {
      if (data) setDownloaded(Object.fromEntries(data.map((c: any) => [c.language, true])));
    });
  }, []);

  const downloadCourse = useCallback(async (lang: typeof LANGUAGES[0]) => {
    setDownloading(lang.code);
    try {
      const { data: course } = await supabase.from("courses").insert({
        language: lang.code, name: lang.name,
        description: lang.desc, word_count: lang.words.length
      }).select().single();

      if (course) {
        const words = lang.words.map((w, i) => ({
          course_id: course.id, text: w.text, native_text: w.native, order_index: i
        }));
        await supabase.from("words").insert(words);
        setDownloaded(prev => ({ ...prev, [lang.code]: true }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-gray-500 text-sm mt-1">Download a language pack to start practicing pronunciation</p>
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
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lang.words.length} words</span>
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
