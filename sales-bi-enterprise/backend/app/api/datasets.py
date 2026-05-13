from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io
from ..db.session import get_db
from ..models import models
from datetime import datetime

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel.")

    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        # Data Cleaning
        df = df.dropna(subset=['order_date', 'revenue', 'product_name'])
        df = df.drop_duplicates()
        
        # Intelligent Column Mapping (Basic)
        column_mapping = {
            'Order Date': 'order_date',
            'Revenue': 'revenue',
            'Profit': 'profit',
            'Quantity': 'quantity',
            'Product Name': 'product_name',
            'Category': 'category',
            'Region': 'region_name',
            'Customer Name': 'customer_name'
        }
        df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})

        # Process and Save
        records_processed = 0
        for _, row in df.iterrows():
            # 1. Region
            region_name = str(row.get('region_name', 'Unknown'))
            region = db.query(models.Region).filter_by(name=region_name).first()
            if not region:
                region = models.Region(name=region_name)
                db.add(region)
                db.flush()

            # 2. Product
            prod_name = str(row.get('product_name'))
            product = db.query(models.Product).filter_by(name=prod_name).first()
            if not product:
                product = models.Product(
                    name=prod_name,
                    category=str(row.get('category', 'Uncategorized')),
                    price=float(row.get('revenue', 0)) / float(row.get('quantity', 1)) if float(row.get('quantity', 1)) > 0 else 0
                )
                db.add(product)
                db.flush()

            # 3. Customer
            cust_name = str(row.get('customer_name', 'Walk-in Customer'))
            customer = db.query(models.Customer).filter_by(name=cust_name).first()
            if not customer:
                customer = models.Customer(name=cust_name)
                db.add(customer)
                db.flush()

            # 4. Sale
            sale = models.Sale(
                order_date=pd.to_datetime(row['order_date']),
                ship_date=pd.to_datetime(row.get('ship_date', row['order_date'])),
                quantity=int(row.get('quantity', 1)),
                revenue=float(row.get('revenue', 0)),
                profit=float(row.get('profit', 0)),
                region_id=region.id,
                product_id=product.id,
                customer_id=customer.id
            )
            db.add(sale)
            records_processed += 1

        db.commit()
        return {"message": f"Successfully processed {records_processed} records", "filename": file.filename}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/history")
async def get_upload_history(db: Session = Depends(get_db)):
    # This is a placeholder, you could create an UploadHistory model
    return {"history": []}
