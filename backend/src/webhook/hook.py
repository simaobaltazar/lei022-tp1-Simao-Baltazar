import requests

link = "https://webhook.site/ad60f92c-65fd-4898-bf5d-6135cddf2aa3"


def send_webhook(type, service):
    dic = {"Type": type, 
           "date": service}
    
    res = requests.post(link, json=dic)
    print("Webhook send: ", type, "- status", res.status_code)


# Teste no site webhook.site
send_webhook("Service created", {"id": 3, "nameService": "HBO", "type": "family"})
