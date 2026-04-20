import os
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles  # <-- MUST HAVE THIS
from app.routers import users, task
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager")

# MOUNT STATIC FILES - Ensure the directory "app/static" actually exists
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# TEMPLATE SETUP
BASE_PATH = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_PATH, "templates"))

# ROUTERS
app.include_router(users.router)
app.include_router(task.router, prefix="/tasks")

@app.get("/")
async def serve_home(request: Request):
    return templates.TemplateResponse(
        request=request, 
        name="index.html", 
        context={"request": request}
    )