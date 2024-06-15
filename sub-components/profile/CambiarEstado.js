import React, { useState } from "react";
import { Col, Form, Button, Card, Image, Dropdown } from "react-bootstrap";

const CambiarEstado = ({ reference, estado, onMethodFinish }) => {
  const handleStateChange = (event) => {
    updateState(event.target.textContent);
  };

  const updateState = async (estado) => {
    const newAdmin = {
      reference: reference,
      estado: estado,
    };
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      onMethodFinish();
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title as="h4">Cambiar Estado</Card.Title>
        <Form>
          <Form.Group className="mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {estado}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item key={"Activo"} onClick={handleStateChange}>
                  Activo
                </Dropdown.Item>
                <Dropdown.Item key={"Inactivo"} onClick={handleStateChange}>
                  Inactivo
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          {/* Button */}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CambiarEstado;
