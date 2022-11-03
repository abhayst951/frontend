import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./sidebar.css";

export const Side = () => {
  return (
    <>
      <Nav
        className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
        <Nav.Item className="nav-item">
          <Nav.Link>
            <Link to="/nf-configuration">NF Configuration</Link>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Link to="/site-registration">Site Registration</Link>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/nf-registration">NF Registration</Link>
        </Nav.Item>
      </Nav>
    </>
  );
};
