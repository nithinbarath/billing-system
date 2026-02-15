from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from endpoints import auth, admin, dashboard, products, denominations, invoices
import models.admin 
import models.product
import models.denomination
import models.invoice
from auth import SECRET_KEY, ALGORITHM, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import jwt, JWTError
from datetime import timedelta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Billing System API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def sliding_session_middleware(request: Request, call_next):
    # 1. Get token from cookie
    token = request.cookies.get("access_token")
    
    response = await call_next(request)
    
    # 2. If token exists and response is successful, refresh it
    if token and response.status_code < 400:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            
            if username:
                # 3. Create a fresh token
                new_token = create_access_token(
                    data={"sub": username},
                    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                )
                
                # 4. Set the new token in the cookie
                response.set_cookie(
                    key="access_token",
                    value=new_token,
                    httponly=True,
                    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                    expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                    samesite="lax",
                    secure=False  # Set to True in production with HTTPS
                )
        except JWTError:
            # Token is invalid or expired, don't refresh
            pass
            
    return response

# Include Routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(dashboard.router)
app.include_router(products.router)
app.include_router(denominations.router)
app.include_router(invoices.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
