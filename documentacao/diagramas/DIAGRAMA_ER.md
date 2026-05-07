# Diagrama Entidade-Relacionamento (ER)

## Diagrama Mermaid

Cole o código abaixo no [Mermaid Live Editor](https://mermaid.live/) para visualizar:

```mermaid
erDiagram
    USER ||--o{ QUESTIONNAIRE_RESPONSE : "responde"
    USER ||--o{ EMOTION_RECORD : "registra"
    USER ||--o{ DAILY_CHECKIN : "faz"
    USER ||--o{ GOAL : "cria"
    USER ||--o{ REPORT : "recebe"

    QUESTION ||--o{ QUESTIONNAIRE_RESPONSE : "tem"
    EMOTION ||--o{ EMOTION_RECORD : "é registrada em"
    GOAL ||--o{ GOAL_PROGRESS : "tem"

    USER {
        uuid id PK
        string email UK
        string password
        string name
        date birthDate
        string phone
        string avatarUrl
        boolean isActive
        boolean onboardingCompleted
        datetime createdAt
        datetime updatedAt
    }

    QUESTION {
        uuid id PK
        string text
        string description
        enum category
        int order
        int minValue
        int maxValue
        string minLabel
        string maxLabel
        boolean isActive
    }

    QUESTIONNAIRE_RESPONSE {
        uuid id PK
        uuid userId FK
        uuid questionId FK
        int value
        datetime answeredAt
    }

    EMOTION {
        uuid id PK
        string name
        string icon
        string color
        enum category
        string description
        boolean isActive
    }

    EMOTION_RECORD {
        uuid id PK
        uuid userId FK
        uuid emotionId FK
        int intensity
        string notes
        datetime recordedAt
    }

    DAILY_CHECKIN {
        uuid id PK
        uuid userId FK
        date date
        int overallMood
        int energyLevel
        int sleepQuality
        int anxietyLevel
        string notes
    }

    GOAL {
        uuid id PK
        uuid userId FK
        string title
        string description
        enum category
        enum frequency
        int targetValue
        string unit
        boolean isActive
    }

    GOAL_PROGRESS {
        uuid id PK
        uuid goalId FK
        date date
        boolean completed
        int value
        string notes
    }

    REPORT {
        uuid id PK
        uuid userId FK
        enum type
        datetime periodStart
        datetime periodEnd
        float overallScore
        enum category
        json insights
        json recommendations
    }

    RESOURCE {
        uuid id PK
        string title
        string description
        enum type
        string content
        string imageUrl
        enum category
        array tags
        boolean isActive
    }

    EMERGENCY_CONTACT {
        uuid id PK
        string name
        string phone
        string description
        enum type
        boolean isActive
    }
```

## Diagrama Visual (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ┌──────────┐         ┌────────────────────┐         ┌──────────────┐      │
│   │ QUESTION │─────────│QUESTIONNAIRE_RESP. │─────────│     USER     │      │
│   └──────────┘   1:N   └────────────────────┘   N:1   └──────┬───────┘      │
│                                                               │              │
│                                                               │ 1:N          │
│   ┌──────────┐         ┌────────────────────┐               │              │
│   │ EMOTION  │─────────│  EMOTION_RECORD    │───────────────┤              │
│   └──────────┘   1:N   └────────────────────┘               │              │
│                                                               │              │
│                        ┌────────────────────┐               │              │
│                        │   DAILY_CHECKIN    │───────────────┤              │
│                        └────────────────────┘               │              │
│                                                               │              │
│   ┌──────────┐         ┌────────────────────┐               │              │
│   │GOAL_PROG.│─────────│       GOAL         │───────────────┤              │
│   └──────────┘   N:1   └────────────────────┘               │              │
│                                                               │              │
│                        ┌────────────────────┐               │              │
│                        │      REPORT        │───────────────┘              │
│                        └────────────────────┘                              │
│                                                                              │
│   ┌──────────────────┐         ┌────────────────────────┐                  │
│   │     RESOURCE     │         │   EMERGENCY_CONTACT    │                  │
│   │   (standalone)   │         │      (standalone)      │                  │
│   └──────────────────┘         └────────────────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Cardinalidade dos Relacionamentos

| Relacionamento | Cardinalidade | Descrição |
|----------------|---------------|-----------|
| User → QuestionnaireResponse | 1:N | Um usuário pode ter várias respostas |
| Question → QuestionnaireResponse | 1:N | Uma pergunta pode ter várias respostas |
| User → EmotionRecord | 1:N | Um usuário registra várias emoções |
| Emotion → EmotionRecord | 1:N | Uma emoção pode ser registrada várias vezes |
| User → DailyCheckIn | 1:N | Um usuário faz vários check-ins (1 por dia) |
| User → Goal | 1:N | Um usuário pode ter várias metas |
| Goal → GoalProgress | 1:N | Uma meta tem vários registros de progresso |
| User → Report | 1:N | Um usuário recebe vários relatórios |

## Constraints Importantes

- `User.email` - UNIQUE
- `DailyCheckIn(userId, date)` - UNIQUE (um check-in por dia por usuário)
- `GoalProgress(goalId, date)` - UNIQUE (um progresso por meta por dia)
- `QuestionnaireResponse(userId, questionId, answeredAt)` - UNIQUE
- Todos os FKs têm `ON DELETE CASCADE`
