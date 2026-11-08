import requests
import uuid

link = "http://localhost:8000/webhook"


def send_webhook(eventType, service):
    payload = {
              "eventId": str(uuid.uuid4()),
              "type": eventType, 
              "data": service
       }
    
    res = requests.post(link, json=payload)
    print("Webhook send: ", eventType, "- status", res.status_code)
    return res.status_code