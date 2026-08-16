// eslint-disable-next-line no-unused-vars
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navbar1() {
  return (
    <Navbar expand="lg" className="bg-body-tertiar" style={{backgroundColor:'white'}}>
      <Container>
        <Navbar.Brand><Link to="/" style={{ textDecoration: 'none', color: 'black', fontSize:'28px' }}>Ishaara_Ai</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link>
              <Link to="/Translate" style={{ textDecoration: 'none', color: 'black', fontSize:'20px'}}>Translate</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/Services" style={{ textDecoration: 'none', color: 'black', fontSize:'20px' }}>Services</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/Gallery" style={{ textDecoration: 'none', color: 'black', fontSize:'20px' }}>Gallery</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/About" style={{ textDecoration: 'none', color: 'black', fontSize:'20px' }}>About</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/Model" style={{ textDecoration: 'none', color: 'black', fontSize:'20px' }}>Model</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar1;
