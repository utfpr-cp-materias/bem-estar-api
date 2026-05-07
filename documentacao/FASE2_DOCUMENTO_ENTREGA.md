# App Bem Estar - Documento de Entrega Fase 2

**Disciplina:** Projeto de Software
**Instituição:** UTFPR - Campus Cornélio Procópio
**Data de Entrega:** 15/05/2026
**Versão:** 1.0

---

## Sumário

1. [Protótipo das Telas](#1-protótipo-das-telas)
2. [Arquitetura da Solução](#2-arquitetura-da-solução)
3. [Diagrama do Banco de Dados](#3-diagrama-do-banco-de-dados)
4. [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
5. [Atividades por Membro](#5-atividades-por-membro)
6. [Ambientes Colaborativos](#6-ambientes-colaborativos)

---

## 1. Protótipo das Telas

### Link do Figma
**URL:** https://www.figma.com/design/f2F8Frkdhd6S9ZTtiVrSPg/app-saude-mental

### Descrição das Telas

| Tela | Descrição | Status |
|------|-----------|--------|
| **Cadastro** | Formulário de registro com nome, email, senha | ✅ Prototipado |
| **Login** | Tela de autenticação | ✅ Prototipado |
| **Bem-Vindo** | Onboarding inicial do usuário | ✅ Prototipado |
| **Questionário** | 8 perguntas com escala 1-10 para avaliação inicial | ✅ Prototipado |
| **Resultado** | Feedback visual com categorias por cores | ✅ Prototipado |
| **Suas Emoções** | Seleção de emoções do dia | ✅ Prototipado |
| **Calendário** | Visualização do histórico por data | ✅ Prototipado |
| **Metas de Hoje** | Lista de metas diárias com status | ✅ Prototipado |

### Fluxo de Navegação

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cadastro  │────▶│   Obrigado  │────▶│    Login    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Resultado  │◀────│ Questionário│◀────│  Bem-Vindo  │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│                    DASHBOARD                         │
├─────────────┬─────────────┬─────────────────────────┤
│ Suas Emoções│  Calendário │    Metas de Hoje        │
└─────────────┴─────────────┴─────────────────────────┘
```

---

## 2. Arquitetura da Solução

### 2.1 Visão Geral

O App Bem Estar utiliza uma arquitetura **Cliente-Servidor** com separação clara entre Frontend e Backend, seguindo o padrão **REST API**.

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Frontend (React)                       │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │  │
│  │  │  Pages  │  │Components│  │ Hooks   │  │   Context   │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (REST API)
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                         SERVIDOR                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Backend (Node.js + Express)                  │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │  │
│  │  │ Routes  │─▶│Controllers│─▶│Services │─▶│   Prisma    │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   PostgreSQL Database                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Arquitetura do Backend (Detalhada)

```
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐                                         │
│  │   Middlewares  │  CORS, JSON Parser, Auth, Validation    │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │     Routes     │  /api/auth, /api/users, /api/goals...   │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │   Controllers  │  Recebe request, valida, responde       │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │    Services    │  Lógica de negócio                      │
│  └───────┬────────┘                                         │
│          │                                                   │
│          ▼                                                   │
│  ┌────────────────┐                                         │
│  │  Prisma Client │  ORM - Acesso ao banco                  │
│  └───────┬────────┘                                         │
│          │                                                   │
└──────────┼──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  Users  │ │Emotions │ │  Goals  │ │ Reports │  ...      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Padrões Arquiteturais Utilizados

| Padrão | Descrição | Onde é Aplicado |
|--------|-----------|-----------------|
| **MVC** | Model-View-Controller | Estrutura geral do backend |
| **Repository** | Abstração de acesso a dados | Services + Prisma |
| **Middleware** | Pipeline de processamento | Express middlewares |
| **DTO** | Data Transfer Objects | Validações com express-validator |
| **Singleton** | Instância única | Prisma Client |

### 2.4 Fluxo de Autenticação

```
┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ Cliente│          │  API   │          │ Service│          │   BD   │
└───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
    │                   │                   │                   │
    │  POST /register   │                   │                   │
    │──────────────────▶│                   │                   │
    │                   │  validate data    │                   │
    │                   │──────────────────▶│                   │
    │                   │                   │  hash password    │
    │                   │                   │──────────────────▶│
    │                   │                   │◀──────────────────│
    │                   │                   │  create user      │
    │                   │                   │──────────────────▶│
    │                   │◀──────────────────│                   │
    │  { user, token }  │                   │                   │
    │◀──────────────────│                   │                   │
    │                   │                   │                   │
    │  GET /profile     │                   │                   │
    │  (with JWT)       │                   │                   │
    │──────────────────▶│                   │                   │
    │                   │  verify JWT       │                   │
    │                   │──────────────────▶│                   │
    │                   │                   │  get user         │
    │                   │                   │──────────────────▶│
    │                   │◀──────────────────│◀──────────────────│
    │    { user }       │                   │                   │
    │◀──────────────────│                   │                   │
```

---

## 3. Diagrama do Banco de Dados

### 3.1 Diagrama Entidade-Relacionamento (ER)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMA ER                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────────────┐
│      USER        │       │    QUESTIONNAIRE         │
├──────────────────┤       │       RESPONSE           │
│ PK id            │       ├──────────────────────────┤
│    email         │◀──┐   │ PK id                    │
│    password      │   │   │ FK userId                │───┐
│    name          │   └───│ FK questionId            │   │
│    birthDate     │       │    value (1-10)          │   │
│    phone         │       │    answeredAt            │   │
│    avatarUrl     │       └──────────────────────────┘   │
│    isActive      │                                      │
│    onboarding    │       ┌──────────────────────────┐   │
│    Completed     │       │       QUESTION           │   │
│    createdAt     │       ├──────────────────────────┤   │
│    updatedAt     │       │ PK id                    │◀──┘
└────────┬─────────┘       │    text                  │
         │                 │    description           │
         │                 │    category (ENUM)       │
         │                 │    order                 │
         │                 │    minValue, maxValue    │
         │                 │    minLabel, maxLabel    │
         │                 └──────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       ┌──────────────────────────┐
│  EMOTION_RECORD  │       │        EMOTION           │
├──────────────────┤       ├──────────────────────────┤
│ PK id            │       │ PK id                    │
│ FK userId        │───┐   │    name                  │
│ FK emotionId     │───┼──▶│    icon                  │
│    intensity     │   │   │    color                 │
│    notes         │   │   │    category (ENUM)       │
│    recordedAt    │   │   │    description           │
└──────────────────┘   │   └──────────────────────────┘
                       │
┌──────────────────┐   │   ┌──────────────────────────┐
│  DAILY_CHECKIN   │   │   │         GOAL             │
├──────────────────┤   │   ├──────────────────────────┤
│ PK id            │   │   │ PK id                    │
│ FK userId        │───┤   │ FK userId                │───┐
│    date          │   │   │    title                 │   │
│    overallMood   │   │   │    description           │   │
│    energyLevel   │   │   │    category (ENUM)       │   │
│    sleepQuality  │   │   │    frequency (ENUM)      │   │
│    anxietyLevel  │   │   │    targetValue           │   │
│    notes         │   │   │    unit                  │   │
└──────────────────┘   │   │    isActive              │   │
                       │   └──────────────────────────┘   │
┌──────────────────┐   │                                  │
│      REPORT      │   │   ┌──────────────────────────┐   │
├──────────────────┤   │   │     GOAL_PROGRESS        │   │
│ PK id            │   │   ├──────────────────────────┤   │
│ FK userId        │───┘   │ PK id                    │   │
│    type (ENUM)   │       │ FK goalId                │◀──┘
│    periodStart   │       │    date                  │
│    periodEnd     │       │    completed             │
│    overallScore  │       │    value                 │
│    category      │       │    notes                 │
│    insights      │       └──────────────────────────┘
│    recommendations│
└──────────────────┘

┌──────────────────┐       ┌──────────────────────────┐
│     RESOURCE     │       │   EMERGENCY_CONTACT      │
├──────────────────┤       ├──────────────────────────┤
│ PK id            │       │ PK id                    │
│    title         │       │    name                  │
│    description   │       │    phone                 │
│    type (ENUM)   │       │    description           │
│    content       │       │    type (ENUM)           │
│    imageUrl      │       │    isActive              │
│    category      │       └──────────────────────────┘
│    tags[]        │
│    isActive      │
└──────────────────┘
```

### 3.2 Enumerações (ENUMs)

```sql
-- Categorias de Pergunta
QuestionCategory: EMOTIONAL_WELLBEING, ANXIETY, STRESS, MOOD,
                  ENERGY, CONCENTRATION, SOCIAL, IMPROVEMENT_GOALS

-- Categorias de Emoção
EmotionCategory: POSITIVE, NEGATIVE, NEUTRAL

-- Categorias de Meta
GoalCategory: MEDITATION, EXERCISE, SLEEP, SOCIAL,
              MINDFULNESS, SELF_CARE, THERAPY, OTHER

-- Frequência de Meta
GoalFrequency: DAILY, WEEKLY, MONTHLY

-- Tipo de Relatório
ReportType: WEEKLY, MONTHLY, ONBOARDING

-- Categoria de Relatório (cores)
ReportCategory: EXCELLENT (verde), GOOD (verde claro),
                MODERATE (amarelo), ATTENTION (laranja), CRITICAL (vermelho)

-- Tipo de Recurso
ResourceType: ARTICLE, VIDEO, EXERCISE, AUDIO, BREATHING, MEDITATION

-- Categoria de Recurso
ResourceCategory: STRESS_RELIEF, MINDFULNESS, ANXIETY, DEPRESSION,
                  SLEEP, RELATIONSHIPS, SELF_ESTEEM, GENERAL

-- Tipo de Contato de Emergência
ContactType: HOTLINE, CHAT, EMERGENCY, SUPPORT_GROUP
```

### 3.3 Relacionamentos

| Tabela Origem | Tabela Destino | Tipo | Descrição |
|---------------|----------------|------|-----------|
| User | QuestionnaireResponse | 1:N | Usuário tem várias respostas |
| User | EmotionRecord | 1:N | Usuário registra várias emoções |
| User | DailyCheckIn | 1:N | Usuário faz vários check-ins |
| User | Goal | 1:N | Usuário tem várias metas |
| User | Report | 1:N | Usuário tem vários relatórios |
| Question | QuestionnaireResponse | 1:N | Pergunta tem várias respostas |
| Emotion | EmotionRecord | 1:N | Emoção é registrada várias vezes |
| Goal | GoalProgress | 1:N | Meta tem vários registros de progresso |

---

## 4. Tecnologias Utilizadas

### 4.1 Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                               │
├─────────────────────────────────────────────────────────────┤
│  React.js          │  Biblioteca UI                         │
│  TypeScript        │  Tipagem estática                      │
│  Vite              │  Build tool                            │
│  Tailwind CSS      │  Framework CSS                         │
│  React Router      │  Navegação SPA                         │
│  Axios             │  Cliente HTTP                          │
│  React Query       │  Gerenciamento de estado servidor      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│  Node.js           │  Runtime JavaScript                    │
│  Express.js        │  Framework web                         │
│  TypeScript        │  Tipagem estática                      │
│  Prisma ORM        │  Object-Relational Mapping             │
│  PostgreSQL        │  Banco de dados relacional             │
│  JWT               │  Autenticação via tokens               │
│  bcryptjs          │  Hash de senhas                        │
│  express-validator │  Validação de dados                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FERRAMENTAS                               │
├─────────────────────────────────────────────────────────────┤
│  Git/GitHub        │  Controle de versão                    │
│  Figma             │  Prototipação UI/UX                    │
│  Trello            │  Gerenciamento de tarefas              │
│  VS Code           │  IDE de desenvolvimento                │
│  Postman/Insomnia  │  Testes de API                         │
│  Prisma Studio     │  Visualização do banco                 │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Justificativa das Escolhas

| Tecnologia | Justificativa |
|------------|---------------|
| **Node.js + Express** | Ecossistema JavaScript unificado, grande comunidade, alta performance para I/O |
| **TypeScript** | Tipagem estática previne bugs, melhor manutenibilidade |
| **PostgreSQL** | Banco relacional robusto, suporte a JSON, ACID compliance |
| **Prisma** | ORM moderno com type-safety, migrations automáticas, excelente DX |
| **JWT** | Autenticação stateless, escalável, padrão da indústria |
| **React** | Componentização, virtual DOM, ampla adoção no mercado |

### 4.3 Dependências do Projeto

**Backend (package.json):**
```json
{
  "dependencies": {
    "@prisma/client": "^5.14.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.12.12",
    "prisma": "^5.14.0",
    "tsx": "^4.10.5",
    "typescript": "^5.4.5"
  }
}
```

---

## 5. Atividades por Membro

### 5.1 Divisão de Responsabilidades

| Membro | Responsabilidade Principal | Atividades |
|--------|---------------------------|------------|
| **[NOME 1]** | Backend + Banco de Dados | Desenvolvimento da API, modelagem do BD, integração |
| **[NOME 2]** | Frontend | Desenvolvimento das telas, integração com API |
| **[NOME 3]** | UI/UX + Documentação | Protótipos no Figma, documentação do projeto |
| **[NOME 4]** | Testes + DevOps | Testes, deploy, CI/CD |

### 5.2 Atividades Desenvolvidas - Backend

| Atividade | Status | Evidência |
|-----------|--------|-----------|
| Estruturação do projeto Node.js + TypeScript | ✅ Concluído | `backend/package.json`, `tsconfig.json` |
| Configuração do Prisma ORM | ✅ Concluído | `prisma/schema.prisma` |
| Modelagem do banco de dados (13 tabelas) | ✅ Concluído | `prisma/schema.prisma` |
| Módulo de Autenticação (JWT) | ✅ Concluído | `src/services/auth.service.ts` |
| Módulo de Questionário | ✅ Concluído | `src/services/questionnaire.service.ts` |
| Módulo de Emoções + Check-in | ✅ Concluído | `src/services/emotion.service.ts` |
| Módulo de Metas | ✅ Concluído | `src/services/goal.service.ts` |
| Módulo de Relatórios | ✅ Concluído | `src/services/report.service.ts` |
| Módulo de Recursos | ✅ Concluído | `src/services/resource.service.ts` |
| Middlewares (Auth, Validation) | ✅ Concluído | `src/middlewares/` |
| Seed de dados iniciais | ✅ Concluído | `prisma/seed.ts` |
| Documentação da API | ✅ Concluído | `API_DOCUMENTATION.md` |

### 5.3 Commits no GitHub

```
# Exemplo de histórico de commits esperado
feat: estrutura inicial do projeto backend
feat: configuração do Prisma e schema do BD
feat: módulo de autenticação com JWT
feat: módulo de questionário de onboarding
feat: módulo de registro de emoções
feat: módulo de metas com progresso
feat: módulo de relatórios semanais/mensais
feat: módulo de recursos de autoajuda
feat: seed com dados iniciais
docs: documentação da API
```

### 5.4 Link do Trello

**URL:** https://trello.com/b/YegZHGhT/app-bem-estar

---

## 6. Ambientes Colaborativos

### 6.1 Repositórios GitHub

| Repositório | URL | Descrição |
|-------------|-----|-----------|
| **Frontend** | https://github.com/utfpr-cp-materias/bem-estar | Aplicação React |
| **Backend** | https://github.com/utfpr-cp-materias/bem-estar-api | API Node.js |

### 6.2 Estrutura do Repositório Backend

```
bem-estar-api/
├── .github/
│   └── workflows/        # CI/CD (futuro)
├── prisma/
│   ├── schema.prisma     # Modelos do BD
│   └── seed.ts           # Dados iniciais
├── src/
│   ├── config/           # Configurações
│   ├── controllers/      # Controllers
│   ├── middlewares/      # Middlewares
│   ├── routes/           # Rotas
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Utilitários
│   ├── app.ts            # Config Express
│   └── server.ts         # Entrada
├── documentacao/         # Documentos da Fase 2
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── API_DOCUMENTATION.md
```

### 6.3 Ferramentas de Colaboração

| Ferramenta | Finalidade | Link |
|------------|------------|------|
| **GitHub** | Código fonte, versionamento | https://github.com/utfpr-cp-materias |
| **Trello** | Kanban, gerenciamento de tarefas | https://trello.com/b/YegZHGhT |
| **Figma** | Protótipos UI/UX | https://www.figma.com/design/f2F8Frkdhd6S9ZTtiVrSPg |
| **Google Docs** | Documentação compartilhada | [Link do Docs] |
| **Discord/WhatsApp** | Comunicação do grupo | [Grupo privado] |

### 6.4 Cronograma

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CRONOGRAMA                                   │
├─────────────────┬───────────────────────────────────────────────────┤
│     PERÍODO     │                   ATIVIDADE                        │
├─────────────────┼───────────────────────────────────────────────────┤
│ 06/04 - 15/04   │ ✅ Fase 1: Proposta (entregue)                    │
├─────────────────┼───────────────────────────────────────────────────┤
│ 16/04 - 25/04   │ ✅ Modelagem do BD e estrutura do backend         │
├─────────────────┼───────────────────────────────────────────────────┤
│ 26/04 - 05/05   │ ✅ Desenvolvimento dos módulos da API             │
├─────────────────┼───────────────────────────────────────────────────┤
│ 06/05 - 14/05   │ 🔄 Integração frontend-backend, testes            │
├─────────────────┼───────────────────────────────────────────────────┤
│ 15/05           │ 📋 Fase 2: Entrega + Prova presencial             │
├─────────────────┼───────────────────────────────────────────────────┤
│ 16/05 - 31/05   │ ⏳ Funcionalidades avançadas                      │
├─────────────────┼───────────────────────────────────────────────────┤
│ 01/06 - 14/06   │ ⏳ Testes finais, ajustes, deploy                 │
├─────────────────┼───────────────────────────────────────────────────┤
│ 15/06           │ ⏳ Fase 3: Entrega final                          │
└─────────────────┴───────────────────────────────────────────────────┘

Legenda: ✅ Concluído | 🔄 Em andamento | ⏳ Planejado
```

---

## Anexos

### A. Endpoints da API

Veja documentação completa em: `API_DOCUMENTATION.md`

**Resumo dos endpoints:**
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/questionnaire/questions` - Perguntas
- `POST /api/questionnaire/submit` - Enviar respostas
- `POST /api/emotions/checkin` - Check-in diário
- `GET /api/goals` - Listar metas
- `POST /api/reports/weekly` - Gerar relatório

### B. Como Executar o Projeto

```bash
# Clone o repositório
git clone https://github.com/utfpr-cp-materias/bem-estar-api.git
cd bem-estar-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute as migrations
npm run prisma:migrate

# Popule o banco com dados iniciais
npm run prisma:seed

# Inicie o servidor
npm run dev
```

---

**Documento elaborado por:**
- Antônio Augusto Polizel Passeto (2600897)
- Gabriel Pereira Garcia (2600935)
- Maria Luísa Paulo Palácios (2538920)
- Octávio Luís Conejo de Moraes (2268108)
- Taynara Luísa Pecorario (1914154)

**Data:** Maio/2026
