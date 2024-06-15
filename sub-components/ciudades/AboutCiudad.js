// import node module libraries
import { Col, Row, Card, Button, Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from 'react';
import { set } from "react-hook-form";
import { useRouter } from "next/router";

const AboutCiudad = ({ ciudad, refreshFlag }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (refreshFlag) {
      console.log("Component has refreshed.");
    } else {
      console.log("Component has not refreshed.");
    }
  }, [ciudad, refreshFlag]);

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
              <p className="mb-0">{ciudad.nombre}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Estado</h6>
              <p className="mb-0">{ciudad.estado}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Código </h6>
              <p className="mb-0">{ciudad.codigoCiudad}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Pais </h6>
              <p className="mb-0">{ciudad.idPais}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Ubicación</h6>
              <p className="mb-0">Latitud: {ciudad.latitud}</p>
              <p className="mb-0">Longitud: {ciudad.longitud}</p>
            </Col>
            <Col xs={6}>
              <br />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutCiudad;
