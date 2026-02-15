-- Tabela de conteúdo do Kanban
CREATE TABLE IF NOT EXISTS viral_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT DEFAULT 'tiktok',
  status TEXT DEFAULT 'ideias',
  slides JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca por status
CREATE INDEX IF NOT EXISTS idx_viral_content_status ON viral_content(status);

-- RLS (permitir acesso público por enquanto)
ALTER TABLE viral_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to viral_content" ON viral_content
  FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket para slides
INSERT INTO storage.buckets (id, name, public)
VALUES ('slides', 'slides', true)
ON CONFLICT (id) DO NOTHING;

-- Policy para upload público
CREATE POLICY "Allow public upload to slides" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'slides');

CREATE POLICY "Allow public read from slides" ON storage.objects
  FOR SELECT USING (bucket_id = 'slides');
