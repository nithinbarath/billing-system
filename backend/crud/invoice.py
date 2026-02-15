import json
from sqlalchemy.orm import Session
from models.product import Product
from models.denomination import Denomination
from models.invoice import Invoice
from models.invoice_item import InvoiceItem
from schemas.invoice import InvoiceCreate

from fastapi import BackgroundTasks
from utils.email_utils import send_invoice_email

def create_invoice(db: Session, invoice: InvoiceCreate, background_tasks: BackgroundTasks):
    # 1. Create the Invoice record
    db_invoice = Invoice(
        customer_email=invoice.customer_email,
        total_without_tax=invoice.total_without_tax,
        total_tax=invoice.total_tax,
        net_price=invoice.net_price,
        rounded_net_price=invoice.rounded_net_price,
        cash_paid=invoice.cash_paid,
        balance_payable=invoice.balance_payable,
        cash_denominations=json.dumps(invoice.cash_denominations) if invoice.cash_denominations else None,
        change_denominations=json.dumps(invoice.change_denominations) if invoice.change_denominations else None
    )
    db.add(db_invoice)
    db.flush() # Get the invoice ID without committing yet

    # 2. Add Invoice Items and Update Product Stocks
    items_for_email = []
    for item in invoice.items:
        db_item = InvoiceItem(**item.model_dump(), invoice_id=db_invoice.id)
        db.add(db_item)
        
        # Collect for email
        items_for_email.append(item.model_dump())
        
        # Reduce product stock
        product = db.query(Product).filter(Product.product_id == item.product_id).first()
        if product:
             product.available_stocks -= item.quantity

    # 3. Update Denomination Counts in Cash Register
    if invoice.cash_denominations:
        for val, count in invoice.cash_denominations.items():
            db_denom = db.query(Denomination).filter(Denomination.denomination == int(val)).first()
            if db_denom:
                db_denom.count += int(count)

    if invoice.change_denominations:
        for val, count in invoice.change_denominations.items():
            db_denom = db.query(Denomination).filter(Denomination.denomination == int(val)).first()
            if db_denom:
                if db_denom.count < int(count):
                    raise ValueError(f"Insufficient stock for ₹{val} notes in register!")
                db_denom.count -= int(count)
    
    db.commit()
    db.refresh(db_invoice)

    # 4. Trigger Email in Background
    email_data = {
        "id": db_invoice.id,
        "total_without_tax": db_invoice.total_without_tax,
        "total_tax": db_invoice.total_tax,
        "rounded_net_price": db_invoice.rounded_net_price,
        "items": items_for_email
    }
    background_tasks.add_task(send_invoice_email, db_invoice.customer_email, email_data)

    return db_invoice

def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Invoice).offset(skip).limit(limit).all()

def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def calculate_preview(db: Session, preview_data):
    total_without_tax = 0
    total_tax = 0
    processed_items = []

    for item in preview_data.items:
        product = db.query(Product).filter(Product.product_id == item.product_id).first()
        if not product:
            continue
            
        qty = item.quantity
        unit_price = product.price_per_unit
        purchase_price = unit_price * qty
        tax_payable = (purchase_price * product.tax_percentage) / 100

        total_without_tax += purchase_price
        total_tax += tax_payable

        processed_items.append({
            "product_id": product.product_id,
            "product_name": product.name,
            "quantity": qty,
            "unit_price": unit_price,
            "purchase_price": purchase_price,
            "tax_percentage": product.tax_percentage,
            "tax_payable": tax_payable,
            "total_price": purchase_price + tax_payable
        })

    net_price = total_without_tax + total_tax
    rounded_net_price = int(net_price) # Math.floor equivalent in Python for positive numbers
    balance = preview_data.cash_paid - rounded_net_price

    if balance < 0:
        raise ValueError("Insufficient cash paid!")

    # Smart change notes calculation based on available stock
    remaining_balance = balance
    balance_denoms = []
    
    # 1. Get current till state
    denoms = db.query(Denomination).order_by(Denomination.denomination.desc()).all()
    # Create a local map of what we HAVE after the customer pays
    available = {d.denomination: d.count for d in denoms}
    for val, count in preview_data.cash_denominations.items():
        v = int(val)
        available[v] = available.get(v, 0) + int(count)

    # Capture current stock (including customer payment) BEFORE deducting change
    available_for_ui = {str(k): v for k, v in available.items()}

    change_denoms_dict = {}
    sorted_values = [500, 100, 50, 20, 10, 5, 2, 1]

    for v in sorted_values:
        if remaining_balance <= 0:
            break
            
        # How many of this note do we NEED?
        needed = int(remaining_balance // v)
        if needed > 0:
            # How many do we HAVE?
            can_give = min(needed, available.get(v, 0))
            if can_give > 0:
                balance_denoms.append({"denomination": v, "count": can_give})
                change_denoms_dict[str(v)] = can_give
                remaining_balance -= can_give * v
                available[v] -= can_give

    if remaining_balance > 0:
        raise ValueError(f"Insufficient specific denominations in register to provide precise change. Remaining shortfall: ₹{remaining_balance}")

    return {
        "customer_email": preview_data.customer_email,
        "total_without_tax": total_without_tax,
        "total_tax": total_tax,
        "net_price": net_price,
        "rounded_net_price": rounded_net_price,
        "cash_paid": preview_data.cash_paid,
        "balance_payable": balance,
        "cash_denominations": preview_data.cash_denominations,
        "change_denominations": change_denoms_dict,
        "items": processed_items,
        "balance_denoms": balance_denoms,
        "available_stocks": available_for_ui
    }
