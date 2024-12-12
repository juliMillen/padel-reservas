import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Spinner, Container } from "react-bootstrap";


const CanchaForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nombre: "",
    techada: false,
  });
  const [validated, setValidated] = useState(false);
  const[loading,setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (formElement.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true)
    try {
      const response = await axios.post("http://localhost:8000/canchas", form);
      console.log("Respuesta del servidor: ", response);
      onSuccess(); // Actualiza el listado de canchas
      alert("Cancha creada exitosamente");
      setForm({ nombre: "", techada: false });
      setValidated(false); // Reinicia la validación
    } catch (error) {
      alert("Error al crear la cancha", error);
    }
    finally{
      setLoading(false)
    }
  };

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

  return (
    <div className="yellow-background">
       <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-content">
      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre de la cancha:</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Por favor, ingresa el nombre de la cancha.
        </Form.Control.Feedback>
        <Form.Control.Feedback>datos validos</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="techada">
        <Form.Check
          type="checkbox"
          name="techada"
          label="¿Es techada?"
          checked={form.techada}
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit" variant="success">
        Crear cancha
      </Button>
    </Form>
    </div>
  );
};

export default CanchaForm;