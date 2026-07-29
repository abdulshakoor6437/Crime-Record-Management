import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# URL encode the password because it contains an '@' symbol
password = urllib.parse.quote_plus("Mahad@6225425")
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{password}@localhost:3306/Crime_Record_Management_System"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
