# API Bem Estar - Documentação

## Visão Geral

API REST para a plataforma de monitoramento de saúde mental "App Bem Estar".

**Base URL:** `http://localhost:3000/api`

## Autenticação

A API usa JWT (JSON Web Token) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu_token>
```

---

## Endpoints

### Auth (Autenticação)

#### POST /api/auth/register
Cadastra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "birthDate": "1990-01-15",  // opcional
  "phone": "44999999999"       // opcional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "onboardingCompleted": false
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
Realiza login.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
```

#### GET /api/auth/profile
Retorna o perfil do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/auth/change-password
Altera a senha do usuário.

**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

---

### Users (Usuários)

#### GET /api/users/profile
Retorna o perfil completo do usuário.

#### PUT /api/users/profile
Atualiza o perfil do usuário.

**Body:**
```json
{
  "name": "Novo Nome",
  "birthDate": "1990-01-15",
  "phone": "44999999999",
  "avatarUrl": "https://..."
}
```

#### GET /api/users/stats
Retorna estatísticas do usuário.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCheckIns": 30,
    "totalGoals": 5,
    "completedGoals": 45,
    "totalEmotionRecords": 120
  }
}
```

#### DELETE /api/users/account
Desativa a conta do usuário.

---

### Questionnaire (Questionário)

#### GET /api/questionnaire/questions
Retorna todas as perguntas do questionário de onboarding.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "text": "Com que frequência você se sente bem emocionalmente?",
      "description": "Avalie seu bem-estar emocional geral",
      "category": "EMOTIONAL_WELLBEING",
      "order": 1,
      "minValue": 1,
      "maxValue": 10,
      "minLabel": "Raramente",
      "maxLabel": "Sempre"
    }
  ]
}
```

#### POST /api/questionnaire/submit
Envia as respostas do questionário.

**Body:**
```json
{
  "answers": [
    { "questionId": "uuid", "value": 7 },
    { "questionId": "uuid", "value": 4 },
    ...
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Questionário enviado com sucesso",
  "data": {
    "responses": [...],
    "report": {
      "id": "uuid",
      "overallScore": 6.5,
      "category": "GOOD",
      "insights": { ... },
      "recommendations": { ... }
    }
  }
}
```

#### GET /api/questionnaire/responses
Retorna as respostas anteriores do usuário.

**Query params:** `fromDate` (opcional)

---

### Emotions (Emoções)

#### GET /api/emotions/list
Retorna todas as emoções disponíveis.

#### POST /api/emotions/record
Registra uma emoção.

**Body:**
```json
{
  "emotionId": "uuid",
  "intensity": 7,        // 1-10, opcional (default: 5)
  "notes": "Observação"  // opcional
}
```

#### POST /api/emotions/record-multiple
Registra múltiplas emoções de uma vez.

**Body:**
```json
{
  "emotions": [
    { "emotionId": "uuid", "intensity": 7 },
    { "emotionId": "uuid", "intensity": 5 }
  ]
}
```

#### GET /api/emotions/history
Retorna o histórico de emoções.

**Query params:** `fromDate`, `toDate`, `limit`

#### GET /api/emotions/stats
Retorna estatísticas de emoções.

**Query params:** `days` (default: 30)

#### POST /api/emotions/checkin
Cria ou atualiza o check-in diário.

**Body:**
```json
{
  "overallMood": 7,      // obrigatório, 1-10
  "energyLevel": 6,      // opcional
  "sleepQuality": 8,     // opcional
  "anxietyLevel": 3,     // opcional
  "notes": "Dia bom!"    // opcional
}
```

#### GET /api/emotions/checkin/today
Retorna o check-in de hoje.

#### GET /api/emotions/checkin/history
Retorna o histórico de check-ins.

**Query params:** `days` (default: 30)

#### GET /api/emotions/checkin/stats
Retorna estatísticas dos check-ins.

---

### Goals (Metas)

#### POST /api/goals
Cria uma nova meta.

**Body:**
```json
{
  "title": "Meditar 10 minutos",
  "description": "Meditação diária pela manhã",
  "category": "MEDITATION",
  "frequency": "DAILY",
  "targetValue": 10,     // opcional
  "unit": "minutos"      // opcional
}
```

**Categorias:** `MEDITATION`, `EXERCISE`, `SLEEP`, `SOCIAL`, `MINDFULNESS`, `SELF_CARE`, `THERAPY`, `OTHER`

**Frequências:** `DAILY`, `WEEKLY`, `MONTHLY`

#### GET /api/goals
Retorna todas as metas do usuário.

**Query params:** `activeOnly` (default: true)

#### GET /api/goals/today
Retorna as metas de hoje com status de conclusão.

#### GET /api/goals/:goalId
Retorna uma meta específica com histórico de progresso.

#### PUT /api/goals/:goalId
Atualiza uma meta.

#### DELETE /api/goals/:goalId
Exclui uma meta.

#### POST /api/goals/:goalId/progress
Registra progresso em uma meta.

**Body:**
```json
{
  "completed": true,
  "value": 15,           // opcional
  "notes": "Observação", // opcional
  "date": "2026-05-07"   // opcional, default: hoje
}
```

#### GET /api/goals/stats/:goalId
Retorna estatísticas de uma meta ou todas (`goalId=all`).

**Query params:** `days` (default: 30)

---

### Reports (Relatórios)

#### POST /api/reports/weekly
Gera um relatório semanal.

#### POST /api/reports/monthly
Gera um relatório mensal.

#### GET /api/reports
Retorna os relatórios do usuário.

**Query params:** `type` (WEEKLY, MONTHLY, ONBOARDING), `limit` (default: 10)

#### GET /api/reports/latest
Retorna o relatório mais recente.

**Query params:** `type`

#### GET /api/reports/:reportId
Retorna um relatório específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "WEEKLY",
    "periodStart": "2026-04-30",
    "periodEnd": "2026-05-07",
    "overallScore": 7.2,
    "category": "GOOD",
    "insights": {
      "checkInConsistency": "excellent",
      "moodTrend": "improving",
      "topEmotions": [...],
      "goalsCompleted": 15,
      "goalsCompletionRate": 75,
      "currentStreak": 5
    },
    "recommendations": {
      "items": [
        "Você está indo bem! Continue com suas práticas atuais.",
        ...
      ]
    }
  }
}
```

---

### Resources (Recursos de Autoajuda)

#### GET /api/resources
Retorna todos os recursos.

**Query params:** `category`, `type`

**Categorias:** `STRESS_RELIEF`, `MINDFULNESS`, `ANXIETY`, `DEPRESSION`, `SLEEP`, `RELATIONSHIPS`, `SELF_ESTEEM`, `GENERAL`

**Tipos:** `ARTICLE`, `VIDEO`, `EXERCISE`, `AUDIO`, `BREATHING`, `MEDITATION`

#### GET /api/resources/search
Busca recursos.

**Query params:** `q` (termo de busca)

#### GET /api/resources/emergency
Retorna contatos de emergência.

#### GET /api/resources/:resourceId
Retorna um recurso específico.

---

## Categorias de Relatório

| Categoria | Score | Descrição |
|-----------|-------|-----------|
| EXCELLENT | ≥ 8.0 | Excelente bem-estar |
| GOOD | ≥ 6.5 | Bom bem-estar |
| MODERATE | ≥ 5.0 | Moderado |
| ATTENTION | ≥ 3.5 | Atenção necessária |
| CRITICAL | < 3.5 | Crítico - buscar ajuda |

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Não encontrado |
| 409 | Conflito (ex: email já existe) |
| 500 | Erro interno do servidor |

---

## Exemplo de Fluxo Completo

1. **Cadastro:** POST /api/auth/register
2. **Questionário:** POST /api/questionnaire/submit
3. **Check-in diário:** POST /api/emotions/checkin
4. **Registrar emoções:** POST /api/emotions/record-multiple
5. **Criar metas:** POST /api/goals
6. **Registrar progresso:** POST /api/goals/:id/progress
7. **Gerar relatório:** POST /api/reports/weekly
