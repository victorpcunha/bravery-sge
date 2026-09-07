# Plan: Ficha Individual do Aluno

**Feature**: `020-ficha-individual`
**Branch**: `020-ficha-individual`
**Data**: 2026-09-05

## Contexto técnico

- TS/React 19/Next 16 App Router; componentes `'use client'`.
- Supabase via `getSupabaseAdmin()` (service_role, bypass RLS) nas server actions.
- PDF via `@react-pdf/renderer` 4.x — `Document`/`Page`/`View`/`Text`/`Image`; download via `pdf(<Doc/>).toBlob()`.
- Preview como imagens via `pdfjs-dist` (worker embutido com `new URL(...)`).
- **0 migrations** (reusa o recurso `documentos.oficiais`), **0 novas deps npm**.

## Estrutura do projeto

```
src/lib/actions/documentos.ts                    (editar)  + getDadosFichaIndividual + tipo
src/lib/documentos-pdf.ts                        (novo)     helpers compartilhados de PDF
src/components/documentos/declaracao-matricula.tsx (editar)  usa helpers compartilhados
src/components/documentos/ficha-individual-aluno.tsx (novo)  componente PDF da Ficha
src/components/documentos/documento-gerador.tsx  (novo)     fluxo genérico de geração
src/components/documentos/oficiais-tab.tsx       (editar)   galeria de minicards + gerador
specs/020-ficha-individual/{spec,plan,data-model,quickstart}.md (novo)
```

## Tasks

1. **Spec**: arquivos em `specs/020-ficha-individual/`.
2. **Server action**: `getDadosFichaIndividual(alunoId, anoLetivoId, schoolId, pessoaId?)` +
   tipo `DadosFichaIndividual` em `documentos.ts` (valida `documentos.oficiais` visualizar; reusa
   `montarEscola`; lê `people` + flags de saúde + join de matrícula/turma/etapa/ano).
3. **Helpers**: novo `src/lib/documentos-pdf.ts` (client-safe): `parseDataLocal`,
   `dataNascimentoExtenso`, `formatarCpf`, `nomeTitulo`, `enderecoCompleto`, `formatCep`.
4. **Declaração**: `declaracao-matricula.tsx` passa a importar os helpers (refactor puro).
5. **PDF Ficha**: novo `ficha-individual-aluno.tsx` — layout por seções com linhas label/valor.
6. **Gerador**: novo `documento-gerador.tsx` — encapsula seleção Ano/Aluno + busca (debounce 300ms),
   geração `pdf(...).toBlob()` (debounce 400ms), `rasterizarPdf`, download, assinatura editável.
7. **Galeria**: `oficiais-tab.tsx` refatorado — minicards + `<DocumentoGerador>` com "Voltar".
8. **Verificação**: `npx tsc --noEmit` + `npx next build` verdes.

## Notas

- Reuso integral do `rasterizarPdf` e do padrão de efeitos de `oficiais-tab.tsx` original.
- Nomes de arquivo de download: `ficha-individual-{nome-aluno}.pdf`.
- Coluna de transcrição: código lê `auxiliary_transcricao` (mesma coluna usada pelo Painel do Aluno).