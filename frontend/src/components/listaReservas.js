import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Row, Col, Button, ListGroup, Container, Modal, Spinner } from "react-bootstrap";

const ReservaList = () => {
  const [reservas, setReservas] = useState([]);
  const [filtros, setFiltros] = useState({ dia_hora: "", canchaId: "" });
  const[reservaIdEliminar, setReservaIdEliminar] = useState("")
  const[showActualizarModal,setShowActualizarModal] = useState(false)
  const[reservaActualizar, setReservaActualizar] = useState({
    id:"",
    nombre_contacto:"",
    dia_hora:"",
    duracion:"",
    telefono_contacto:"",
    cancha_id:""
  })
  const[loading, setLoading] = useState(false)

  const cargarReservas = async () => {
    setLoading(true)
    try {
      let url = "http://localhost:8000/reservas";

      const params = {};
      if (filtros.dia_hora) params.dia = filtros.dia_hora;
      if (filtros.canchaId) params.cancha_id = filtros.canchaId;

      if (Object.keys(params).length > 0) {
        url = "http://localhost:8000/reservas/filtradas";
        url += "?" + new URLSearchParams(params).toString();
      }
      const response = await axios.get(url);
      setReservas(response.data);
    } catch (error) {
      console.error("Error al obtener las reservas", error);
    }
    finally{
      setLoading(false)
    }
  }

  const eliminarReserva = async () => {
    setLoading(true)
    if (!reservaIdEliminar) {
      alert("Por favor, ingresa un ID válido para eliminar.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/reservas/${reservaIdEliminar}`);
      alert("Reserva eliminada correctamente.");
      setReservaIdEliminar(""); // Limpiar el campo de texto
      cargarReservas(); // Refrescar la lista de reservas
    } catch (error) {
      console.error("Error al eliminar la reserva", error);
    }
    finally{
      setLoading(false)
    }
  };

  const abrirModalActualizar = (reserva) => {
    setReservaActualizar({
      id: reserva.id,
      nombre_contacto: reserva.nombre_contacto,
      dia_hora: reserva.dia_hora,
      duracion: reserva.duracion,
      telefono_contacto: reserva.telefono_contacto,
      cancha_id: reserva.canchaId
    })
    setShowActualizarModal(true)
  };

  const actualizarReserva = async () => {
    setLoading(true)
    try{
      await axios.patch(`http://localhost:8000/reservas/${reservaActualizar.id}/`,{
        nombre_contacto: reservaActualizar.nombre_contacto,
        dia_hora: reservaActualizar.dia_hora,
        duracion: reservaActualizar.duracion,
        telefono_contacto: reservaActualizar.telefono_contacto,
        cancha_id: reservaActualizar.cancha_id
      });
      alert("Reserva actualizada correctamente")
      setShowActualizarModal(false)
      cargarReservas()
    }catch(error){
      console.error("Error al actualizar la reserva",error)
      console.alert("No se pudo actualizar la reserva")
    }
    finally{
      setLoading(false)
    }
  }


  useEffect(() => {
    cargarReservas();
  }, []);

  if(loading){
    return(
      <Container>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        Cargando...
      </Container>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    cargarReservas();
  };

  return (
    <Container className="mt-4 yellow-background">
      <Form onSubmit={handleSubmit} className="form-content">
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formDia">
              <Form.Label>Dia:</Form.Label>
              <Form.Control
                type="date"
                name="dia_hora"
                value={filtros.dia_hora}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formCanchaId">
              <Form.Label>Id de Cancha:</Form.Label>
              <Form.Control
                type="number"
                name="canchaId"
                value={filtros.canchaId}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit">
          Buscar
        </Button>
      </Form>

      {/* Lista de reservas */}
      <h2>Lista de Reservas</h2>
      {reservas.length > 0 ? (
        <ListGroup>
          {reservas.map((reserva) => (
            <ListGroup.Item key={reserva.id}>
              {reserva.nombre_contacto} -{" "}
              {new Date(reserva.dia_hora).toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' } )} - duracion: {reserva.duracion}{" "}
              horas -
              cancha_id: {reserva.cancha_id}{" "}
              <Button
              variant="success"
              className="ms-3"
              onClick={() => abrirModalActualizar(reserva)} 
              >
                Actualizar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No se encontraron reservas</p>
      )}

            {/*Eliminar reservas*/ }
            <div className="mt-4">
        <h3>Eliminar reserva</h3>
        <Form className="form-content">
          <Form.Group className="mb-3">
            <Form.Label>ID de la reserva:</Form.Label>
            <Form.Control
            type="text"
            placeholder="Ingrese el ID de la reserva"
            value={reservaIdEliminar}
            onChange={(e) => setReservaIdEliminar(e.target.value)}
            />
          </Form.Group>
          <Button variant="danger" onClick={eliminarReserva}>
            Eliminar
          </Button>
        </Form>
      </div>

      {/*Modal de actualizacion */}
      <Modal
      show={showActualizarModal}
      onHide={() => setShowActualizarModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora:</Form.Label>
              <Form.Control
              type="datetime-local"
              value={reservaActualizar.dia_hora}
              onChange={(e) =>
                setReservaActualizar({
                  ...reservaActualizar,
                  dia_hora: e.target.value,
                })
              } 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre de contacto:</Form.Label>
              <Form.Control
              type="text"
              placeholder="Nombre del contacto"
              value={reservaActualizar.nombre_contacto}
              onChange={(e) =>
                setReservaActualizar({
                  ...reservaActualizar,
                  nombre_contacto: e.target.value,
                })
              } 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>telefono de contacto:</Form.Label>
              <Form.Control
              type="number"
              placeholder="Telefono de contacto"
              value={reservaActualizar.telefono_contacto}
              onChange={(e) =>
                setReservaActualizar({
                  ...reservaActualizar,
                  telefono_contacto: e.target.value,
                })
              } 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duracion:</Form.Label>
              <Form.Control
              type="number"
              placeholder="Duracion de la reserva: "
              value={reservaActualizar.duracion}
              onChange={(e) =>
                setReservaActualizar({
                  ...reservaActualizar,
                  duracion: e.target.value,
                })
              } 
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>ID cancha:</Form.Label>
              <Form.Control
              type="number"
              placeholder="ID de la cancha"
              value={reservaActualizar.cancha_id}
              onChange={(e) =>
                setReservaActualizar({
                  ...reservaActualizar,
                  cancha_id: e.target.value,
                })
              } 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
          variant="secondary"
          onClick={() => setShowActualizarModal(false)}
          >
            Cancelar
          </Button>

          <Button
          variant="primary"
          onClick={actualizarReserva}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservaList;

/* 
            const queryParams = new URLSearchParams(
                Object.entries(filtros).filter(([_,value]) => value)
            ).toString();
            const url = queryParams
            ? `http://localhost:8000/filtradas?dia=${filtros.dia}&cancha_id=${filtros.canchaId}`
            : "http://localhost:8000/reservas";

            const response = await axios.get(url);
            console.log("Response data: ",response.data)
            setReservas(response.data);
        }catch(error){
            console.error("Error al obtener las reservas",error)
        }
*/