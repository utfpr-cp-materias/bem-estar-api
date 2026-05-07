# Arquitetura do Sistema - App Bem Estar

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITETURA GERAL                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   USUÁRIO   │
                              └──────┬──────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CAMADA DE APRESENTAÇÃO                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         FRONTEND (React.js)                            │  │
│  │                                                                        │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │   │  Login  │  │Cadastro │  │Dashboard│  │  Metas  │  │Relatórios│   │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│  │                                                                        │  │
│  │   ┌────────────────────────────────────────────────────────────────┐  │  │
│  │   │                    Componentes Reutilizáveis                    │  │  │
│  │   │  Button | Input | Card | Modal | Chart | Calendar | Navigation │  │  │
│  │   └────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTPS / REST API
                                     │ JSON + JWT
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CAMADA DE APLICAÇÃO                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       BACKEND (Node.js + Express)                      │  │
│  │                                                                        │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │   │                         MIDDLEWARES                              │ │  │
│  │   │        CORS │ JSON Parser │ Auth (JWT) │ Validation             │ │  │
│  │   └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                    │                                   │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │   │                           ROUTES                                 │ │  │
│  │   │    /auth │ /users │ /questionnaire │ /emotions │ /goals │ ...   │ │  │
│  │   └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                    │                                   │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │   │                        CONTROLLERS                               │ │  │
│  │   │  AuthController │ UserController │ GoalController │ ...         │ │  │
│  │   └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                    │                                   │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │   │                         SERVICES                                 │ │  │
│  │   │   AuthService │ UserService │ QuestionnaireService │ ...        │ │  │
│  │   │              (Lógica de Negócio / Business Logic)               │ │  │
│  │   └─────────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ Prisma ORM
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CAMADA DE DADOS                                  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                           POSTGRESQL                                   │  │
│  │                                                                        │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │   │  users  │  │questions│  │emotions │  │  goals  │  │ reports │   │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│  │                                                                        │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │   │responses│  │ emotion │  │ daily   │  │  goal   │  │resources│   │  │
│  │   │         │  │ records │  │checkins │  │progress │  │         │   │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Arquitetura do Backend (Detalhada)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA DO BACKEND                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/                                                           │
│  ├── config/                    # Configurações                 │
│  │   ├── database.ts           # Prisma Client                  │
│  │   ├── env.ts                # Variáveis de ambiente          │
│  │   └── index.ts              # Exports                        │
│  │                                                               │
│  ├── middlewares/              # Middlewares Express            │
│  │   ├── auth.middleware.ts    # Verificação JWT                │
│  │   ├── validation.ts         # Validação de dados             │
│  │   └── error.ts              # Tratamento de erros            │
│  │                                                               │
│  ├── routes/                   # Definição de rotas             │
│  │   ├── auth.routes.ts        # /api/auth/*                    │
│  │   ├── user.routes.ts        # /api/users/*                   │
│  │   ├── questionnaire.routes  # /api/questionnaire/*           │
│  │   ├── emotion.routes.ts     # /api/emotions/*                │
│  │   ├── goal.routes.ts        # /api/goals/*                   │
│  │   ├── report.routes.ts      # /api/reports/*                 │
│  │   └── resource.routes.ts    # /api/resources/*               │
│  │                                                               │
│  ├── controllers/              # Controladores                  │
│  │   └── [módulo].controller   # Recebe req, chama service      │
│  │                                                               │
│  ├── services/                 # Lógica de negócio              │
│  │   └── [módulo].service      # Business logic, acessa BD      │
│  │                                                               │
│  ├── utils/                    # Utilitários                    │
│  │   └── apiResponse.ts        # Padronização de respostas      │
│  │                                                               │
│  ├── app.ts                    # Configuração Express           │
│  └── server.ts                 # Entrada da aplicação           │
│                                                                  │
│  prisma/                                                        │
│  ├── schema.prisma             # Modelos do banco               │
│  └── seed.ts                   # Dados iniciais                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Fluxo de Dados

### 3.1 Fluxo de Requisição HTTP

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Client   │───▶│  Express   │───▶│ Middleware │───▶│ Controller │───▶│  Service   │
│  (React)   │    │   Server   │    │   Chain    │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘    └────────────┘    └────────────┘
                                                                               │
                                                                               ▼
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Client   │◀───│  Express   │◀───│ Controller │◀───│  Service   │◀───│   Prisma   │
│  (React)   │    │ (Response) │    │ (Response) │    │ (Data)     │    │ (Database) │
└────────────┘    └────────────┘    └────────────┘    └────────────┘    └────────────┘
```

### 3.2 Exemplo: Fluxo de Check-in Diário

```
1. Usuário abre o app
   │
   ▼
2. Frontend carrega tela de check-in
   │
   ▼
3. Usuário seleciona humor (1-10)
   │
   ▼
4. POST /api/emotions/checkin
   │ { overallMood: 7, energyLevel: 6, notes: "Dia bom" }
   ▼
5. authMiddleware verifica JWT
   │
   ▼
6. validate(dailyCheckInValidation)
   │
   ▼
7. emotionController.createDailyCheckIn()
   │
   ▼
8. emotionService.createDailyCheckIn()
   │ - Verifica se já existe check-in hoje
   │ - Cria ou atualiza registro
   ▼
9. Prisma persiste no PostgreSQL
   │
   ▼
10. Resposta JSON para o frontend
    { success: true, data: { checkIn } }
```

## 4. Segurança

### 4.1 Autenticação JWT

```
┌──────────────────────────────────────────────────────────────┐
│                     FLUXO DE AUTENTICAÇÃO                     │
└──────────────────────────────────────────────────────────────┘

  REGISTRO                              LOGIN
  ────────                              ─────
      │                                    │
      ▼                                    ▼
┌─────────────┐                    ┌─────────────┐
│ Dados User  │                    │  email +    │
│ + password  │                    │  password   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│ bcrypt.hash │                    │bcrypt.compare│
│ (password)  │                    │ (password)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│ Salva user  │                    │ Se válido:  │
│ no banco    │                    │ jwt.sign()  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│ jwt.sign()  │                    │ Retorna     │
│ gera token  │                    │ token JWT   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       └──────────────┬───────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │  Token JWT no   │
            │  localStorage   │
            └─────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ Requisições com │
            │ Authorization:  │
            │ Bearer <token>  │
            └─────────────────┘
```

### 4.2 Validação de Dados

- express-validator para validação de entrada
- Sanitização de strings (trim, escape)
- Validação de tipos (email, UUID, int ranges)
- Middleware customizado de validação

## 5. Modelo de Dados (Resumo)

```
┌────────────────────────────────────────────────────────────────┐
│                      ENTIDADES PRINCIPAIS                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER (Usuário)                                                │
│  ├── Dados pessoais (nome, email, telefone)                   │
│  ├── Autenticação (password hash)                             │
│  └── Status (ativo, onboarding completo)                      │
│                                                                 │
│  QUESTION + RESPONSE (Questionário)                            │
│  ├── 8 perguntas de avaliação inicial                         │
│  ├── Escala 1-10 para cada resposta                           │
│  └── Gera relatório inicial                                   │
│                                                                 │
│  EMOTION + EMOTION_RECORD (Emoções)                            │
│  ├── Catálogo de 20 emoções (positivas, negativas, neutras)   │
│  └── Registro com intensidade e notas                         │
│                                                                 │
│  DAILY_CHECKIN (Check-in Diário)                               │
│  ├── Um por dia por usuário                                   │
│  └── Humor, energia, sono, ansiedade                          │
│                                                                 │
│  GOAL + GOAL_PROGRESS (Metas)                                  │
│  ├── Metas diárias/semanais/mensais                           │
│  ├── 8 categorias (meditação, exercício, sono, etc)           │
│  └── Tracking de progresso e streaks                          │
│                                                                 │
│  REPORT (Relatórios)                                           │
│  ├── Semanal, Mensal, Onboarding                              │
│  ├── Score geral e categorização (cores)                      │
│  └── Insights e recomendações automáticas                     │
│                                                                 │
│  RESOURCE (Recursos de Autoajuda)                              │
│  ├── Artigos, vídeos, exercícios                              │
│  └── Respiração, meditação guiada                             │
│                                                                 │
│  EMERGENCY_CONTACT (Contatos de Emergência)                    │
│  └── CVV (188), SAMU, CAPS                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 6. Escalabilidade (Considerações Futuras)

```
┌──────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA FUTURA (v2)                        │
└──────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │ Load Balancer│
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       ┌──────────┐      ┌──────────┐      ┌──────────┐
       │ Backend  │      │ Backend  │      │ Backend  │
       │ Instance │      │ Instance │      │ Instance │
       └────┬─────┘      └────┬─────┘      └────┬─────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                              ▼
                       ┌──────────┐
                       │  Redis   │  (Cache + Sessions)
                       └────┬─────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │    PostgreSQL Cluster   │
              │  (Primary + Replicas)   │
              └─────────────────────────┘
```
