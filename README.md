# Projeto: Service Manager – TP2

**Identificação do estudante:** Simão Baltazar (Nº de Aluno: 240001316)  
**Versão de Node usada:** v24.21.0  
**Versão de Python usada:** 3.12.10

**Domínio do recurso adicional:** Gestão de subscrições.

**Opções implementadas:** gRPC (Opção B) e Webhook (Opção D). Sempre que a API REST do TP1 cria, altera ou remove uma subscrição, avisa um serviço Python por gRPC, que envia um webhook para um recetor. O recetor mostra a notificação numa página web em tempo real através de SSE.

## Instalação

1. Clone o repositório e entre na pasta do backend:

   ```bash
   git clone https://github.com/simaobaltazar/lei022-tp1-Simao-Baltazar.git
   cd lei022-tp1-Simao-Baltazar/backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   py -m pip install grpcio grpcio-tools requests fastapi uvicorn
   ```

## Execução

Em três terminais, a partir da pasta `backend`:

```bash
cd src/receiver && py receiver.py        # Recetor + página (porta 8000)
cd src/webhook && py webhook_server.py   # Servidor gRPC (porta 50051)
node server.js                           # API REST (porta 3000)
```

A página de notificações fica em [http://localhost:8000](http://localhost:8000).

## gRPC (Opção B)

O contrato `backend/src/proto/service.proto` define o serviço `WebhookService` com a operação `SendWebHook`, que recebe o tipo de evento e a subscrição (`id`, `nameService`, `type`, `joining`) e devolve o `statusCode` do webhook.

O `.proto` é partilhado pelos dois lados: o **Node** (cliente) lê-o em tempo de execução com o `@grpc/proto-loader`, e o **Python** (servidor) usa código gerado a partir dele (`service_pb2.py` e `service_pb2_grpc.py`). Se o contrato mudar, o código Python volta a gerar-se com:

```bash
py -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/service.proto
```

## Webhook (Opção D)

* **Produtor:** serviço Python (`hook.py`), chamado por gRPC em cada alteração.
* **Consumidor:** recetor FastAPI (`receiver.py`), em `POST http://localhost:8000/webhook`.
* **Eventos:** `service.created`, `service.updated` e `service.deleted`.
* **Payload:** `{ "eventId": "<uuid>", "type": "service.created", "data": { "id", "nameService", "type", "joining" } }`

**Riscos tratados:**

* **Mensagens repetidas:** o recetor ignora eventos com um `eventId` já processado (208).
* **Payload inválido:** o recetor valida o evento com Pydantic (422).
* **Falha no processamento:** se o recetor ou o serviço Python estiverem em baixo, o erro é registado e a API continua a responder.

## Comparação com REST

| Critério | gRPC | Webhook |
| :--- | :--- | :--- |
| **Padrão de comunicação** | Pedido/resposta com contrato | Orientado a eventos o produtor envia quando acontece alguma mudanca |
| **Adequação** | Comunicação entre serviços em linguagens diferentes (Node -> Python) | Avisar outro sistema de cada alteração, sem ele ter de perguntar |
| **Complexidade** | Maior que a do REST contrato, geração de código, cliente e servidor | Maior que a do REST: exige um recetor e tratamento de repetidos e falhas |
| **Erros e limitações** | Códigos gRPC em vez não é usável diretamente no browser | A entrega não é garantida e podem chegar eventos repetidos |
| **Vantagem** | O contrato garante que os dois lados usam os mesmos dados | O recetor reage logo a cada alteração |
| **Desvantagem** | Mensagens binárias, mais difíceis de ver os erros | Sem novas tentativas um evento pode perder-se pois não há garantia de entrega|

## Testes

As evidências estão em `tests/tp2/`. Os testes do webhook podem ser repetidos no Postman atraves `tests/tp2/postman/TP2-webhook.postman_collection.json`. Os do gRPC fiz no Postman mas como o Postman não exporta pedidos gRPC coloquei 2 imagens como prova.

| Teste | Esperado | Obtido |
| :--- | :--- | :--- |
| G1 – gRPC com pedido válido | `OK` | `OK` |
| G2 – gRPC com pedido vazio `{}` | `INVALID_ARGUMENT` | `INVALID_ARGUMENT` |
| W1 – Webhook válido | 200 | 200 |
| W2 – Webhook repetido (mesmo `eventId`) | 208 | 208 |
| W3 – Webhook inválido `{"foo": 1}` | 422 | 422 |
| E1 – POST na API (cadeia completa) | 201 + notificação | 201 + notificação |

## Utilização de IA

* **Ferramenta:** Claude
* **Finalidade:** VibeCoding do index.html e ajuda na validacao dos testes e exportação dos mesmos.
