import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Spinner } from 'react-bootstrap';

const ReservaForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    dia_hora: "",
    duracion: "",
    nombre_contacto: "",
    telefono_contacto: "",
    cancha_id: ""
  });

  const [validated, setValidated] = useState(false);
  const[loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    const formElement = e.currentTarget;
    if (formElement.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true)
      return;
    }

    e.preventDefault();
    
    setLoading(true)
    try {
      await axios.post("http://localhost:8000/reservas", form);
      onSuccess(); // Llama a la función para actualizar
      alert("Reserva creada exitosamente");
    } catch (error) {
      alert("Error al crear la reserva: " + error.message);
    }
    finally{
      setLoading(false)
    }

    //setValidated(true);
  };

  if(loading){
    return(
      <Container>
        <Spinner animation="border" role="status">
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
        Cargando...
      </Container>
    )
  }

  return (
    <div className='yellow-background'>
       <Form noValidate validated={validated} onSubmit={handleSubmit} className='form-content'>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="diaHora">
          <Form.Label>Dia y hora:</Form.Label>
          <Form.Control
            type="datetime-local"
            name="dia_hora"
            value={form.dia_hora}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingresa una fecha y hora válida.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="duracion">
          <Form.Label>Duración (Horas):</Form.Label>
          <Form.Control
            type="number"
            name="duracion"
            min="1"
            max="2"
            value={form.duracion}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingresa la duración en horas
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="nombreContacto">
        <Form.Label>Nombre Contacto:</Form.Label>
        <Form.Control
          type="text"
          name="nombre_contacto"
          value={form.nombre_contacto}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Por favor, ingresa un nombre de contacto.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="telefonoContacto">
        <Form.Label>Teléfono Contacto:</Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text>+54</InputGroup.Text>
          <Form.Control
            type="text"
            name="telefono_contacto"
            value={form.telefono_contacto}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingresa un número de teléfono válido.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="canchaId">
        <Form.Label>ID de Cancha:</Form.Label>
        <Form.Control
          type="text"
          name="cancha_id"
          value={form.cancha_id}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Por favor, ingresa un número de cancha.
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="success">
        Reservar
      </Button>
    </Form>
    </div>
  );
};

export default ReservaForm;