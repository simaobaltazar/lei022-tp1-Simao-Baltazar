from fastapi import HTTPException
from pydantic import BaseModel, ValidationError

class Service(BaseModel):
    id: int
    nameService: str
    type: str
    joining: str

class ServiceEvent(BaseModel):
    eventId: str
    type: str
    data: Service

def validate_event(data: dict) -> ServiceEvent:
    try:
        return ServiceEvent.model_validate(data)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Invalid payload: {e}")