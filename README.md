# Task Manager Web App

A full-stack Task Management application built with **FastAPI**, **SQLAlchemy**, and **Vanilla JavaScript**. This project features secure user authentication (JWT) and a clean, responsive UI for managing daily tasks.

## 🚀 Features
* **User Authentication**: Secure Register/Login system using JWT tokens and Bcrypt hashing.
* **CRUD Operations**: Create, Read, Update, and Delete tasks.
* **Persistent Storage**: SQLite database integration via SQLAlchemy.
* **Frontend**: Responsive UI built with HTML/CSS and asynchronous JavaScript.

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/pavithragan2006/task_manager.git](https://github.com/pavithragan2006/task_manager.git)
cd task_manager
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
Environment Variables
Create a .env file in the root directory (optional, but recommended for production):

SECRET_KEY: Your unique secret key for JWT.

ALGORITHM: HS256.
how to run locally
uvicorn app.main:app --reload
deployment link -- https://task-manager-kiso.onrender.com
