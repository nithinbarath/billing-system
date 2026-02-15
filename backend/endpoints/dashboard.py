from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from auth import get_current_admin
from models.admin import Admin
from models.invoice import Invoice
from models.product import Product

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard-stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    total_invoices = db.query(Invoice).count()
    revenue = db.query(func.sum(Invoice.rounded_net_price)).scalar() or 0.0
    total_products = db.query(Product).count()
    low_stock_count = db.query(Product).filter(Product.available_stocks < 10).count()
    
    recent_invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).limit(5).all()
    
    return {
        "total_invoices": total_invoices,
        "revenue": float(revenue),
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "recent_invoices": [
            {
                "id": inv.id,
                "customer_email": inv.customer_email,
                "amount": inv.rounded_net_price,
                "created_at": inv.created_at
            } for inv in recent_invoices
        ]
    }
