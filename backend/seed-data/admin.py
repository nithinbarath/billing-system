import sys
import os

# Add the parent directory to sys.path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.admin import Admin
from auth import get_password_hash

def seed_admin():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin already exists
    admin_exists = db.query(Admin).filter(Admin.username == "admin").first()
    
    if not admin_exists:
        admin = Admin(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin / admin123")
    else:
        print("Admin user already exists")
    
    db.close()

if __name__ == "__main__":
    seed_admin()