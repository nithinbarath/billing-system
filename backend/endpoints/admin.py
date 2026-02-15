from fastapi import APIRouter, Depends
from auth import get_current_admin
from models.admin import Admin
import schemas.admin as schemas_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/me", response_model=schemas_admin.Admin)
async def read_admin_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin
