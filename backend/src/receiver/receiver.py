from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse, FileResponse
import asyncio
import json
from datetime import datetime
from pathlib import Path
import uvicorn
from models import validate_event

app = FastAPI()
processed_events = set()
history = []
clients = set()

@app.get("/")
def home():
    return FileResponse(Path(__file__).parent / "index.html")

@app.get("/events")
async def events():
    
    async def stream():
        queue = asyncio.Queue()
        clients.add(queue)
        print(f"SSE: Clients ON. Total Clients: {len(clients)}")
        
        try:
            
            yield format_sse("history", None, history)
            
            while True:
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield message
                except asyncio.TimeoutError:
                    yield ": ping keep-alive\n\n"
        finally:
            clients.discard(queue)
            print(f"SSE: Clients OFF. Total Clients: {len(clients)}")
            
    return StreamingResponse(stream(), media_type="text/event-stream",
                             headers={
                             "Cache-Control": "no-cache",
                             "Connection": "keep-alive",
                             "X-Accel-Buffering": "no"
                            })

@app.post("/webhook")
async def receiver_webhook(data: dict, response: Response):
    
    event = validate_event(data)

    if event.eventId in processed_events:
        response.status_code = 208
        print("Duplicate event ignored:", event.eventId)
        return {"status": "duplicate ignored"}
    
    processed_events.add(event.eventId)

    notification = {
       "eventId": event.eventId,
       "eventType": event.type,
       "nameService": event.data.nameService,
       "type": event.data.type,
       "joining": event.data.joining
    }
    history.append(notification)
    print(f"Webhook: {event.type}: {event.data.nameService}")
    
    await notify_clients(format_sse(event.type, event.eventId, notification))

    return {"status": "received"}

def format_sse(event_name, event_id, data):
    message = f"event: {event_name}\n"
    
    if event_id:
        message += f"id: {event_id}\n" 
        
    message += f"data: {json.dumps(data, ensure_ascii=False)}\n\n"
    return message

async def notify_clients(message):
    print(f"SSE: To notify {len(clients)} clients")
    for queue in list(clients):
        await queue.put(message)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)