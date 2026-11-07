const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const path = require('node:path');

const PROTO_PATH = path.join(__dirname, '..', 'proto', 'service.proto');
const packageDefinition = loader.loadSync(PROTO_PATH, { keepCase: true });
const serviceProtoHook = grpc.loadPackageDefinition(packageDefinition).webhook;

const client = new serviceProtoHook.WebhookService('localhost:50051', grpc.credentials.createInsecure());

function sendWebhook(eventType, service) {
    const request = { eventType: eventType, service: service };

    client.SendWebHook(request, (err, response) => {
        if (err) {
            console.log(`[gRPC] Error on ${eventType}: ${err.details}`);
            return;
        }
        console.log(`[gRPC] ${eventType} -> status ${response.statusCode}`);
    });
}

module.exports = { sendWebhook };