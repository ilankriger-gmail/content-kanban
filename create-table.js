const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gsxanzgwstlpfvnqcmiu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGFuemd3c3RscGZ2bnFjbWl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjIwMiwiZXhwIjoyMDgzMjQyMjAyfQ.PUdvFWSOBPbs09hQzv0wK_XF-VaeJo5R9qYrMLoGW1g'
);

async function createTable() {
  // Tenta inserir um registro para verificar se tabela existe
  const { error: checkError } = await supabase
    .from('viral_content')
    .select('id')
    .limit(1);
  
  if (checkError && checkError.code === 'PGRST205') {
    console.log('Tabela não existe, criando via Management API...');
    // A service_role key não permite criar tabelas diretamente
    // Precisa ser feito via SQL Editor no dashboard
    console.log('⚠️  Você precisa criar a tabela manualmente no Supabase Dashboard');
    console.log('SQL:');
    console.log(`
CREATE TABLE viral_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT DEFAULT 'tiktok',
  status TEXT DEFAULT 'ideias',
  slides JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE viral_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access" ON viral_content FOR ALL USING (true) WITH CHECK (true);
    `);
  } else if (!checkError) {
    console.log('✅ Tabela viral_content já existe!');
    
    // Inserir dados de exemplo
    const { error: insertError } = await supabase.from('viral_content').insert([
      { title: 'Paguei R$100 por cada MENTIRA que eu acreditar', description: '3 pessoas contam histórias, 1 é mentira', platform: 'tiktok', status: 'ideias' },
      { title: 'Viral Finder: Como saber se seu vídeo vai bombar', description: 'Tutorial mostrando a ferramenta', platform: 'all', status: 'producao' },
      { title: 'VidIQ vs Viral Finder — Quem me ajudou mais?', description: 'Comparativo entre as ferramentas', platform: 'tiktok', status: 'publicado' },
    ]);
    
    if (insertError) {
      console.log('Dados já existem ou erro:', insertError.message);
    } else {
      console.log('✅ Dados de exemplo inseridos!');
    }
  } else {
    console.error('Erro:', checkError);
  }
}

createTable();
