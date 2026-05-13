import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..db.session import SessionLocal, engine
from ..models import models
from ..core.security import get_password_hash

def seed_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.User).first():
        print("Data already exists. Skipping seed.")
        return

    # Create Users
    admin = models.User(
        email="admin@salesbi.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        role="admin"
    )
    analyst = models.User(
        email="analyst@salesbi.com",
        hashed_password=get_password_hash("analyst123"),
        full_name="Analyst User",
        role="analyst"
    )
    db.add_all([admin, analyst])

    # Create Regions
    regions = [
        models.Region(name="North America", country="USA", continent="North America"),
        models.Region(name="Europe", country="Germany", continent="Europe"),
        models.Region(name="Asia Pacific", country="Australia", continent="Oceania"),
        models.Region(name="South America", country="Brazil", continent="South America"),
    ]
    db.add_all(regions)
    db.commit()

    # Create Products
    categories = ["Electronics", "Furniture", "Clothing", "Office Supplies"]
    products = []
    for cat in categories:
        for i in range(5):
            cost = random.uniform(10, 500)
            price = cost * random.uniform(1.2, 2.0)
            p = models.Product(
                name=f"{cat} Product {i+1}",
                category=cat,
                subcategory=f"{cat} Sub {i+1}",
                cost=cost,
                price=price
            )
            products.append(p)
    db.add_all(products)
    db.commit()

    # Create Customers
    segments = ["Corporate", "Consumer", "Small Business"]
    customers = []
    for i in range(20):
        c = models.Customer(
            name=f"Customer {i+1}",
            email=f"customer{i+1}@example.com",
            segment=random.choice(segments)
        )
        customers.append(c)
    db.add_all(customers)
    db.commit()

    # Create Sales & Shipments
    start_date = datetime.now() - timedelta(days=365)
    for _ in range(200):
        order_date = start_date + timedelta(days=random.randint(0, 365))
        qty = random.randint(1, 10)
        prod = random.choice(products)
        rev = prod.price * qty
        prof = (prod.price - prod.cost) * qty
        
        sale = models.Sale(
            order_date=order_date,
            ship_date=order_date + timedelta(days=random.randint(1, 7)),
            quantity=qty,
            revenue=rev,
            profit=prof,
            discount=random.uniform(0, 0.2),
            product_id=prod.id,
            customer_id=random.choice(customers).id,
            region_id=random.choice(regions).id
        )
        db.add(sale)
        db.flush() # Get sale ID

        shipment = models.Shipment(
            sale_id=sale.id,
            status=random.choice(["Delivered", "Shipped", "Delayed"]),
            delivery_date=sale.ship_date + timedelta(days=random.randint(0, 2))
        )
        db.add(shipment)

    # Marketing Spend
    for r in regions:
        for i in range(12):
            ms = models.MarketingSpend(
                date=start_date + timedelta(days=i*30),
                channel=random.choice(["Social Media", "Google Ads", "Email"]),
                spend=random.uniform(1000, 5000),
                region_id=r.id
            )
            db.add(ms)

    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
