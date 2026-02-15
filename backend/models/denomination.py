from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func
from database import Base

class Denomination(Base):
    __tablename__ = "denominations"

    id = Column(Integer, primary_key=True, index=True)
    denomination = Column(Integer, unique=True, index=True, nullable=False)
    count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
