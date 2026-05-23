-- ============================================
-- Migration: Substitui soft-delete por coluna ativo
-- ============================================

-- Adicionar coluna ativo
ALTER TABLE people ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT true;

-- Backfill: marcar como inativos os registros com deleted_at preenchido
UPDATE people SET ativo = false WHERE deleted_at IS NOT NULL;

-- Remover índice único antigo de CPF (que não considerava ativo/inativo)
DROP INDEX IF EXISTS idx_people_cpf_school;

-- Criar novo índice único: apenas pessoas ativas contam para CPF duplicado
DROP INDEX IF EXISTS idx_people_cpf_school_active;
CREATE UNIQUE INDEX idx_people_cpf_school_active
ON people(school_id, cpf)
WHERE cpf IS NOT NULL AND ativo = true;
