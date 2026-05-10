const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wfxmmwmxmantgzydusnw.supabase.co',
  '***REMOVED***'
);

// Dados para carregar - objetivos de aprendizagem (缩减 para exemplo)
const objetivosInfantil = [
  // Creche - Bebês (0-1a6m)
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG01', descricao: 'Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG02', descricao: 'Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG03', descricao: 'Imitar gestos e movimentos de outras crianças, adultos e animais.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG04', descricao: 'Participar do cuidado do seu corpo e da promoção do seu bem-estar.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG05', descricao: 'Utilizar os movimentos de preensão, encaixe e lançamento, ampliando suas possibilidades de manuseio de diferentes materiais e objetos.' },
  // Escuta, Fala, Pensamento e Imaginação
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF01', descricao: 'Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF02', descricao: 'Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF03', descricao: 'Demonstrar interesse ao ouvir histórias lidas ou contadas, observando ilustrações e os movimentos de leitura do adulto-leitor.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF04', descricao: 'Reconhecer elementos das ilustrações de histórias, apontando-os, a pedido do adulto-leitor.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF05', descricao: 'Imitar as variações de entonação e gestos realizados pelos adultos, ao ler histórias e ao cantar.' },
  // Espaços, tempos, quantidades...
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET01', descricao: 'Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura).' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET02', descricao: 'Explorar relações de causa e efeito (transbordar, tingir, misturar, mover e remover).' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET03', descricao: 'Explorar o ambiente pela ação e observação, manipulando, experimentando e fazendo descobertas.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET04', descricao: 'Manipular, experimentar, arrumar e explorar o espaço por meio de experiências de deslocamentos de si e dos objetos.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET05', descricao: 'Manipular materiais diversos e variados para comparar as diferenças e semelhanças entre eles.' },
  // O eu, o outro e o nós
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO01', descricao: 'Perceber que suas ações têm efeitos nas outras crianças e nos adultos.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO02', descricao: 'Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO03', descricao: 'Interagir com crianças da mesma faixa etária e adultos ao explorar espaços, materiais, objetos, brinquedos.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO04', descricao: 'Comunicar necessidades, desejos e emoções, utilizando gestos, balbucios, palavras.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO05', descricao: 'Reconhecer seu corpo e expressar suas sensações em momentos de alimentação, higiene, brincadeira e descanso.' },
  // Traços, Sons, Cores e Formas
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Traços, Sons, Cores e Formas', codigo_bncc: 'EI01TS01', descricao: 'Explorar sons produzidos com o próprio corpo e com objetos do ambiente.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Traços, Sons, Cores e Formas', codigo_bncc: 'EI01TS02', descricao: 'Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas.' },
  { tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Traços, Sons, Cores e Formas', codigo_bncc: 'EI01TS03', descricao: 'Explorar diferentes fontes sonoras e materiais para acompanhar brincadeiras cantadas, canções, músicas e melodias.' },
];

async function loadBNCCData() {
  console.log('Carregando dados BNCC...');
  
  // Verificar se a tabela existe
  const { error: checkError } = await supabase
    .from('bncc_objetivos')
    .select('count', { count: 'exact', head: true })
    .limit(1);

  if (checkError && checkError.message.includes('relation') || checkError?.code === '42P01') {
    console.log('Criando tabela bncc_objetivos...');
    
    // Criar tabela via SQL
    const { error: createError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS bncc_objetivos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tipo_ensino VARCHAR(20) NOT NULL,
          etapa VARCHAR(50) NOT NULL,
          faixa_etaria VARCHAR(100),
          campo_experiencia VARCHAR(100) NOT NULL,
          codigo_bncc VARCHAR(20) NOT NULL,
          descricao TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_bncc_tipo_ensino ON bncc_objetivos(tipo_ensino);
        CREATE INDEX IF NOT EXISTS idx_bncc_etapa ON bncc_objetivos(etapa);
        CREATE INDEX IF NOT EXISTS idx_bncc_campo ON bncc_objetivos(campo_experiencia);
      `
    });

    if (createError) {
      console.log('Erro ao criar tabela:', createError);
      // Tentar另一种方式 - inserir diretamente
    }
  }

  // Inserir dados
  const { data, error } = await supabase
    .from('bncc_objetivos')
    .upsert(objetivosInfantil, { onConflict: 'codigo_bncc' })
    .select();

  if (error) {
    console.log('Erro ao inserir dados:', error);
  } else {
    console.log(`✅ Carregados ${data?.length || objetivosInfantil.length} objetivos de aprendizagem`);
  }

  // Verificar total
  const { count } = await supabase
    .from('bncc_objetivos')
    .select('*', { count: 'exact', head: true });

  console.log(`Total no banco: ${count || 0} registros`);
}

loadBNCCData().catch(console.error);