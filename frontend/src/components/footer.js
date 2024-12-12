import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <Container>
        <p>&copy; {new Date().getFullYear()} Padel Paraná. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
};

export default Footer;
