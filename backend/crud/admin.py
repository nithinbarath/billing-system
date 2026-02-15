from sqlalchemy.orm import Session
from models.admin import Admin
from schemas.admin import AdminCreate
from auth import get_password_hash

def get_admin_by_username(db: Session, username: str):
    return db.query(Admin).filter(Admin.username == username).first()

def create_admin(db: Session, admin: AdminCreate):
    db_admin = Admin(
        username=admin.username,
        email=admin.email,
        hashed_password=get_password_hash(admin.password)
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin
