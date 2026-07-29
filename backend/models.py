from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, DateTime, Text, Float, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    Admin = 'Admin'
    Officer = 'Officer'

class GenderEnum(str, enum.Enum):
    Male = 'Male'
    Female = 'Female'

class CriminalStatusEnum(str, enum.Enum):
    Arrested = 'Arrested'
    Wanted = 'Wanted'
    Released = 'Released'

class CaseStatusEnum(str, enum.Enum):
    Open = 'Open'
    Under_Investigation = 'Under Investigation'
    Solved = 'Solved'
    Closed = 'Closed'

class PriorityLevelEnum(str, enum.Enum):
    Low = 'Low'
    Medium = 'Medium'
    High = 'High'

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(32), nullable=False)
    role = Column(Enum(RoleEnum, values_callable=lambda obj: [e.value for e in obj]), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Officer(Base):
    __tablename__ = "officers"
    officer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    officer_name = Column(String(100), nullable=False)
    rank_name = Column(String(50))
    contact_no = Column(String(15))
    station_name = Column(String(100))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CrimeType(Base):
    __tablename__ = "crime_types"
    crime_type_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crime_name = Column(String(100), nullable=False)
    description = Column(Text)

class Location(Base):
    __tablename__ = "locations"
    location_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    city = Column(String(100))
    area = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)

class Criminal(Base):
    __tablename__ = "criminals"
    criminal_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    criminal_name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(Enum(GenderEnum, values_callable=lambda obj: [e.value for e in obj]))
    address = Column(String(200))
    status = Column(Enum(CriminalStatusEnum, values_callable=lambda obj: [e.value for e in obj]))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Victim(Base):
    __tablename__ = "victims"
    victim_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    victim_name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(Enum(GenderEnum, values_callable=lambda obj: [e.value for e in obj]))
    contact_no = Column(String(15))
    address = Column(String(200))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Case(Base):
    __tablename__ = "cases"
    case_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    crime_type_id = Column(Integer, ForeignKey("crime_types.crime_type_id"))
    location_id = Column(Integer, ForeignKey("locations.location_id"))
    case_date = Column(Date)
    status = Column(Enum(CaseStatusEnum, values_callable=lambda obj: [e.value for e in obj]))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    crime_type = relationship("CrimeType")
    location = relationship("Location")
    assignments = relationship("CaseAssignment", back_populates="case")

class CaseAssignment(Base):
    __tablename__ = "case_assignments"
    assignment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"))
    officer_id = Column(Integer, ForeignKey("officers.officer_id"))
    assigned_date = Column(Date)

    case = relationship("Case", back_populates="assignments")
    officer = relationship("Officer")

class CaseCriminal(Base):
    __tablename__ = "case_criminals"
    case_id = Column(Integer, ForeignKey("cases.case_id"), primary_key=True)
    criminal_id = Column(Integer, ForeignKey("criminals.criminal_id"), primary_key=True)

class CaseVictim(Base):
    __tablename__ = "case_victims"
    case_id = Column(Integer, ForeignKey("cases.case_id"), primary_key=True)
    victim_id = Column(Integer, ForeignKey("victims.victim_id"), primary_key=True)

class FIR(Base):
    __tablename__ = "fir"
    fir_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"))
    officer_id = Column(Integer, ForeignKey("officers.officer_id"), nullable=True)
    fir_date = Column(Date)
    complainant_name = Column(String(100))
    details = Column(Text)

class Evidence(Base):
    __tablename__ = "evidence"
    evidence_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"))
    evidence_type = Column(String(100))
    description = Column(Text)

class Complaint(Base):
    __tablename__ = "complaints"
    complaint_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"), nullable=True)
    complainant_name = Column(String(100))
    contact_no = Column(String(15))
    complaint_text = Column(Text)
    complaint_date = Column(Date)

class CaseUpdate(Base):
    __tablename__ = "case_updates"
    update_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"))
    update_details = Column(Text)
    update_date = Column(Date)

class CourtRecord(Base):
    __tablename__ = "court_records"
    court_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"))
    court_name = Column(String(100))
    judge_name = Column(String(100))
    hearing_date = Column(Date)
    verdict = Column(String(100))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PrisonRecord(Base):
    __tablename__ = "prison_records"
    prison_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    criminal_id = Column(Integer, ForeignKey("criminals.criminal_id"))
    prison_name = Column(String(100))
    sentence_years = Column(Integer)
    entry_date = Column(Date)
    release_date = Column(Date)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CasePriority(Base):
    __tablename__ = "case_priority"
    priority_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"), unique=True)
    priority_level = Column(Enum(PriorityLevelEnum, values_callable=lambda obj: [e.value for e in obj]))

class CaseLog(Base):
    __tablename__ = "case_logs"
    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id", ondelete="CASCADE"), nullable=True)
    action = Column(String(200))
    action_time = Column(DateTime(timezone=True), server_default=func.now())
