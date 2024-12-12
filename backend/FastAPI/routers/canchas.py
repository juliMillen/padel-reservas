from fastapi import APIRouter, Depends,HTTPException,status
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from database.bd import get_db
from database.models.cancha import Cancha


router = APIRouter()

class CanchaResponse(BaseModel):
    id:int
    nombre:str
    techada:bool

    model_config = ConfigDict(from_attributes=True)



class CanchaCreate(BaseModel):
    nombre:str
    techada:bool

#Obtener todas las canchas
@router.get("/",response_model=list[CanchaResponse])
async def listar_canchas(db:Session = Depends(get_db)):
    canchas= db.query(Cancha).all()

    if not canchas:
        raise HTTPException(status.HTTP_404_NOT_FOUND,detail="No hay canchas creadas")   #se podria poner un status 200 porque no es un error no tener canchas creadas

    return canchas

#Crear una cancha
@router.post("/",status_code=status.HTTP_201_CREATED)
async def crear_Cancha(cancha:CanchaCreate, db:Session = Depends(get_db)):

    if not cancha.nombre.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Por favor ingrese un nombre valido para la cancha")
    
    cancha_existente = db.query(Cancha).filter(Cancha.nombre == cancha.nombre).first()
    if cancha_existente:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Ya existe una cancha con ese nombre")
    
    nueva_cancha= Cancha(
        nombre = cancha.nombre,
        techada= cancha.techada
    )

    db.add(nueva_cancha)
    db.commit()
    db.refresh(nueva_cancha)
    return {"message":"Cancha creada correctamente",
            "cancha":nueva_cancha}


#Eliminar una cancha
@router.delete("/{id}")
async def eliminar_Cancha(cancha_id:int,db:Session = Depends(get_db)):
    cancha = db.query(Cancha).filter(Cancha.id == cancha_id).first()

    if not cancha:
        raise HTTPException(status.HTTP_404_NOT_FOUND,detail="Cancha no encontrada")
    
    db.delete(cancha)
    db.commit()
    return {"message": "Cancha eliminada correctamente"}


#Actualizar una cancha
@router.put("/{id}/")
async def modificar_Cancha(id:int,cancha:CanchaCreate,db:Session = Depends(get_db)):
    cancha_existente = db.query(Cancha).filter(
        Cancha.id == id
    ).first()

    if not cancha.nombre.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST,detail="Debe ingresar un nombre valido")


    if not cancha_existente:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="La cancha no existe")
    
    cancha_existente.nombre = cancha.nombre
    cancha_existente.techada = cancha.techada

    db.commit()
    db.refresh(cancha_existente)

    return{"message":"cancha actualizada correctamente",
           "cancha":cancha_existente}
