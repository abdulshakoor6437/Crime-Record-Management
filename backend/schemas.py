from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from enum import Enum

class RoleEnum(str, Enum):
    Admin = 'Admin'
    Officer = 'Officer'

class GenderEnum(str, Enum):
    Male = 'Male'
    Female = 'Female'

class CriminalStatusEnum(str, Enum):
    Arrested = 'Arrested'
    Wanted = 'Wanted'
    Released = 'Released'

class CaseStatusEnum(str, Enum):
    Open = 'Open'
    Under_Investigation = 'Under Investigation'
    Solved = 'Solved'
    Closed = 'Closed'

class PriorityLevelEnum(str, Enum):
    Low = 'Low'
    Medium = 'Medium'
    High = 'High'

# Users
class UserBase(BaseModel):
    username: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Officers
class OfficerBase(BaseModel):
    officer_name: str
    rank_name: Optional[str] = None
    contact_no: Optional[str] = None
    station_name: Optional[str] = None

class OfficerCreate(OfficerBase):
    user_id: Optional[int] = None

class Officer(OfficerBase):
    officer_id: int
    user_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# CrimeTypes
class CrimeTypeBase(BaseModel):
    crime_name: str
    description: Optional[str] = None

class CrimeTypeCreate(CrimeTypeBase):
    pass

class CrimeType(CrimeTypeBase):
    crime_type_id: int

    class Config:
        from_attributes = True

# Locations
class LocationBase(BaseModel):
    city: Optional[str] = None
    area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    location_id: int

    class Config:
        from_attributes = True

# Criminals
class CriminalBase(BaseModel):
    criminal_name: str
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None
    address: Optional[str] = None
    status: Optional[CriminalStatusEnum] = None

class CriminalCreate(CriminalBase):
    pass

class Criminal(CriminalBase):
    criminal_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Cases
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    case_date: Optional[date] = None
    status: Optional[CaseStatusEnum] = None

class CaseCreate(CaseBase):
    crime_type_id: Optional[int] = None
    location_id: Optional[int] = None

class Case(CaseBase):
    case_id: int
    crime_type_id: Optional[int] = None
    location_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Victims
class VictimBase(BaseModel):
    victim_name: str
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None
    contact_no: Optional[str] = None
    address: Optional[str] = None

class VictimCreate(VictimBase):
    pass

class Victim(VictimBase):
    victim_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
