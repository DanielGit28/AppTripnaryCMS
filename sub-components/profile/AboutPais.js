// import node module libraries
import { Col, Row, Card, Button, Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from 'react';
import { set } from "react-hook-form";
import { useRouter } from "next/router";

const AboutPais = ({ pais, refreshFlag }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (refreshFlag) {
      console.log("Component has refreshed.");
    } else {
      console.log("Component has not refreshed.");
    }
  }, [pais, refreshFlag]);

  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
      {/* card */}
      <Card>
        {/* card body */}
        <Card.Body>
          {/* card title */}
          <Card.Title as="h3">Información</Card.Title>
          <Row>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Nombre</h6>
              <p className="mb-0">{pais.nombre}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Estado</h6>
              <p className="mb-0">{pais.estado}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Código </h6>
              <p className="mb-0">{pais.codigoPais}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Continente </h6>
              <p className="mb-0">{pais.idContinente}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Ubicación</h6>
              <p className="mb-0">Latitud: {pais.latitud}</p>
              <p className="mb-0">Longitud: {pais.longitud}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutPais;
