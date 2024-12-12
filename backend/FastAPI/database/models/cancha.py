from sqlalchemy import Column,Integer, String, Boolean
from database.bd import Base
from sqlalchemy.orm import relationship


class Cancha(Base):
    __tablename__= "canchas"

    id= Column(Integer, primary_key=True, index=True)
    nombre=Column(String, nullable=False, unique=True)
    techada=Column(Boolean,default=False)

    reservas = relationship("Reserva",back_populates="cancha")


    def __init__(self,nombre,techada):
        self.nombre = nombre
        self.techada = techada


