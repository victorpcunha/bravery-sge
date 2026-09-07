# Data Model: Configurações de Documentos

## Migration `supabase-migrations/documentos_config.sql`

```sql
CREATE TABLE documentos_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,

  -- Replicados do cadastro (editáveis somente aqui)
  nome_escola_doc VARCHAR(100),
  cnpj_doc VARCHAR(14),
  logradouro_doc VARCHAR(120),
  numero_doc VARCHAR(10),
  bairro_doc VARCHAR(60),
  municipio_doc VARCHAR(7),        -- código IBGE (cópia)
  cep_doc VARCHAR(8),
  telefone_doc VARCHAR(20),        -- "(99) 99999-9999"
  email_doc VARCHAR(120),

  -- Adicionais
  nome_fantasia VARCHAR(120),
  site VARCHAR(200),
  mantenedora TEXT,
  cabecalho TEXT,
  rodape TEXT,
  responsavel_nome VARCHAR(120),
  responsavel_cargo VARCHAR(120),
  logo TEXT,                       -- data URL base64 (PNG/JPEG; até 2 MB no cliente)

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL
);
```

- `school_id` é **UNIQUE** (1 config por escola).
- Tabela separada de `schools` → o Censo (`exportarCenso`/`buildRegistro00` leem só `schools`) fica **intocado**.

## Server actions (`src/lib/actions/documentos-config.ts`)

- `getConfigDocumentos(schoolId)` → linha ou `null`.
- `salvarConfigDocumentos(schoolId, data, pessoaId?)`:
  - valida `validarPermissaoEstrita(...,'escolas','editar')`;
  - sanitiza (CNPJ/CEP/município só dígitos, trims, `logo` somente se `data:image/`);
  - upsert por `school_id`;
  - auditoria (`modulo` "Unidade Escolar", entidade `documentos_config`) com logo removido dos snapshots.

## Util client-safe (`src/lib/documentos-config.ts`)

- `seedDocumentosFromSchool(school)` — réplica automática a partir de `schools`.
- `configDocumentosVazia()`, `nomeMunicipioCeara(codigo)`.
- Formatação de telefone `(DD) 99999-9999`.