from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_admin
from models.admin import Admin
import crud.product as crud_product
import schemas.product as schemas_product

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[schemas_product.Product])
async def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    products = crud_product.get_products(db, skip=skip, limit=limit)
    return products

@router.post("/", response_model=schemas_product.Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: schemas_product.ProductCreate, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_product = crud_product.get_product_by_code(db, product_id=product.product_id)
    if db_product:
        raise HTTPException(
            status_code=400,
            detail="Product with this product_id already exists"
        )
    return crud_product.create_product(db=db, product=product)

@router.get("/{product_id}", response_model=schemas_product.Product)
async def read_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_product = crud_product.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.patch("/{product_id}", response_model=schemas_product.Product)
async def update_product(
    product_id: int, 
    product: schemas_product.ProductUpdate, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_product = crud_product.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_product = crud_product.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
