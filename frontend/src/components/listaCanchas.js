import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Container, Button, Modal, Form, Spinner } from "react-bootstrap";

const CanchaList = () => {
  const [canchas, setCanchas] = useState([]);
  const[canchasIdEliminar, setCanchaIdEliminar] = useState("");
  const[showActualizarModal, setShowActualizarModal] = useState(false);
  const[canchaActualizar, setCanchaActualizar] = useState({id: "", nombre: "", techada:false});
  const[loading, setLoading] = useState(false)


  const actualizarCanchas = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8000/canchas");
      setCanchas(response.data);
    } catch (error) {
      console.error("Error al obtener el listado de canchas", error);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    actualizarCanchas();
  }, []);

  if(loading){
    return (
      <Container>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        Cargando...
      </Container>
    )
  }

  const eliminarCancha = async () => {
    setLoading(true)
    try{
      await axios.delete(`http://localhost:8000/canchas/${canchasIdEliminar}?cancha_id=${canchasIdEliminar}`);
      alert("Cancha eliminada correctamente")
      setCanchaIdEliminar("")
      actualizarCanchas()

    }catch(error){
      console.error("Error al eliminar la cancha",error)
    }
    finally{
      setLoading(false)
    }
  }

  const abrirModalActualizar = (cancha) => {
    setCanchaActualizar({id:cancha.id, nombre: cancha.nombre, techada:cancha.techada})
    setShowActualizarModal(true)
  }


  const actualizar = async () => {
    setLoading(true)
    try{
      await axios.put(`http://localhost:8000/canchas/${canchaActualizar.id}/`,{
        nombre: canchaActualizar.nombre,
        techada:canchaActualizar.techada,
      });
      alert("Cancha actualizada correctamente")
      setShowActualizarModal(false)
      actualizarCanchas()

    }catch(error){
      console.error("Error al actualizar cancha",error)
      alert("No se pudo actualizar la cancha")
    }finally{
      setLoading(false)
    }
  }

  return (
    <Container className="mt-4 yellow-background">
        <h2> Nuestras Canchas</h2>
      {canchas.length > 0 ? (
        <ListGroup>
          {canchas.map((cancha) => (
            <ListGroup.Item key={cancha.id} className="d-flex justify-content-between align-items-center">
              {cancha.nombre} {cancha.techada ? "(Techada)" : "(A cielo abierto)"}
              <Button
              variant="success"
              className="mb-3"
              onClick={() => abrirModalActualizar(cancha)}
              >
                Actualizar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No se encontraron canchas disponibles.</p>
      )}

      <div className="mt-4">
        <h3>Eliminar cancha</h3>
        <Form className="form-content">
          <Form.Group className="mb-3">
            <Form.Label>ID de la cancha:</Form.Label>
            <Form.Control
            type= "text"
            placeholder="Ingrese el ID de la cancha"
            value={canchasIdEliminar}
            onChange={(e) => setCanchaIdEliminar(e.target.value)} 
            />
          </Form.Group>
          <Button variant="danger" onClick={eliminarCancha}>
            Eliminar
          </Button>
        </Form>
      </div>

      <Modal show={showActualizarModal} onHide={() => setShowActualizarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar cancha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre:</Form.Label>
              <Form.Control
              type="text"
              placeholder="Nombre de la cancha"
              value={canchaActualizar.nombre}
              onChange={(e) =>
                setCanchaActualizar({...canchaActualizar,nombre: e.target.value})
              } 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
              type="checkbox"
              label="Techada"
              checked={canchaActualizar.techada}
              onChange={(e) => 
                setCanchaActualizar({...canchaActualizar, techada: e.target.checked})
              } 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActualizarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={actualizar}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CanchaList;
