import sys
import os

# Add the parent directory to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.denomination import Denomination

def seed_denominations():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    values = [1, 2, 5, 10, 20, 50, 100, 500]
    
    for val in values:
        existing = db.query(Denomination).filter(Denomination.denomination == val).first()
        if not existing:
            denom = Denomination(denomination=val, count=0)
            db.add(denom)
            print(f"Added denomination: {val}")
        else:
            print(f"Denomination already exists: {val}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_denominations()
