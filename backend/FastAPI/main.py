from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.bd import create_tables
from routers import reservas,canchas

create_tables()

app = FastAPI()

app.include_router(canchas.router, prefix="/canchas", tags=["canchas"])
app.include_router(reservas.router, prefix="/reservas", tags=["Reservas"])



@app.get("/")
async def root():
    return "Sistema de reserva"


# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes (usar esto solo en desarrollo)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los encabezados
)