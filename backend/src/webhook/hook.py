import requests

link = "https://webhook.site/ad60f92c-65fd-4898-bf5d-6135cddf2aa3"


def send_webhook(eventType, service):
    payload = {"type": eventType, 
           "date": service}
    
    res = requests.post(link, json=payload)
    print("Webhook send: ", eventType, "- status", res.status_code)
    return res.status_code


