from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import models
from datetime import datetime, timedelta
import pandas as pd

class AnalyticsService:
    @staticmethod
    def get_kpis(db: Session):
        total_revenue = db.query(func.sum(models.Sale.revenue)).scalar() or 0
        total_orders = db.query(func.count(models.Sale.id)).scalar() or 0
        total_profit = db.query(func.sum(models.Sale.profit)).scalar() or 0
        profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Last month comparison
        one_month_ago = datetime.now() - timedelta(days=30)
        prev_revenue = db.query(func.sum(models.Sale.revenue)).filter(models.Sale.order_date < one_month_ago).scalar() or 0
        curr_revenue = db.query(func.sum(models.Sale.revenue)).filter(models.Sale.order_date >= one_month_ago).scalar() or 0
        revenue_growth = ((curr_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0

        # Top Region
        top_region_query = db.query(
            models.Region.name,
            func.sum(models.Sale.revenue).label('revenue')
        ).join(models.Sale).group_by(models.Region.name).order_by(func.sum(models.Sale.revenue).desc()).first()
        top_region = top_region_query.name if top_region_query else "N/A"

        # Top Product
        top_product_query = db.query(
            models.Product.name,
            func.sum(models.Sale.revenue).label('revenue')
        ).join(models.Sale).group_by(models.Product.name).order_by(func.sum(models.Sale.revenue).desc()).first()
        top_product = top_product_query.name if top_product_query else "N/A"

        return {
            "totalRevenue": round(total_revenue, 2),
            "totalSales": total_orders,
            "profitMargin": round(profit_margin, 2),
            "revenueGrowth": round(revenue_growth, 2),
            "topRegion": top_region,
            "topProduct": top_product,
        }

    @staticmethod
    def get_revenue_trend(db: Session):
        # Group by month
        sales = db.query(
            func.strftime('%Y-%m', models.Sale.order_date).label('month'),
            func.sum(models.Sale.revenue).label('revenue')
        ).group_by('month').order_by('month').all()
        
        return [{"month": s.month, "revenue": round(s.revenue, 2)} for s in sales]

    @staticmethod
    def get_regional_sales(db: Session):
        regional = db.query(
            models.Region.name,
            func.sum(models.Sale.revenue).label('revenue')
        ).join(models.Sale).group_by(models.Region.name).all()
        
        return [{"region": r.name, "revenue": round(r.revenue, 2)} for r in regional]

    @staticmethod
    def get_category_sales(db: Session):
        categories = db.query(
            models.Product.category,
            func.sum(models.Sale.revenue).label('revenue')
        ).join(models.Sale).group_by(models.Product.category).all()
        
        return [{"category": c.category, "value": round(c.revenue, 2)} for c in categories]

    @staticmethod
    def get_operational_metrics(db: Session):
        total_shipments = db.query(func.count(models.Shipment.id)).scalar() or 0
        delayed = db.query(func.count(models.Shipment.id)).filter(models.Shipment.status == "Delayed").scalar() or 0
        
        delay_rate = (delayed / total_shipments * 100) if total_shipments > 0 else 0
        
        return {
            "delayRate": round(delay_rate, 2),
            "totalShipments": total_shipments,
            "delayedOrders": delayed,
            "efficiency": 94.2 # Mock
        }
