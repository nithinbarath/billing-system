from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime
import json

class InvoiceItemBase(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    purchase_price: float
    tax_percentage: float
    tax_payable: float
    total_price: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItem(InvoiceItemBase):
    id: int
    invoice_id: int

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    customer_email: EmailStr
    total_without_tax: float
    total_tax: float
    net_price: float
    rounded_net_price: int
    cash_paid: float
    balance_payable: float
    cash_denominations: Optional[dict] = None
    change_denominations: Optional[dict] = None

    @field_validator('cash_denominations', 'change_denominations', mode='before')
    @classmethod
    def parse_json(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return v
        return v

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class Invoice(InvoiceBase):
    id: int
    created_at: datetime
    items: List[InvoiceItem]

    class Config:
        from_attributes = True

class InvoicePreviewItem(BaseModel):
    product_id: str
    quantity: int

class InvoicePreviewRequest(BaseModel):
    customer_email: EmailStr
    items: List[InvoicePreviewItem]
    cash_paid: float
    cash_denominations: dict

class InvoicePreviewResponse(InvoiceCreate):
    balance_denoms: List[dict] # For UI display breakdown
    available_stocks: dict # Mapping of denomination total counts available in till
