-- Seed 8 courses with expanded vocabulary

INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'en', 'Essential English', '500 essential English words', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'es', 'Essential Spanish', '500 palabras esenciales en español', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'fr', 'Essential French', '500 mots français essentiels', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'de', 'Essential German', '500 wichtige deutsche Wörter', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'ja', 'Essential Japanese', '500の必須日本語単語', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'ko', 'Essential Korean', '500개의 필수 한국어 단어', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'it', 'Essential Italian', '500 parole italiane essenziali', 0) ON CONFLICT DO NOTHING;
INSERT INTO courses (id, language, name, description, word_count) VALUES (gen_random_uuid(), 'pt', 'Essential Portuguese', '500 palavras essenciais em português', 0) ON CONFLICT DO NOTHING;
