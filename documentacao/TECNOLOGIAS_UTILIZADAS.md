# Tecnologias Utilizadas - App Bem Estar

## Stack Tecnológica Completa

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ╔═══════════════════════════════════════════════════════════════════════╗ │
│   ║                           FRONTEND                                     ║ │
│   ╠═══════════════════════════════════════════════════════════════════════╣ │
│   ║                                                                        ║ │
│   ║   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  ║ │
│   ║   │   React.js  │  │ TypeScript  │  │    Vite     │  │  Tailwind  │  ║ │
│   ║   │    v18+     │  │    v5.4     │  │    v5.0     │  │    CSS     │  ║ │
│   ║   └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  ║ │
│   ║                                                                        ║ │
│   ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                      │                                       │
│                                      │ REST API (HTTPS)                     │
│                                      │ JSON + JWT Auth                      │
│                                      ▼                                       │
│   ╔═══════════════════════════════════════════════════════════════════════╗ │
│   ║                           BACKEND                                      ║ │
│   ╠═══════════════════════════════════════════════════════════════════════╣ │
│   ║                                                                        ║ │
│   ║   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  ║ │
│   ║   │   Node.js   │  │  Express.js │  │ TypeScript  │  │   Prisma   │  ║ │
│   ║   │   v20 LTS   │  │    v4.19    │  │    v5.4     │  │   v5.14    │  ║ │
│   ║   └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  ║ │
│   ║                                                                        ║ │
│   ║   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   ║ │
│   ║   │    JWT      │  │  bcryptjs   │  │  express-   │                   ║ │
│   ║   │  (jsonweb   │  │   v2.4.3    │  │  validator  │                   ║ │
│   ║   │   token)    │  │             │  │    v7.0     │                   ║ │
│   ║   └─────────────┘  └─────────────┘  └─────────────┘                   ║ │
│   ║                                                                        ║ │
│   ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                      │                                       │
│                                      │ Prisma ORM                           │
│                                      ▼                                       │
│   ╔═══════════════════════════════════════════════════════════════════════╗ │
│   ║                          DATABASE                                      ║ │
│   ╠═══════════════════════════════════════════════════════════════════════╣ │
│   ║                                                                        ║ │
│   ║   ┌─────────────────────────────────────────────────────────────────┐ ║ │
│   ║   │                       PostgreSQL v15+                            │ ║ │
│   ║   │              Banco de dados relacional robusto                   │ ║ │
│   ║   └─────────────────────────────────────────────────────────────────┘ ║ │
│   ║                                                                        ║ │
│   ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Detalhamento por Camada

### 1. Frontend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React.js** | 18+ | Biblioteca para construção de interfaces de usuário |
| **TypeScript** | 5.4 | Superset do JavaScript com tipagem estática |
| **Vite** | 5.0 | Build tool e dev server ultra-rápido |
| **Tailwind CSS** | 3.4 | Framework CSS utility-first |
| **React Router** | 6.x | Navegação e roteamento SPA |
| **Axios** | 1.6 | Cliente HTTP para requisições à API |
| **React Query** | 5.x | Gerenciamento de estado do servidor |
| **React Hook Form** | 7.x | Gerenciamento de formulários |
| **Recharts** | 2.x | Gráficos e visualizações |
| **date-fns** | 3.x | Manipulação de datas |

### 2. Backend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Node.js** | 20 LTS | Runtime JavaScript no servidor |
| **Express.js** | 4.19 | Framework web minimalista |
| **TypeScript** | 5.4 | Tipagem estática para JavaScript |
| **Prisma ORM** | 5.14 | ORM moderno com type-safety |
| **jsonwebtoken** | 9.0 | Geração e verificação de tokens JWT |
| **bcryptjs** | 2.4 | Hash de senhas com salt |
| **express-validator** | 7.0 | Validação e sanitização de dados |
| **cors** | 2.8 | Middleware para CORS |
| **dotenv** | 16.4 | Variáveis de ambiente |
| **tsx** | 4.10 | Execução de TypeScript em desenvolvimento |

### 3. Banco de Dados

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **PostgreSQL** | 15+ | Banco de dados relacional principal |
| **Prisma Client** | 5.14 | Cliente ORM para acesso ao banco |
| **Prisma Migrate** | 5.14 | Gerenciamento de migrations |
| **Prisma Studio** | 5.14 | Interface visual para o banco |

### 4. Ferramentas de Desenvolvimento

| Ferramenta | Finalidade |
|------------|------------|
| **VS Code** | IDE de desenvolvimento |
| **Git** | Controle de versão |
| **GitHub** | Hospedagem de repositórios |
| **Postman / Insomnia** | Testes de API |
| **Prisma Studio** | Visualização do banco de dados |

### 5. Ferramentas de Colaboração

| Ferramenta | Finalidade |
|------------|------------|
| **Trello** | Gerenciamento de tarefas (Kanban) |
| **Figma** | Prototipação e design UI/UX |
| **Google Docs** | Documentação colaborativa |
| **Discord / WhatsApp** | Comunicação do time |

---

## Justificativas Técnicas

### Por que Node.js + Express?

1. **JavaScript em todo o stack** - Menor curva de aprendizado, código compartilhável
2. **Performance de I/O** - Event loop não-bloqueante, ideal para APIs
3. **Ecossistema NPM** - Maior repositório de pacotes do mundo
4. **Comunidade ativa** - Fácil encontrar soluções e documentação

### Por que TypeScript?

1. **Type Safety** - Erros detectados em tempo de compilação
2. **IntelliSense** - Autocompletar e documentação inline
3. **Refatoração segura** - Alterações propagam corretamente
4. **Manutenibilidade** - Código mais legível e documentado

### Por que PostgreSQL?

1. **ACID Compliance** - Transações confiáveis
2. **Tipos de dados ricos** - JSON, Arrays, Enums nativos
3. **Performance** - Otimizado para consultas complexas
4. **Escalabilidade** - Suporta replicação e sharding
5. **Open Source** - Gratuito e bem documentado

### Por que Prisma ORM?

1. **Type-safe queries** - Erros de query em tempo de compilação
2. **Migrations automáticas** - Schema changes versionados
3. **Prisma Studio** - Interface visual para debug
4. **Performance** - Query engine otimizada
5. **Developer Experience** - API intuitiva e moderna

### Por que JWT para autenticação?

1. **Stateless** - Não requer sessões no servidor
2. **Escalável** - Funciona em arquitetura distribuída
3. **Seguro** - Assinatura digital verificável
4. **Padrão da indústria** - Amplamente suportado

---

## Dependências do Projeto (package.json)

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

## Requisitos de Sistema

### Desenvolvimento

- Node.js 18+ (recomendado 20 LTS)
- PostgreSQL 14+
- npm ou yarn
- Git

### Produção (mínimo)

- 1 vCPU
- 1GB RAM
- 10GB Storage
- PostgreSQL 14+
