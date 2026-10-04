# Projeto: Service Manager API Rest

**Identificação do estudante:** Simão Baltazar (Nº de Aluno: 240001316)  
**Versão de Node usada:v24.21.0

**Domínio do recurso adicional:** Gestão de subscrições (Service Manager).  

## Instalação

**Pré-requisitos:** É necessário ter o Node.js instalado no sistema (download em [nodejs.org](https://nodejs.org)).

1. Clone o repositório para a sua máquina local:

   ```bash
   git clone https://github.com/simaobaltazar/lei022-tp1-Simao-Baltazar.git
   ```

2. Navegue para a pasta do projeto:

   ```bash
   cd lei022-tp1-Simao-Baltazar/ bakend
   ```

3. Instale o Express e as restantes dependências:

   ```bash
   npm install Express
   ```

## Execução

Para iniciar o servidor, certifique-se de que está na raiz do projeto e execute:

```bash
node server.js
```

A API ficará disponível em [http://localhost:3000](http://localhost:3000).

### Tabela de endpoint

| Método | Endpoint | Parâmetros / corpo | Sucesso | Erros |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/serviceManager` | `name` (string, query) | 200 | 500 |
| **GET** | `/api/serviceManager/:id` | `id` (inteiro positivo) | 200 | 400, 404 |
| **POST** | `/api/serviceManager` | `{ nameService, type }` | 201 | 400, 409 |
| **PUT** | `/api/serviceManager/:id` | `id` e `{ nameService, type }` | 200 | 400, 404, 409 |
| **DELETE** | `/api/serviceManager/:id` | `id` (inteiro positivo) | 204 | 400, 404 |

### Tabela da ultima execucão

| Pedido | Esperado | Obtido |
| :--- | :--- | :--- |
| GET /api/serviceManager | 200 | 200 (coleção) |
| GET /api/serviceManager/1 | 200 | 200 (recurso existente) |
| GET /api/serviceManager/999 | 404 | 404 (recurso inexistente) |
| GET /api/serviceManager/abc | 400 | 400 (id inválido) |
| GET /api/serviceManager?name=Apple Music | 200 | 200 (filtro) |
| GET /api/serviceManager?name=xyz | 200 + [] | 200 + [] (sem resultados) |
| POST /api/serviceManager (válido) | 201 + Location | 201 + Location (criação) |
| POST /api/serviceManager (inválido/vazio) | 400 | 400 (validação) |
| POST /api/serviceManager (sem corpo JSON) | 400 | 400 (corpo em falta) |
| POST /api/serviceManager (JSON malformado) | 400 | 400 (corpo ilegível) |
| POST /api/serviceManager (tipo não permitido) | 400 | 400 (valores permitidos) |
| POST /api/serviceManager (nome duplicado) | 409 | 409 (conflito) |
| PUT /api/serviceManager/1 (válido) | 200 | 200 (atualização) |
| PUT /api/serviceManager/999 (inexistente) | 404 | 404 (recurso inexistente) |
| PUT /api/serviceManager/1 (inválido) | 400 | 400 (validação) |
| PUT /api/serviceManager/abc (id inválido) | 400 | 400 (id inválido) |
| DELETE /api/serviceManager/1 | 204 | 204 (remoção) |
| DELETE /api/serviceManager/999 | 404 | 404 (recurso inexistente) |
| DELETE /api/serviceManager/abc | 400 | 400 (id inválido) |

## Utilização de IA

* **Ferramenta:** Gemini (Google)
* **Finalidade:** Compreender a configuração de testes automatizados de uma API REST, obter exemplos de *scripts* de validação de estados HTTP (`pm.test`).
* **Parte do projeto:** Testes automatizados (Postman).
* **Alterações relevantes:** Os *scripts* de exemplo sugeridos pela IA foram ajustados para corresponderem aos *endpoints*, critérios de validação e respostas específicas exigidas pelas regras de negócio deste projeto.
* **Como validou:** Leitura dos blocos de código propostos e validação prática através da execução direta dos pedidos no Postman, garantindo que as respostas da API e os resultados dos testes passavam conforme o exigido na tabela do enunciado.
