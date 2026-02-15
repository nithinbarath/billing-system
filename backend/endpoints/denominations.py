from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_admin
from models.admin import Admin
import crud.denomination as crud_denom
import schemas.denomination as schemas_denom

router = APIRouter(prefix="/denominations", tags=["Denominations"])

@router.get("/", response_model=List[schemas_denom.Denomination])
async def read_denominations(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    return crud_denom.get_denominations(db)

@router.patch("/{denom_id}", response_model=schemas_denom.Denomination)
async def update_count(
    denom_id: int,
    update: schemas_denom.DenominationUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_denom = crud_denom.update_denomination_count(db, denom_id, update.count)
    if not db_denom:
        raise HTTPException(status_code=404, detail="Denomination not found")
    return db_denom
