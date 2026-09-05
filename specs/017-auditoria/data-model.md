# Data Model: Auditoria

## Migration `supabase-migrations/auditoria.sql`

```sql
CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),   -- data e hora da ação
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,  -- escola do registro
  pessoa_id UUID REFERENCES people(id) ON DELETE SET NULL,  -- profissional na ação
  modulo VARCHAR(150) NOT NULL,                    -- Módulo/Tela (ex: 'Usuários', 'Diário de Classe — Notas')
  entidade VARCHAR(80) NOT NULL,                   -- tabela/entidade (ex: 'people', 'turmas')
  entidade_id UUID,                                -- id do registro afetado
  registro_nome TEXT,                              -- rótulo humano p/ listagem e busca (ex: 'Marcos Silva')
  acao VARCHAR(20) CHECK (acao IN ('criar','editar','excluir')),
  dados_anteriores JSONB,                          -- snapshot anterior / conteúdo na exclusão
  dados_novos JSONB,                               -- conteúdo criado / snapshot novo
  alteracoes JSONB,                                -- [{campo, anterior, novo}] p/ edições master-data
  resumo JSONB                                     -- {turma, disciplina, periodo, quantidade} p/ agregadas
);

CREATE INDEX idx_auditoria_school ON auditoria(school_id);
CREATE INDEX idx_auditoria_pessoa ON auditoria(pessoa_id);
CREATE INDEX idx_auditoria_modulo ON auditoria(modulo);
CREATE INDEX idx_auditoria_acao ON auditoria(acao);
CREATE INDEX idx_auditoria_entidade ON auditoria(entidade, entidade_id);
CREATE INDEX idx_auditoria_created ON auditoria(created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_auditoria_nome_trgm ON auditoria USING gin (registro_nome gin_trgm_ops);
```

## Backfill de `perfis_auditoria`

Copia os registros históricos mapeando `entidade` → `modulo`, com `registro_nome`
best-effort via JOIN (`perfis.nome`, `people.nome_completo`, `turmas.nome`). A tabela
antiga é preservada como arquivo; o código novo grava apenas em `auditoria`.

## Resumo agregado (alto volume)

`resumo` JSONB com:
- `turma` (nome) · `turma_id`
- `disciplina` (nome)
- `periodo` (ex.: "Período 1", data de aula/frequência)
- `quantidade` (nº de alunos afetados)

`acao` = `'editar'`; `alteracoes` = `null`; `dados_anteriores` = `null`.

## Campo `registro_nome`

Coluna central da **busca livre** e da coluna "Registro afetado". Preenchido pelas
ações (via `nomearRegistro` / parâmetro explícito). Exemplo: aluno → nome completo;
turma → nome; escola → nome_escola; período → label; compromisso → título.