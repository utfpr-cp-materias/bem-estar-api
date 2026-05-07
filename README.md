# App Bem Estar - Backend API

API REST para a plataforma de monitoramento de saúde mental desenvolvida como projeto da UTFPR-CP.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma    # Modelos do banco de dados
│   └── seed.ts          # Dados iniciais
├── src/
│   ├── config/          # Configurações (env, database)
│   ├── controllers/     # Controllers das rotas
│   ├── middlewares/     # Middlewares (auth, validation)
│   ├── routes/          # Definição de rotas
│   ├── services/        # Lógica de negócio
│   ├── utils/           # Utilitários
│   ├── app.ts           # Configuração do Express
│   └── server.ts        # Entrada da aplicação
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
└── tsconfig.json
```

## Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bem_estar_db?schema=public"
JWT_SECRET="sua-chave-secreta-muito-segura"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Criar banco de dados

Certifique-se de ter o PostgreSQL instalado e rodando.

```bash
# Criar o banco de dados
createdb bem_estar_db

# Ou via psql
psql -U postgres -c "CREATE DATABASE bem_estar_db;"
```

### 4. Executar migrations

```bash
npm run prisma:migrate
```

### 5. Gerar cliente Prisma

```bash
npm run prisma:generate
```

### 6. Popular banco com dados iniciais

```bash
npm run prisma:seed
```

### 7. Iniciar servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia em modo produção |
| `npm run prisma:generate` | Gera cliente Prisma |
| `npm run prisma:migrate` | Executa migrations |
| `npm run prisma:studio` | Abre Prisma Studio (GUI do banco) |
| `npm run prisma:seed` | Popula banco com dados iniciais |
| `npm run db:reset` | Reseta banco e reaplica migrations |

## Módulos da API

### Autenticação (`/api/auth`)
- Cadastro e login de usuários
- Autenticação via JWT
- Alteração de senha

### Usuários (`/api/users`)
- Perfil do usuário
- Estatísticas pessoais
- Gerenciamento de conta

### Questionário (`/api/questionnaire`)
- Perguntas de onboarding
- Envio de respostas
- Geração de relatório inicial

### Emoções (`/api/emotions`)
- Catálogo de emoções
- Registro de emoções
- Check-in diário
- Histórico e estatísticas

### Metas (`/api/goals`)
- CRUD de metas
- Registro de progresso
- Metas do dia
- Estatísticas e streaks

### Relatórios (`/api/reports`)
- Relatórios semanais
- Relatórios mensais
- Insights e recomendações

### Recursos (`/api/resources`)
- Artigos e vídeos de autoajuda
- Exercícios de respiração
- Contatos de emergência

## Documentação da API

Veja o arquivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentação completa dos endpoints.

## Banco de Dados

### Diagrama ER (Principais Entidades)

```
User
 ├── QuestionnaireResponse
 ├── EmotionRecord
 ├── DailyCheckIn
 ├── Goal
 │    └── GoalProgress
 └── Report

Emotion (catálogo)
Question (catálogo)
Resource (catálogo)
EmergencyContact (catálogo)
```

### Visualizar banco

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555

## Testando a API

### Health Check

```bash
curl http://localhost:3000/health
```

### Cadastro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"123456"}'
```

## Contribuição

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'feat: minha feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

## Licença

MIT - UTFPR-CP 2026
