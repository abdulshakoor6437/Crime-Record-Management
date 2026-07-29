# 🚓 Crime Record Management System

A full-stack web application designed for law enforcement agencies and police departments to manage, track, and analyze crime records, case files, officer details, criminal databases, victims, FIRs, and court/prison records.

---

## 🚀 Features

- 📊 **Interactive Dashboard**: Real-time stats on total cases, open investigations, registered criminals, active police officers, and recent case activity.
- 📁 **Case Management**: Create, update, and manage crime cases with status tracking (*Open*, *Under Investigation*, *Solved*, *Closed*).
- 👮 **Police Officer Directory**: Track officer details, ranks, contact information, and station assignments.
- 🦹 **Criminal Records**: Database of criminals with age, gender, address, and status (*Arrested*, *Wanted*, *Released*).
- 👥 **Victim Records**: Maintain structured victim data linked to specific crime cases.
- 📋 **FIR & Complaint System**: File First Information Reports (FIR) and track public complaints.
- ⚖️ **Court & Prison Tracking**: Store court hearing details, judge verdicts, and prison sentencing records.
- ⚡ **RESTful API**: Built with FastAPI, complete with auto-generated interactive OpenAPI/Swagger docs.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### **Database**
- **MySQL** / **SQLite** (`Crime record management system.sql` schema included)

---

## 📂 Project Structure

```text
Crime-Record-Management/
├── backend/
│   ├── main.py                       # FastAPI application entry point & routes
│   ├── database.py                   # SQLAlchemy database connection configuration
│   ├── models.py                     # Database models & relationships
│   ├── schemas.py                    # Pydantic validation schemas
│   ├── seed.py                       # Initial sample data seeder
│   └── crime_record_management.db    # SQLite database file (development)
├── frontend/
│   ├── src/
│   │   ├── components/               # UI Components (Sidebar, Header, etc.)
│   │   ├── pages/                    # Views (Dashboard, Cases, Criminals, Officers, etc.)
│   │   ├── services/                 # API service configuration (Axios)
│   │   ├── App.jsx                   # Main App Router component
│   │   └── main.jsx                  # React application entry point
│   ├── package.json
│   └── vite.config.js
├── Crime record management system.sql # MySQL database import file
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Python 3.9+**
- **Node.js 18+** and **npm**
- **MySQL Server** (Optional if using SQLite)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment and activate it:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql pydantic
   ```

4. *(Optional)* Seed initial test data:
   ```bash
   python seed.py
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at: **`http://localhost:8000`**  
   Interactive API documentation (Swagger UI): **`http://localhost:8000/docs`**

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be running at: **`http://localhost:5173`**

---

## 🗄️ Database Import (MySQL)

If you prefer using **MySQL** over SQLite:

1. Create a database named `Crime_Record_Management_System` in MySQL.
2. Import the provided SQL script:
   ```bash
   mysql -u root -p Crime_Record_Management_System < "Crime record management system.sql"
   ```
3. Update `SQLALCHEMY_DATABASE_URL` in `backend/database.py` with your MySQL credentials:
   ```python
   SQLALCHEMY_DATABASE_URL = "mysql+pymysql://<user>:<password>@localhost:3306/Crime_Record_Management_System"
   ```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns summary statistics & recent cases |
| `GET` | `/api/cases` | Fetch all registered crime cases |
| `POST` | `/api/cases` | Create a new crime case |
| `GET` | `/api/officers` | List all police officers |
| `POST` | `/api/officers` | Register a new police officer |
| `GET` | `/api/criminals` | List all criminal records |
| `POST` | `/api/criminals` | Add a new criminal record |
| `GET` | `/api/victims` | List all victim entries |
| `POST` | `/api/victims` | Add a victim record |
| `GET` | `/api/crime_types` | Fetch list of crime categories |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

Developed by **[Abdul Shakoor](https://github.com/abdulshakoor6437)**.
