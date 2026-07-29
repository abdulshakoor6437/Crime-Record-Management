from database import SessionLocal, engine
import models
from datetime import date

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if we already have data
    if db.query(models.CrimeType).first():
        print("Database already seeded")
        return

    # Add Crime Types
    crime_types = [
        models.CrimeType(crime_name="Theft", description="Property stealing cases"),
        models.CrimeType(crime_name="Murder", description="Intentional killing"),
        models.CrimeType(crime_name="Cyber Crime", description="Internet based crimes"),
        models.CrimeType(crime_name="Kidnapping", description="Illegal abduction"),
        models.CrimeType(crime_name="Fraud", description="Financial fraud cases"),
    ]
    db.add_all(crime_types)
    
    # Add Cases
    cases = [
        models.Case(title="Mobile Theft Case", description="Mobile phone stolen from market", case_date=date(2025, 5, 10), status="Open", crime_type_id=1),
        models.Case(title="Murder Investigation", description="Suspicious murder case", case_date=date(2025, 5, 12), status="Under Investigation", crime_type_id=2),
        models.Case(title="Online Banking Fraud", description="Fraud through fake website", case_date=date(2025, 5, 15), status="Solved", crime_type_id=5),
        models.Case(title="Kidnapping Report", description="Child kidnapping complaint", case_date=date(2025, 5, 18), status="Open", crime_type_id=4),
        models.Case(title="Social Media Scam", description="Fake account scam case", case_date=date(2025, 5, 20), status="Closed", crime_type_id=3),
    ]
    db.add_all(cases)
    
    # Add Officers
    officers = [
        models.Officer(officer_name="Ahmed Khan", rank_name="Inspector", contact_no="03001234567", station_name="Islamabad Central"),
        models.Officer(officer_name="Ali Raza", rank_name="Sub Inspector", contact_no="03111234567", station_name="Rawalpindi Station"),
    ]
    db.add_all(officers)
    
    # Add Criminals
    criminals = [
        models.Criminal(criminal_name="Bilal Ahmed", age=32, gender="Male", address="Rawalpindi", status="Arrested"),
        models.Criminal(criminal_name="Usman Tariq", age=28, gender="Male", address="Islamabad", status="Wanted"),
    ]
    db.add_all(criminals)

    db.commit()
    print("Database seeded successfully")

if __name__ == "__main__":
    seed_db()
