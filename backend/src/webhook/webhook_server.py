import grpc
from concurrent import futures

import service_pb2
import service_pb2_grpc
from hook import send_webhook

class ServiceWebhook(service_pb2_grpc.WebhookServiceServicer):
    
    def SendWebHook(self, request, context):
        
        if request.eventType == "" or request.service.id == 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "eventType and service is required")
            
        service = {
            "id": request.service.id,
            "nameService": request.service.nameService,
            "type": request.service.type,
            "joining": request.service.joining
        }
        
        status = send_webhook(request.eventType, service)
        return service_pb2.ServiceResponse(statusCode = status, delivered = (status == 200))
    
server = grpc.server(futures.ThreadPoolExecutor())
service_pb2_grpc.add_WebhookServiceServicer_to_server(ServiceWebhook(), server)
server.add_insecure_port("localhost:50051")
server.start()
print("gRPC server running on port 50051")
server.wait_for_termination()