// INEP Censo Escolar 2026 — Catálogo de Áreas de Conhecimento / Componentes Curriculares
// Fonte: Portaria Inep nº 291/2025 — Tabela de Áreas de Conhecimento (Educacenso)
//
// Códigos de 2 caracteres conforme especificação INEP.

export interface AreaConhecimento {
  codigo: string;
  nome: string;
}

export const AREAS_CONHECIMENTO: AreaConhecimento[] = [
  { codigo: "01", nome: "Química" },
  { codigo: "02", nome: "Física" },
  { codigo: "03", nome: "Matemática" },
  { codigo: "04", nome: "Biologia" },
  { codigo: "05", nome: "Ciências" },
  { codigo: "06", nome: "Língua/Literatura Portuguesa" },
  { codigo: "07", nome: "Língua Inglesa" },
  { codigo: "08", nome: "Língua Espanhola" },
  { codigo: "09", nome: "Outra Língua Estrangeira" },
  { codigo: "10", nome: "Arte" },
  { codigo: "11", nome: "Educação Física" },
  { codigo: "12", nome: "História" },
  { codigo: "13", nome: "Geografia" },
  { codigo: "14", nome: "Filosofia" },
  { codigo: "16", nome: "Informática/Computação" },
  { codigo: "17", nome: "Profissionalizantes" },
  { codigo: "23", nome: "Libras" },
  { codigo: "25", nome: "Pedagógicas" },
  { codigo: "26", nome: "Ensino Religioso" },
  { codigo: "27", nome: "Língua Indígena" },
  { codigo: "28", nome: "Estudos Sociais" },
  { codigo: "29", nome: "Sociologia" },
  { codigo: "30", nome: "Francês" },
  { codigo: "31", nome: "Português 2ª Língua" },
  { codigo: "32", nome: "Estágio" },
  { codigo: "33", nome: "Projeto de Vida" },
  { codigo: "99", nome: "Outras áreas" },
];
