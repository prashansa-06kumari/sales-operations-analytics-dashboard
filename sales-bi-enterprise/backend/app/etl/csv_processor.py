import pandas as pd
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..models import models
import os

class ETLProcessor:
    def __init__(self, db: Session):
        self.db = db

    def process_sales_csv(self, file_path: str):
        """
        Expects a CSV with columns: 
        order_date, ship_date, quantity, revenue, profit, product_name, category, region_name, customer_name
        """
        df = pd.read_csv(file_path)
        
        # Simple cleaning
        df = df.dropna()
        
        for _, row in df.iterrows():
            # 1. Get or Create Region
            region = self.db.query(models.Region).filter_by(name=row['region_name']).first()
            if not region:
                region = models.Region(name=row['region_name'])
                self.db.add(region)
                self.db.flush()

            # 2. Get or Create Product
            product = self.db.query(models.Product).filter_by(name=row['product_name']).first()
            if not product:
                product = models.Product(
                    name=row['product_name'],
                    category=row['category'],
                    price=row['revenue'] / row['quantity']
                )
                self.db.add(product)
                self.db.flush()

            # 3. Get or Create Customer
            customer = self.db.query(models.Customer).filter_by(name=row['customer_name']).first()
            if not customer:
                customer = models.Customer(name=row['customer_name'])
                self.db.add(customer)
                self.db.flush()

            # 4. Create Sale
            sale = models.Sale(
                order_date=pd.to_datetime(row['order_date']),
                ship_date=pd.to_datetime(row['ship_date']),
                quantity=row['quantity'],
                revenue=row['revenue'],
                profit=row['profit'],
                region_id=region.id,
                product_id=product.id,
                customer_id=customer.id
            )
            self.db.add(sale)

        self.db.commit()
        print(f"Successfully processed {len(df)} records from {file_path}")

if __name__ == "__main__":
    db = SessionLocal()
    processor = ETLProcessor(db)
    
    # Check for files in raw_data
    raw_data_dir = os.path.join(os.getcwd(), "raw_data")
    if os.path.exists(raw_data_dir):
        for file in os.listdir(raw_data_dir):
            if file.endswith(".csv"):
                processor.process_sales_csv(os.path.join(raw_data_dir, file))
    db.close()
