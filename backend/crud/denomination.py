from sqlalchemy.orm import Session
from models.denomination import Denomination
from schemas.denomination import DenominationCreate, DenominationUpdate

def get_denominations(db: Session):
    return db.query(Denomination).order_by(Denomination.denomination.desc()).all()

def get_denomination_by_value(db: Session, value: int):
    return db.query(Denomination).filter(Denomination.denomination == value).first()

def create_denomination(db: Session, denomination: DenominationCreate):
    db_denomination = Denomination(**denomination.model_dump())
    db.add(db_denomination)
    db.commit()
    db.refresh(db_denomination)
    return db_denomination

def update_denomination_count(db: Session, denomination_id: int, count: int):
    db_denomination = db.query(Denomination).filter(Denomination.id == denomination_id).first()
    if db_denomination:
        db_denomination.count = count
        db.commit()
        db.refresh(db_denomination)
    return db_denomination

def bulk_update_counts(db: Session, updates: list):
    for update in updates:
        db_denom = db.query(Denomination).filter(Denomination.denomination == update['denomination']).first()
        if db_denom:
            db_denom.count = update['count']
    db.commit()
    return True
