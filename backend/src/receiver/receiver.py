from fastapi import FastAPI, Response
import uvicorn
from models import validate_event

app = FastAPI()
processed_events = set()

@app.post("/webhook")
async def receiver_webhook(data: dict, response: Response):
    
    event = validate_event(data)

    if event.eventId in processed_events:
        response.status_code = 208
        print("Duplicate event ignored:", event.eventId)
        return {"status": "duplicate ignored"}
    
    processed_events.add(event.eventId)

    if event.type == "service.created":
        print("New service:", event.data.nameService)
    elif event.type == "service.updated":
        print("Updated Service", event.data.nameService)
    elif event.type == "service.deleted":
        print("Deleted service", event.data.nameService)
    else:
        print("Unknown event:", event.type)

    return {"status": "received"}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)