from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..services.analytics import AnalyticsService

router = APIRouter()

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    return AnalyticsService.get_kpis(db)

@router.get("/revenue-trend")
def get_revenue_trend(db: Session = Depends(get_db)):
    return AnalyticsService.get_revenue_trend(db)

@router.get("/regional-sales")
def get_regional_sales(db: Session = Depends(get_db)):
    return AnalyticsService.get_regional_sales(db)

@router.get("/category-sales")
def get_category_sales(db: Session = Depends(get_db)):
    return AnalyticsService.get_category_sales(db)

@router.get("/operational-metrics")
def get_operational_metrics(db: Session = Depends(get_db)):
    return AnalyticsService.get_operational_metrics(db)
