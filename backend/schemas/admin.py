from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminBase(BaseModel):
    username: str
    email: EmailStr

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
