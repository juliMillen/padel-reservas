from sqlalchemy import Column,Integer,String, ForeignKey,DateTime
from sqlalchemy.orm import relationship
from database.bd import Base

class Reserva(Base):
    __tablename__= "reservas"

    id = Column(Integer, primary_key=True, index=True)
    dia_hora = Column(DateTime, nullable=False)
    duracion = Column(Integer, nullable=False)
    telefono_contacto = Column(String,nullable=False)
    nombre_contacto = Column(String,nullable=False)
    cancha_id = Column(Integer,ForeignKey('canchas.id'),nullable=False)

    cancha = relationship('Cancha',back_populates='reservas')