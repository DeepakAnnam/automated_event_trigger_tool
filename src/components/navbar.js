"use client";

import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">Event Trigger</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/signup">Signup</Nav.Link>
            <Nav.Link as={Link} href="/login">Login</Nav.Link>
            <Nav.Link as={Link} href="/upload">Upload</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
