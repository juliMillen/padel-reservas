from fastapi import APIRouter, Depends,HTTPException,status
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict, validator
from database.bd import get_db
from database.models.cancha import Cancha
from database.models.reserva import Reserva
from datetime import timedelta,datetime,date,time
from typing import Optional

router = APIRouter()

class ReservaResponse(BaseModel):
    id:int
    dia_hora:datetime
    duracion:int
    nombre_contacto:str
    telefono_contacto:str
    cancha_id:int

    model_config = ConfigDict(from_attributes=True)



class ReservaCreate(BaseModel):
    dia_hora:datetime
    duracion:int
    telefono_contacto:str
    nombre_contacto:str
    cancha_id:int
    
    @validator('duracion')
    def validar_duracion(cls,v):
        if v < 1 or v > 2:
            raise ValueError("La duracion debe estar entre 1 y 2 horas")
        return v
    

    @validator('dia_hora')
    def validar_horario(cls,v,values):
        hora_reserva = v.time()
        duracion = values.get('duracion',1)

        hora_inicio = time(14,0,0)
        hora_fin = time(23,0,0)

        ##calculo de hora de finalizacion de la reserva
        fin_reserva = (datetime.combine(date.today(),hora_reserva) + timedelta(hours=duracion)).time()

        if hora_reserva < hora_inicio or fin_reserva > hora_fin:
            raise ValueError("Las reservas solo pueden estar en un rango entre las 14 horas y las 23 horas")
        return v
    
    @validator('telefono_contacto')
    def validar_telefono(cls,v):
        if len(v) != 10 or not v.isdigit():
            raise ValueError("El telefono debe tener exactamente 10 digitos numericos")
        return v
    
    @validator('cancha_id')
    def validar_cancha(cls,v):
        if(v is None or v <= 0):
            raise ValueError("Ingrese un ID valido - El campo no puede ser null")
        return v
    
    

class ReservaUpdate(BaseModel):
    dia_hora: Optional[datetime] = None
    duracion: Optional[int] = None
    telefono_contacto: Optional[str] = None
    nombre_contacto: Optional[str] = None
    cancha_id: Optional[int] = None
    @validator('duracion')
    def validar_duracion(cls,v):
        if v < 1 or v > 2:
            raise ValueError("La duracion debe estar entre 1 y 2 horas")
        return v
    

    @validator('dia_hora')
    def validar_horario(cls,v, values):
        hora_reserva = v.time()
        duracion = values.get('duracion',1)

        hora_inicio = time(14,0,0)
        hora_fin = time(23,0,0)

         ##calculo de hora de finalizacion de la reserva
        fin_reserva = (datetime.combine(date.today(),hora_reserva) + timedelta(hours=duracion)).time()

        if hora_reserva < hora_inicio or fin_reserva > hora_fin:
            raise ValueError("Las reservas solo pueden estar en un rango entre las 14 horas y las 23 horas")
        return v
    
    @validator('telefono_contacto')
    def validar_telefono(cls,v):
        if len(v) != 10 or not v.isdigit():
            raise ValueError("El telefono debe tener exactamente 10 digitos numericos")
        return v



#Obtener todas las reservas
@router.get("/", response_model=list[ReservaResponse])
async def listar_todas_reservas(db:Session = Depends(get_db)):
    reservas = getReservas(db)

    if not reservas:
        raise HTTPException(status.HTTP_204_NO_CONTENT)          #mismo que en canchas no es un error que no haya reservas 
    
    return reservas


#Obtener una reserva mediante filtros dia y cancha
@router.get("/filtradas", response_model = list[ReservaResponse])
async def listar_reservas_filtradas(dia:date,
                    cancha_id: int,
                   db:Session = Depends(get_db)):
   fecha_inicio = datetime.combine(dia,datetime.min.time())
   fecha_fin = fecha_inicio + timedelta(days=1)

   reservas = db.query(Reserva).filter(
       Reserva.cancha_id == cancha_id,
       Reserva.dia_hora >= fecha_inicio,
       Reserva.dia_hora < fecha_fin
  ).all()

   if not reservas:
       raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="No se encontraron reservas")            #mismo que para las demas reservas y canchas no es un error que no hayan reservas
   
   return reservas

"""
#filtrar canchas con parametros opcionales
@router.get("/filtradas", response_model=list[ReservaResponse])
async def listar_reservas_filtradas(
    dia: Optional[date] = None,
    cancha_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    # Inicializa la consulta base
    query = db.query(Reserva)
    
    # Agrega filtros según los parámetros recibidos
    if dia:
        fecha_inicio = datetime.combine(dia, datetime.min.time())
        fecha_fin = fecha_inicio + timedelta(days=1)
        query = query.filter(Reserva.dia_hora >= fecha_inicio, Reserva.dia_hora < fecha_fin)
    
    if cancha_id:
        query = query.filter(Reserva.cancha_id == cancha_id)
    
    # Ejecuta la consulta
    reservas = query.all()
    
    if not reservas:
        raise HTTPException(
            status_code=400,
            detail="No se encontraron reservas para los filtros proporcionados"
        )
    
    return reservas
"""



#Creacion de una reserva
@router.post("/",status_code=status.HTTP_201_CREATED)
async def crear_Reserva(reserva:ReservaCreate, db:Session = Depends(get_db)):
    ##verifico si ya hay una reserva existente
    existe = verificarReservas(reserva,db)

    if existe:
        raise HTTPException(status.HTTP_404_NOT_FOUND,detail="Ya hay una reserva existente")
    
    if not reserva.nombre_contacto.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Por favor ingrese un nombre de contacto")
    

    nueva_Reserva = Reserva(
        dia_hora = reserva.dia_hora,
        duracion = reserva.duracion,
        nombre_contacto = reserva.nombre_contacto,
        telefono_contacto = reserva.telefono_contacto,
        cancha_id = reserva.cancha_id
    )
    db.add(nueva_Reserva)
    db.commit()

    return {"message":"Reserva creada correctamente",
            "reserva":nueva_Reserva}


# actualizacion total de la reserva
@router.put("/{id}/")
async def modificar_Reserva(id:int,reserva:ReservaCreate,db:Session = Depends(get_db)):
    existe = db.query(Reserva).filter(
        Reserva.id == id
    ).first()

    if not existe:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="La reserva no existe")
    
    reserva_superpuesta = verificarReservas(reserva,db)

    if reserva_superpuesta:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,detail="Reserva superpuesta")
    
    existe.dia_hora = reserva.dia_hora
    existe.duracion = reserva.duracion
    existe.telefono_contacto = reserva.telefono_contacto
    existe.nombre_contacto = reserva.nombre_contacto
    existe.cancha_id = reserva.cancha_id

    db.commit()
    db.refresh(existe)

    return{"message":"Reserva actualizada correctamente"}

#Actualizacion parcial de la reserva
@router.patch("/{id}/")
async def modificar_Reserva(id:int,reserva:ReservaUpdate,db:Session = Depends(get_db)):
    existe = db.query(Reserva).filter(
        Reserva.id == id
    ).first()

    if not existe:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="La reserva no existe")
    
    update_data = reserva.dict(exclude_unset=True)

    reserva_temporal = ReservaUpdate(**{**existe.__dict__,**update_data})

    if verificarReservas(reserva_temporal,db,reserva_id=id):
        raise HTTPException(status.HTTP_400_BAD_REQUEST,detail="Reserva superpuesta")
    
    for key, value in update_data.items():
        setattr(existe,key,value)

    db.commit()
    db.refresh(existe)

    return{"message":"Reserva actualizada correctamente"}


#Eliminar una reserva
@router.delete("/{id}",status_code=status.HTTP_200_OK)
async def eliminar_Reserva(id:int,db:Session = Depends(get_db)):
    reserva_Buscada = buscarReservas(id,db)

    if not reserva_Buscada:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,detail="Reserva no encontrada")
    
    db.delete(reserva_Buscada)
    db.commit()

    return {"message":"Reserva eliminada correctamente"}



def verificarReservas(reserva:ReservaCreate,db:Session, reserva_id: Optional[int] = None):
    fin_nueva_reserva = reserva.dia_hora + timedelta(hours=reserva.duracion)

    query = db.query(Reserva).filter(
        Reserva.cancha_id == reserva.cancha_id,
    )

    if reserva.dia_hora and fin_nueva_reserva:
        query = query.filter(
            Reserva.dia_hora < fin_nueva_reserva,
            Reserva.dia_hora + timedelta(hours=reserva.duracion) > reserva.dia_hora,
        )

    if reserva_id:
        query = query.filter(Reserva.id != reserva_id)

    existentes = query.all()
    return len(existentes) > 0

"""
def verificarReservas(reserva:ReservaCreate,db:Session):
    fin_nueva_reserva = reserva.dia_hora + timedelta(hours=reserva.duracion)
    
    existentes = db.query(Reserva).filter(
        Reserva.cancha_id == reserva.cancha_id,
        Reserva.dia_hora < fin_nueva_reserva,
        Reserva.dia_hora + timedelta(hours=reserva.duracion) > reserva.dia_hora
    ).all()
    return len(existentes) > 0
"""

def buscarReservas(reserva_id:int,db:Session):
    buscada = db.query(Reserva).filter(
        Reserva.id == reserva_id
    ).first()
    return buscada

def getReservas(db:Session):
    return db.query(Reserva).all()
