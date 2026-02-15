from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    customer_email = Column(String, index=True)
    total_without_tax = Column(Float, nullable=False)
    total_tax = Column(Float, nullable=False)
    net_price = Column(Float, nullable=False)
    rounded_net_price = Column(Integer, nullable=False)
    cash_paid = Column(Float, nullable=False)
    balance_payable = Column(Float, nullable=False)
    cash_denominations = Column(String)  # Store as JSON string
    change_denominations = Column(String) # Store as JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("InvoiceItem", back_populates="invoice")
