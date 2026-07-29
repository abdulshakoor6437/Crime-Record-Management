from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Crime Record Management System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Crime Record Management API"}

@app.get("/api/cases", response_model=List[schemas.Case])
def read_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cases = db.query(models.Case).offset(skip).limit(limit).all()
    return cases

@app.post("/api/cases", response_model=schemas.Case)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    db_case = models.Case(**case.model_dump())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    # Trigger logging manually for SQLite since we don't have DB triggers
    log = models.CaseLog(case_id=db_case.case_id, action="New Case Added")
    db.add(log)
    db.commit()
    
    return db_case

@app.get("/api/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_cases = db.query(models.Case).count()
    open_cases = db.query(models.Case).filter(models.Case.status == 'Open').count()
    total_criminals = db.query(models.Criminal).count()
    total_officers = db.query(models.Officer).count()
    
    recent_cases = db.query(models.Case).order_by(models.Case.case_date.desc()).limit(5).all()
    
    return {
        "stats": {
            "total_cases": total_cases,
            "open_cases": open_cases,
            "total_criminals": total_criminals,
            "total_officers": total_officers
        },
        "recent_cases": [{"id": c.case_id, "title": c.title, "status": c.status, "date": c.case_date} for c in recent_cases]
    }

@app.get("/api/officers", response_model=List[schemas.Officer])
def read_officers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Officer).offset(skip).limit(limit).all()

@app.get("/api/criminals", response_model=List[schemas.Criminal])
def read_criminals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Criminal).offset(skip).limit(limit).all()

@app.get("/api/crime_types", response_model=List[schemas.CrimeType])
def read_crime_types(db: Session = Depends(get_db)):
    return db.query(models.CrimeType).all()

@app.get("/api/victims", response_model=List[schemas.Victim])
def read_victims(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Victim).offset(skip).limit(limit).all()

@app.post("/api/officers", response_model=schemas.Officer)
def create_officer(officer: schemas.OfficerCreate, db: Session = Depends(get_db)):
    db_officer = models.Officer(**officer.model_dump())
    db.add(db_officer)
    db.commit()
    db.refresh(db_officer)
    return db_officer

@app.post("/api/criminals", response_model=schemas.Criminal)
def create_criminal(criminal: schemas.CriminalCreate, db: Session = Depends(get_db)):
    db_criminal = models.Criminal(**criminal.model_dump())
    db.add(db_criminal)
    db.commit()
    db.refresh(db_criminal)
    return db_criminal

@app.post("/api/victims", response_model=schemas.Victim)
def create_victim(victim: schemas.VictimCreate, db: Session = Depends(get_db)):
    db_victim = models.Victim(**victim.model_dump())
    db.add(db_victim)
    db.commit()
    db.refresh(db_victim)
    return db_victim
