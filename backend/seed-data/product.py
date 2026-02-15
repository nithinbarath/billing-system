import sys
import os

# Add the parent directory to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.product import Product

def seed_products():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    sample_products = [
        {
            "product_id": "PRD001",
            "name": "Laptop Pro 14",
            "available_stocks": 50,
            "price_per_unit": 1200.0,
            "tax_percentage": 18.0
        },
        {
            "product_id": "PRD002",
            "name": "Wireless Mouse",
            "available_stocks": 200,
            "price_per_unit": 25.0,
            "tax_percentage": 12.0
        },
        {
            "product_id": "PRD003",
            "name": "USB-C Hub",
            "available_stocks": 150,
            "price_per_unit": 45.0,
            "tax_percentage": 12.0
        },
        {
            "product_id": "PRD004",
            "name": "Monitor 27-inch",
            "available_stocks": 30,
            "price_per_unit": 350.0,
            "tax_percentage": 18.0
        },
        {
            "product_id": "PRD005",
            "name": "Mechanical Keyboard",
            "available_stocks": 80,
            "price_per_unit": 110.0,
            "tax_percentage": 18.0
        }
    ]

    for p_data in sample_products:
        existing = db.query(Product).filter(Product.product_id == p_data["product_id"]).first()
        if not existing:
            product = Product(**p_data)
            db.add(product)
            print(f"Added product: {p_data['name']}")
        else:
            print(f"Product already exists: {p_data['name']}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_products()
