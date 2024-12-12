import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Marca o logo */}
        <Navbar.Brand as={Link} to="/">
          PP
        </Navbar.Brand>
        {/* Botón de toggler para dispositivos pequeños */}
        <Navbar.Toggle aria-controls="navbarNav" />
        {/* Enlaces de navegación */}
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/agregarCancha">
              Agregar cancha
            </Nav.Link>
            <Nav.Link as={Link} to="/canchas">
              Lista de Canchas
            </Nav.Link>
            <Nav.Link as={Link} to="/reservas">
              Listado de Reservas
            </Nav.Link>
            <Nav.Link as={Link} to="/reservar">
              Reservar
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;



/* navbar
import React from "react"
import { Link } from "react-router-dom"

const Navbar = () => { return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <Link className="navbar-brand" to="/"></Link>
            <button 
            className="navbat-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">

                    <li className="nav-item">
                        <Link className="nav-link" to="/">Inicio</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/agregarCancha">Agregar cancha</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/canchas">Lista de Canchas</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/reservas">Listado de Reservas</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/reservar">Reservar</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
)
}
export default Navbar;*/