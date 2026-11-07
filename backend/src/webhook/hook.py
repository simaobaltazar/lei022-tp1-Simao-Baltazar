import requests

link = "https://webhook.site/cb810607-8db4-49e7-ab49-5aca57777bd1"


def send_webhook(eventType, service):
    payload = {"type": eventType, 
           "date": service}
    
    res = requests.post(link, json=payload)
    print("Webhook send: ", eventType, "- status", res.status_code)
    return res.status_code


