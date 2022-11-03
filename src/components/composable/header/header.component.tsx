import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import logo from "../../../logo.png";

export const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to="home">
            <i className="bi bi-list list-view"></i>
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
