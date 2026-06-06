# Bravery SGE — Redesign Visual Roadmap

Direção estética: **Educacional Editorial** (Industrial + Magazine)
Tipografia: **Plus Jakarta Sans** ( headings e body)
Micro-interações: **Moderadas** (hover lift, stagger, focus rings)
Dark mode: **Fase separada** (light mode primeiro)

---

## FASE 1 — Tipografia & Paleta

### 1.1 Tipografia
- [x] Instalar Plus Jakarta Sans via `next/font/google` no `layout.tsx`
- [x] Criar variável `--font-heading` com Plus Jakarta Sans peso 600/700
- [x] Manter `--font-sans` como Plus Jakarta Sans peso 400/500
- [x] Atualizar `@theme inline` em `globals.css` com nova fonte

### 1.2 Paleta Light (azul petróleo educativo)
- [x] `primary`: `#0F2B46` (azul escuro profundo)
- [x] `primary-foreground`: `#FAFCFF`
- [x] `accent`: `#2E8BA3` (teal vibrante)
- [x] `accent-foreground`: `#FAFCFF`
- [x] `secondary`: `#2E8BA3`
- [x] `secondary-foreground`: `#FAFCFF`
- [x] `background`: `#F4F6F9`
- [x] `foreground`: `#0D1117`
- [x] `card`: `#FFFFFF`
- [x] `card-foreground`: `#0D1117`
- [x] `muted`: `#E8ECF1`
- [x] `muted-foreground`: `#57606A`
- [x] `border`: `#D0D7DE`
- [x] `input`: `#FFFFFF`
- [x] `ring`: `#2E8BA3`
- [x] `destructive`: `#CF222E`
- [x] `destructive-foreground`: `#FAFCFF`
- [x] `success`: `#1A7F37`
- [x] `success-light`: `#DAFBE1`
- [x] `warning`: `#9A6700`
- [x] `warning-light`: `#FFF8C5`
- [x] `info`: `#2E8BA3`
- [x] `info-light`: `#DDF4FF`
- [x] `sidebar`: `#0F2B46`
- [x] `sidebar-foreground`: `#FAFCFF`
- [x] `sidebar-accent`: `#2E8BA3`
- [x] `sidebar-primary`: `#4FC3D7`
- [x] `sidebar-primary-foreground`: `#0F2B46`
- [x] `sidebar-border`: `rgba(255,255,255,0.08)`

### 1.3 Paleta Dark
- [x] `primary`: `#E8F0FE`
- [x] `primary-foreground`: `#0F2B46`
- [x] `accent`: `#4FC3D7`
- [x] `accent-foreground`: `#0D1117`
- [x] `background`: `#0D1117`
- [x] `foreground`: `#F0F2F5`
- [x] `card`: `#161B22`
- [x] `card-foreground`: `#F0F2F5`
- [x] `muted`: `#21262D`
- [x] `muted-foreground`: `#8B949E`
- [x] `border`: `#30363D`
- [x] `destructive`: `#F85149`
- [x] `success`: `#3FB950`
- [x] `warning`: `#D29922`
- [x] `sidebar`: `#0D1117`
- [x] `sidebar-foreground`: `#F0F2F5`
- [x] `sidebar-accent`: `#4FC3D7`
- [x] `sidebar-primary`: `#2E8BA3`

### 1.4 Radii & Sombras
- [x] Base radius: `10px` → `12px`
- [x] Shadows: atualizadas para usar `rgba(13,17,23,...)` com camadas duplas
- [x] Transições: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design easing)

### 1.5 Classes utilitárias
- [x] `.card-glass` atualizada para usar `var(--card)` e `var(--border)`
- [x] `.badge-*` atualizadas para usar `var()` tokens
- [x] `.glass`, `.glass-dark`, `.glass-subtle` atualizadas
- [x] `.focus-ring` atualizada para `rgba(46, 139, 163, 0.25)` (nova cor ring)
- [x] `.hover-glow` atualizada para `rgba(46, 139, 163, 0.2)` (nova cor accent)
- [x] Scrollbar atualizada
- [x] `font-feature-settings: "cv11", "ss01", "ss03"` adicionado ao body (Plus Jakarta Sans OpenType features)

### 1.6 Verificação
- [x] `npx next build` sem erros ✓
- [ ] Visual check: dashboard, sidebar, login, uma página de listagem, uma página de formulário

---

## FASE 2 — Componentes de Layout

### 2.1 PageHeader
- [x] Criar `src/components/layout/page-header.tsx`
- [x] Props: `title`, `description?`, `actions?` (ReactNode), `icon?` (LucideIcon)
- [x] Estilo: heading com `font-heading`, ícone com `bg-primary/10`, descrição com `text-muted-foreground`

### 2.2 StatCard
- [x] Criar `src/components/ui/stat-card.tsx`
- [x] Props: `icon`, `value`, `label`, `trend?`, `variant?` (default/success/warning/destructive)
- [x] Estilo: ícone com fundo colorido arredondado, número grande em heading, label muted

### 2.3 EmptyState
- [x] Criar `src/components/ui/empty-state.tsx`
- [x] Props: `icon`, `title`, `description?`, `action?` (ReactNode)
- [x] Estilo: ícone grande com `bg-muted/50`, título central, CTA opcional

### 2.4 PageSection
- [x] Criar `src/components/layout/page-section.tsx`
- [x] Props: `title`, `description?`, `actions?`, `children`
- [x] Estilo: card com header borda-bottom, `font-heading` no título

### 2.5 Dashboard Redesign
- [x] Substituir dashboard com PageHeader + StatCard + PageSection
- [x] Next steps com botões interativos + ArrowRight icon
- [x] Welcome banner com `bg-primary/5 border-primary/10`

### 2.5 Verificação
- [ ] `npx next build` sem erros
- [ ] Visual check dos novos componentes no Storybook ou página de teste

---

## FASE 3 — Micro-interações & Animações

### 3.1 Cards
- [x] `hover:-translate-y-0.5 hover:shadow-md transition-all` padrão em StatCards
- [x] Botão `active:scale-[0.98]` feedback tátil adicionado ao buttonVariants

### 3.2 Sidebar
- [x] Item ativo com barra lateral luminosa `before:` pseudo (`w-1 h-5 bg-sidebar-primary rounded-full`)
- [x] Hover com sutil `bg-sidebar-accent/10`
- [x] Espaçamento `py-3` ao invés de `py-2.5`
- [x] Transições `duration-200` consistentes
- [x] Logo com gradiente `from-sidebar-primary to-sidebar-accent`
- [x] Avatar com gradiente `from-sidebar-primary to-sidebar-accent`
- [x] Sub-items com `py-2` e indicador `w-0.5 h-4`
- [x] Usuário com avatar em gradiente + email truncado

### 3.3 Focus states
- [x] `focus-visible:ring-2 focus-visible:ring-ring/30` padrão (já no shadcn/ui)
- [x] `.focus-ring` atualizado para usar cor `ring`

### 3.4 Animation timing
- [x] Animações atualizadas para `cubic-bezier(0.16, 1, 0.3, 1)` (spring physics)
- [x] Durações ajustadas: fade-in 0.4s, fade-in-up 0.5s, scale-in 0.35s

### 3.5 Loading states
- [x] Skeleton com `animate-pulse-soft` já existe (2s ease-in-out infinite)

---

## FASE 4 — Sidebar Redesign

### 4.1 Logo area
- [x] Ícone School com gradiente `bg-gradient-to-br from-sidebar-primary to-sidebar-accent`
- [x] Nome "Bravery" em `font-heading font-bold text-lg tracking-tight`
- [x] "Gestão Escolar" em `text-sidebar-foreground/40 font-medium text-xs`

### 4.2 Items
- [x] Espaçamento: `py-3` e `gap-3 px-3`
- [x] Indicador ativo: barra lateral luminosa `before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-sidebar-primary before:rounded-full`
- [x] Sub-item ativo: `w-0.5 h-4 bg-sidebar-primary`
- [x] Hover: `hover:bg-sidebar-accent/10` (sutil)

### 4.3 User area
- [x] Avatar com `bg-gradient-to-br from-sidebar-primary to-sidebar-accent`
- [x] Email truncado com `text-sidebar-foreground/40`
- [x] Button sair com `size="sm"` e `text-sidebar-foreground/60`

### 4.4 Verificação
- [x] `npx next build` sem erros ✓

---

## FASE 5 — Dashboard Redesign

### 5.1 Substituir dashboard atual
- [x] Usar `PageHeader` com saudação + data
- [x] Grid de `StatCard` com: Docentes, Turmas, Alunos, Ano Letivo
- [x] Seção "Próximos passos" com cards interativos (PageSection + ArrowRight)

### 5.2 Verificação
- [x] `npx next build` sem erros ✓

---

## FASE 6 — Dark Mode (fase separada)

### 6.1 Toggle
- [x] Criar `src/components/layout/theme-toggle.tsx` (Sun/Moon icon)
- [x] Adicionar toggle no footer da sidebar

### 6.2 Testes
- [ ] Verificar todas as 26 páginas em dark mode
- [ ] Verificar gráficos Recharts em dark mode (cores chart-1 a chart-5)
- [ ] Verificar sidebar em dark mode

### 6.3 Verificação
- [x] `npx next build` sem erros ✓
- [ ] Toggle claro/escuro funcional
- [ ] Persistência de preferência (localStorage via next-themes)

---

## Notas

- Sempre usar tokens CSS (`bg-primary`, `text-foreground`, etc.) — nunca hex
- Sempre usar componentes shadcn/ui — nunca nativos
- Testar responsividade após cada fase
- Rodar `npx next build` após cada fase
- Atualizar `AGENTS.md` se novas regras forem necessárias