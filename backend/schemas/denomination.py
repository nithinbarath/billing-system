from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DenominationBase(BaseModel):
    denomination: int
    count: int

class DenominationCreate(DenominationBase):
    pass

class DenominationUpdate(BaseModel):
    count: Optional[int] = None

class Denomination(DenominationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
