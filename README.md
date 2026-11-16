# Projeto: Service Manager – TP3

**Identificação do estudante:** Simão Baltazar (Nº de Aluno: 240001316)  
**Versão de Node usada:** v24.21.0  
**Base de dados:** PostgreSQL 16 e Prisma 6

**Domínio do recurso adicional:** Gestão de subscrições.

**TP3:** Os dados passaram da memória para uma base de dados PostgreSQL, através do Prisma. Foi acrescentada a entidade utilizador, com uma relação 1:N com as subscrições.
## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/simaobaltazar/lei022-tp1-Simao-Baltazar.git
   cd lei022-tp1-Simao-Baltazar/backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o ficheiro `.env`

   ```bash
   cp .env.example .env
   ```

## Migração

Arranque o PostgreSQL, aplique as migrações e insira os dados iniciais:

```bash
docker compose up -d
npx prisma migrate deploy
npm run db:seed
```

## Execução

```bash
node server.js
```

A API fica disponível em [http://localhost:3000](http://localhost:3000).

## Modelo de dados

Um utilizador pode ter várias subscrições, e cada subscrição pertence a um só utilizador (relação 1:N).

**User**

| Campo | Tipo | Regras |
| :--- | :--- | :--- |
| `id` | Int | Chave primária, gerada pela base de dados |
| `nameUser` | String | Obrigatório |
| `email` | String | Obrigatório e único |
| `createdAt` | DateTime | Preenchido automaticamente |

**Service**

| Campo | Tipo | Regras |
| :--- | :--- | :--- |
| `id` | Int | Chave primária, gerada pela base de dados |
| `nameService` | String | Obrigatório e único por utilizador |
| `type` | Enum | `student`, `individual` e `family` |
| `joining` | DateTime | Gerado pela base de dados|
| `userId` | Int | Chave estrangeira para `User`|

## Endpoints

| Método | Endpoint | Corpo | Sucesso | Erros |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/serviceManager` | `name`| 200 | 500 |
| **GET** | `/api/serviceManager/:id` | — | 200 | 400, 404 |
| **POST** | `/api/serviceManager` | `{ nameService, type, userId }` | 201 | 400, 404, 409 |
| **PUT** | `/api/serviceManager/:id` | `{ nameService, type }` | 200 | 400, 404, 409 |
| **DELETE** | `/api/serviceManager/:id` | — | 204 | 400, 404 |
| **GET** | `/api/users` | — | 200 | 500 |
| **GET** | `/api/users/:id` | — | 200 (com as subscrições) | 400, 404 |
| **POST** | `/api/users` | `{ nameUser, email, services? }` | 201 | 400, 409 |
| **DELETE** | `/api/users/:id` | — | 204 | 400, 404, 409 |

* O `POST /api/users` cria o utilizador e as suas subscrições numa transação.
* O `DELETE /api/users/:id` é recusado se o utilizador ainda tiver subscrições.

## Erros

Os erros da base de dados são traduzidos para as exceções da API:

| Erro do Prisma | Significado | Resposta |
| :--- | :--- | :--- |
| `P2002` | Valor único repetido | 409 |
| `P2003` | Violação de uma relação | 409 |
| `P2025` | Registo inexistente | 404 |

## Testes

As evidências estão em `tests/tp3/`. Os testes podem ser repetidos importando no Postman `tests/tp3/postman/TP3-persistencia.postman_collection.json`.
| Teste | Esperado | Obtido |
| :--- | :--- | :--- |
| S1 – GET lista de subscrições | 200 | 200 |
| S2 – POST subscrição válida | 201 | 201 |
| S2F – POST subscrição sem `userId` | 400 | 400 |
| S3 – GET subscrição por id | 200 | 200 |
| S3F – GET subscrição inexistente | 404 | 404 |
| S4 – PUT subscrição válida | 200 | 200 |
| S4F – PUT subscrição com tipo inválido | 400 | 400 |
| S5 – DELETE subscrição | 204 | 204 |
| S5F – DELETE subscrição já apagada | 404 | 404 |
| U1 – GET lista de utilizadores | 200 | 200 |
| U2 – POST utilizador com subscrições (transação) | 201 | 201 |
| U2F – POST utilizador sem email | 400 | 400 |
| U3 – GET utilizador com subscrições | 200 | 200 |
| U3F – GET utilizador inexistente | 404 | 404 |
| U5 – DELETE utilizador sem subscrições | 204 | 204 |
| U5F – DELETE utilizador com subscrições | 409 | 409 |
| U6F – POST com subscrições repetidas (rollback da transação) | 409 | 409 |
| Persistência – `GET /api/users` antes e depois de reiniciar a API | Mesmos dados | Mesmos dados |

## Utilização de IA

* **Ferramenta:** Claude
* **Finalidade:** Explicação dos conceitos do Prisma e ajuda na elaboração da coleção Postman.
