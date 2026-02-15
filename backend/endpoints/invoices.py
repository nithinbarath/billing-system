from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_admin
from models.admin import Admin
import crud.invoice as crud_invoice
import schemas.invoice as schemas_invoice
from typing import List

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post("/", response_model=schemas_invoice.Invoice)
def create_new_invoice(
    invoice: schemas_invoice.InvoiceCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    try:
        return crud_invoice.create_invoice(db, invoice, background_tasks)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas_invoice.Invoice])
async def read_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return crud_invoice.get_invoices(db, skip=skip, limit=limit)

@router.get("/{invoice_id}", response_model=schemas_invoice.Invoice)
async def read_invoice(invoice_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_invoice = crud_invoice.get_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.post("/preview", response_model=schemas_invoice.InvoicePreviewResponse)
async def preview_invoice(preview_data: schemas_invoice.InvoicePreviewRequest, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    try:
        return crud_invoice.calculate_preview(db, preview_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
