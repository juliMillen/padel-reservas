from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Conexion a la base de datos postgres
engine = create_engine('postgresql+psycopg2://postgres:42576661@localhost:5432/reservasPaddle')

Base = declarative_base()

Session_local = sessionmaker(bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = Session_local()
    try:
        yield db
    finally:
        db.close()

