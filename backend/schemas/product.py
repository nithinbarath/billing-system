from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    product_id: str
    name: str
    available_stocks: int
    price_per_unit: float
    tax_percentage: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    available_stocks: Optional[int] = None
    price_per_unit: Optional[float] = None
    tax_percentage: Optional[float] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
