import React from "react";
import './App.css'
import { Container } from "react-bootstrap";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ReservaForm from "./components/reservaForm";
import ReservaList from "./components/listaReservas";
import CanchaList from "./components/listaCanchas";
import CanchaForm from "./components/canchaForm";

function Home() {
  return (
    <div className="home-background">
      <h2>Padel Paraná</h2> 
    </div>
  )
}

function App() {

  const handleSuccess = () => {
    console.log("Reserva creada exitosamente")
  }
  return (
    <Router>
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'yellow'
    }}>
      <Navbar />
      <Container fluid style={{ 
        position: 'relative', 
        zIndex: 10, 
        paddingTop: '60px' // Ajusta según la altura de tu navbar
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canchas" element={<CanchaList />} />
          <Route path="/agregarCancha" element={<CanchaForm  onSuccess={handleSuccess}/>} />
          <Route path="/reservas" element={<ReservaList />} />
          <Route path="/reservar" element={<ReservaForm onSuccess={handleSuccess} />} />
          <Route path="/agregarCancha" element={<CanchaForm />} />
        </Routes>
      </Container>
      <Footer /> 
    </div>
  </Router>  
  );
}

export default App;

