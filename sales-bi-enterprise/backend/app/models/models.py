from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="viewer") # admin, analyst, viewer
    is_active = Column(Boolean, default=True)

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    country = Column(String)
    continent = Column(String)
    sales = relationship("Sale", back_populates="region")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    subcategory = Column(String)
    cost = Column(Float)
    price = Column(Float)
    sales = relationship("Sale", back_populates="product")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    segment = Column(String) # Corporate, Home Office, etc.
    sales = relationship("Sale", back_populates="customer")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    order_date = Column(DateTime, default=func.now())
    ship_date = Column(DateTime)
    quantity = Column(Integer)
    revenue = Column(Float)
    profit = Column(Float)
    discount = Column(Float)
    
    product_id = Column(Integer, ForeignKey("products.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    region_id = Column(Integer, ForeignKey("regions.id"))
    
    product = relationship("Product", back_populates="sales")
    customer = relationship("Customer", back_populates="sales")
    region = relationship("Region", back_populates="sales")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    stock_level = Column(Integer)
    last_updated = Column(DateTime, default=func.now())

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    status = Column(String) # Shipped, Delayed, Delivered
    delivery_date = Column(DateTime)

class MarketingSpend(Base):
    __tablename__ = "marketing_spend"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    channel = Column(String)
    spend = Column(Float)
    region_id = Column(Integer, ForeignKey("regions.id"))
