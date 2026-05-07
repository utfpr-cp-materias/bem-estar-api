# Atividades por Membro do Grupo

**Projeto:** App Bem Estar
**Fase:** 2 - Projeto Parcial
**Data:** Maio/2026

---

## Equipe

| Nome | RA | Responsabilidade |
|------|-----|------------------|
| Antônio Augusto Polizel Passeto | 2600897 | Backend + Banco de Dados |
| Gabriel Pereira Garcia | 2600935 | Frontend |
| Maria Luísa Paulo Palácios | 2538920 | UI/UX + Documentação |
| Octávio Luís Conejo de Moraes | 2268108 | Frontend |
| Taynara Luísa Pecorario | 1914154 | Testes + QA |

---

## Divisão de Responsabilidades

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ESTRUTURA DO TIME                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐           ┌─────────────────────┐                │
│   │  Antônio Augusto    │           │  Gabriel Pereira    │                │
│   │     (2600897)       │           │     (2600935)       │                │
│   │   Backend + BD      │           │     Frontend        │                │
│   └─────────────────────┘           └─────────────────────┘                │
│                                                                              │
│   ┌─────────────────────┐           ┌─────────────────────┐                │
│   │  Maria Luísa        │           │  Octávio Luís       │                │
│   │     (2538920)       │           │     (2268108)       │                │
│   │   UI/UX + Docs      │           │     Frontend        │                │
│   └─────────────────────┘           └─────────────────────┘                │
│                                                                              │
│                      ┌─────────────────────┐                                │
│                      │  Taynara Luísa      │                                │
│                      │     (1914154)       │                                │
│                      │    Testes + QA      │                                │
│                      └─────────────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Antônio Augusto Polizel Passeto (RA: 2600897)
### Responsabilidade: Backend + Banco de Dados

### Responsabilidades
- Desenvolvimento da API REST (Node.js + Express)
- Modelagem e implementação do banco de dados (PostgreSQL)
- Autenticação e segurança (JWT)
- Integração com frontend

### Atividades Desenvolvidas

| Atividade | Status | Data | Evidência |
|-----------|--------|------|-----------|
| Estruturação do projeto Node.js + TypeScript | ✅ Concluído | 07/05 | `package.json`, `tsconfig.json` |
| Configuração do Prisma ORM | ✅ Concluído | 07/05 | `prisma/schema.prisma` |
| Modelagem do banco de dados (13 tabelas) | ✅ Concluído | 07/05 | `prisma/schema.prisma` |
| Implementação módulo Auth (JWT) | ✅ Concluído | 07/05 | `src/services/auth.service.ts` |
| Implementação módulo Usuários | ✅ Concluído | 07/05 | `src/services/user.service.ts` |
| Implementação módulo Questionário | ✅ Concluído | 07/05 | `src/services/questionnaire.service.ts` |
| Implementação módulo Emoções + Check-in | ✅ Concluído | 07/05 | `src/services/emotion.service.ts` |
| Implementação módulo Metas | ✅ Concluído | 07/05 | `src/services/goal.service.ts` |
| Implementação módulo Relatórios | ✅ Concluído | 07/05 | `src/services/report.service.ts` |
| Implementação módulo Recursos | ✅ Concluído | 07/05 | `src/services/resource.service.ts` |
| Middlewares (Auth, Validation, Error) | ✅ Concluído | 07/05 | `src/middlewares/` |
| Controllers (7 módulos) | ✅ Concluído | 07/05 | `src/controllers/` |
| Rotas da API (7 módulos) | ✅ Concluído | 07/05 | `src/routes/` |
| Seed de dados iniciais | ✅ Concluído | 07/05 | `prisma/seed.ts` |
| Documentação da API | ✅ Concluído | 07/05 | `API_DOCUMENTATION.md` |
| Integração com frontend | 🔄 Em andamento | - | - |

### Arquivos Desenvolvidos

```
backend/
├── prisma/
│   ├── schema.prisma          # 13 tabelas, 8 enums
│   └── seed.ts                # Dados iniciais (perguntas, emoções, recursos)
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma Client
│   │   ├── env.ts             # Variáveis de ambiente
│   │   └── index.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── questionnaire.controller.ts
│   │   ├── emotion.controller.ts
│   │   ├── goal.controller.ts
│   │   ├── report.controller.ts
│   │   └── resource.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── questionnaire.routes.ts
│   │   ├── emotion.routes.ts
│   │   ├── goal.routes.ts
│   │   ├── report.routes.ts
│   │   └── resource.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── questionnaire.service.ts
│   │   ├── emotion.service.ts
│   │   ├── goal.service.ts
│   │   ├── report.service.ts
│   │   └── resource.service.ts
│   ├── utils/
│   │   └── apiResponse.ts
│   ├── app.ts
│   └── server.ts
├── API_DOCUMENTATION.md
├── README.md
├── package.json
└── tsconfig.json
```

### Commits no GitHub

```
feat: estrutura inicial do projeto backend (Node.js + TypeScript)
feat: configuração do Prisma ORM e schema do banco de dados
feat: implementação do módulo de autenticação com JWT
feat: implementação do módulo de usuários
feat: implementação do módulo de questionário de onboarding
feat: implementação do módulo de emoções e check-in diário
feat: implementação do módulo de metas com tracking de progresso
feat: implementação do módulo de relatórios (semanal/mensal)
feat: implementação do módulo de recursos de autoajuda
feat: seed com dados iniciais (perguntas, emoções, recursos, contatos)
docs: documentação completa da API REST
```

### Horas Trabalhadas: ~40 horas

---

## Gabriel Pereira Garcia (RA: 2600935)
### Responsabilidade: Frontend

### Responsabilidades
- Desenvolvimento das telas principais (React)
- Integração com a API
- Componentes reutilizáveis
- Gerenciamento de estado

### Atividades Desenvolvidas

| Atividade | Status | Data | Evidência |
|-----------|--------|------|-----------|
| Setup do projeto React + Vite + TypeScript | ✅ Concluído | XX/04 | `frontend/package.json` |
| Configuração Tailwind CSS | ✅ Concluído | XX/04 | `tailwind.config.js` |
| Componentes base (Button, Input, Card) | ✅ Concluído | XX/04 | `src/components/` |
| Tela de Login | ✅ Concluído | XX/04 | `src/pages/Login.tsx` |
| Tela de Cadastro | ✅ Concluído | XX/04 | `src/pages/Register.tsx` |
| Context de autenticação | ✅ Concluído | XX/04 | `src/contexts/AuthContext.tsx` |
| Serviço de API (Axios) | ✅ Concluído | XX/04 | `src/services/api.ts` |
| Tela de Questionário | 🔄 Em andamento | - | `src/pages/Questionnaire.tsx` |
| Tela de Dashboard | 🔄 Em andamento | - | `src/pages/Dashboard.tsx` |
| Integração completa com API | 🔄 Em andamento | - | - |

### Commits no GitHub

```
feat: setup inicial React + Vite + TypeScript
feat: configuração Tailwind CSS e tema
feat: componentes base (Button, Input, Card, Modal)
feat: tela de login com validação
feat: tela de cadastro
feat: context de autenticação
feat: serviço de API com Axios
feat: roteamento com React Router
```

### Horas Trabalhadas: ~XX horas

---

## Octávio Luís Conejo de Moraes (RA: 2268108)
### Responsabilidade: Frontend

### Responsabilidades
- Desenvolvimento de telas secundárias
- Componentes de visualização (gráficos, calendário)
- Telas de metas e relatórios
- Responsividade mobile

### Atividades Desenvolvidas

| Atividade | Status | Data | Evidência |
|-----------|--------|------|-----------|
| Componente de Calendário | 🔄 Em andamento | - | `src/components/Calendar.tsx` |
| Componente de Gráficos | 🔄 Em andamento | - | `src/components/Charts.tsx` |
| Tela de Emoções | 🔄 Em andamento | - | `src/pages/Emotions.tsx` |
| Tela de Metas | ⏳ Pendente | - | `src/pages/Goals.tsx` |
| Tela de Relatórios | ⏳ Pendente | - | `src/pages/Reports.tsx` |
| Responsividade mobile | ⏳ Pendente | - | - |

### Commits no GitHub

```
feat: componente de calendário
feat: integração com biblioteca de gráficos
feat: tela de seleção de emoções
```

### Horas Trabalhadas: ~XX horas

---

## Maria Luísa Paulo Palácios (RA: 2538920)
### Responsabilidade: UI/UX + Documentação

### Responsabilidades
- Design das interfaces no Figma
- Design System (cores, tipografia, componentes)
- Documentação do projeto
- Apresentações e vídeos

### Atividades Desenvolvidas

| Atividade | Status | Data | Evidência |
|-----------|--------|------|-----------|
| Wireframes iniciais | ✅ Concluído | XX/03 | Figma |
| Protótipo de baixa fidelidade | ✅ Concluído | XX/03 | Figma |
| Design System (cores, fontes, espaçamentos) | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Login/Cadastro | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Questionário | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Resultado | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Dashboard | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Metas | ✅ Concluído | XX/04 | Figma |
| Protótipo alta fidelidade - Calendário | ✅ Concluído | XX/04 | Figma |
| Documento da Fase 1 | ✅ Concluído | 06/04 | Google Docs |
| Documento da Fase 2 | ✅ Concluído | 07/05 | `documentacao/` |
| Diagramas de arquitetura | ✅ Concluído | 07/05 | `documentacao/diagramas/` |
| Vídeo de apresentação | ⏳ Pendente | - | YouTube |

### Link do Figma
**URL:** https://www.figma.com/design/f2F8Frkdhd6S9ZTtiVrSPg/app-saude-mental

### Telas Prototipadas

| Tela | Descrição | Status |
|------|-----------|--------|
| Cadastro | Formulário de registro | ✅ |
| Confirmação | Tela pós-cadastro | ✅ |
| Login | Autenticação | ✅ |
| Bem-Vindo | Onboarding | ✅ |
| Questionário (8 telas) | Avaliação inicial | ✅ |
| Resultado | Feedback com cores | ✅ |
| Suas Emoções | Seleção de emoções | ✅ |
| Calendário | Histórico | ✅ |
| Metas de Hoje | Lista de metas | ✅ |

### Horas Trabalhadas: ~XX horas

---

## Taynara Luísa Pecorario (RA: 1914154)
### Responsabilidade: Testes + QA

### Responsabilidades
- Testes unitários e de integração
- Qualidade de código
- Revisão de Pull Requests
- Validação de funcionalidades

### Atividades Desenvolvidas

| Atividade | Status | Data | Evidência |
|-----------|--------|------|-----------|
| Planejamento de testes | ✅ Concluído | XX/04 | Documento de testes |
| Configuração Jest (backend) | 🔄 Em andamento | - | `jest.config.js` |
| Testes unitários - Auth | ⏳ Pendente | - | `__tests__/auth.test.ts` |
| Testes unitários - Services | ⏳ Pendente | - | `__tests__/services/` |
| Testes de integração API | ⏳ Pendente | - | `__tests__/integration/` |
| Revisão de PRs | 🔄 Em andamento | - | GitHub PRs |
| Testes manuais das telas | 🔄 Em andamento | - | Planilha de testes |
| Validação de fluxos | 🔄 Em andamento | - | - |

### Casos de Teste Planejados

| Módulo | Casos de Teste |
|--------|----------------|
| Auth | Registro, Login, JWT válido/inválido |
| Questionário | Envio de respostas, geração de relatório |
| Emoções | Registro, histórico, estatísticas |
| Metas | CRUD, progresso, streaks |
| Relatórios | Geração semanal/mensal |

### Horas Trabalhadas: ~XX horas

---

## Resumo de Progresso

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROGRESSO GERAL DO PROJETO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Backend (Antônio)    [████████████████████░░░░]  85%          │
│   Frontend (Gabriel)   [████████████░░░░░░░░░░░░]  50%          │
│   Frontend (Octávio)   [████████░░░░░░░░░░░░░░░░]  35%          │
│   UI/UX (Maria Luísa)  [██████████████████████░░]  90%          │
│   Testes (Taynara)     [████░░░░░░░░░░░░░░░░░░░░]  15%          │
│                                                                  │
│   ─────────────────────────────────────────────────────────────│
│   TOTAL                [█████████████████░░░░░░░]  55%          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Links dos Ambientes Colaborativos

| Ambiente | URL | Status |
|----------|-----|--------|
| **GitHub - Backend** | https://github.com/utfpr-cp-materias/bem-estar-api | Público |
| **GitHub - Frontend** | https://github.com/utfpr-cp-materias/bem-estar | Público |
| **Trello** | https://trello.com/b/YegZHGhT/app-bem-estar | Público |
| **Figma** | https://www.figma.com/design/f2F8Frkdhd6S9ZTtiVrSPg | Público |
| **Google Docs** | [Inserir link] | Compartilhado |

---

## Observações

- As datas marcadas como "XX/04" ou "XX/05" devem ser preenchidas com as datas reais
- As horas trabalhadas são estimativas e devem ser ajustadas por cada membro
- O progresso percentual é uma estimativa baseada nas atividades listadas
