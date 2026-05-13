from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db.session import engine, Base, get_db
from .models import models
from .api import auth, sales, analytics, datasets

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sales BI Enterprise API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Sales BI Enterprise API"}

# Include routers
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
