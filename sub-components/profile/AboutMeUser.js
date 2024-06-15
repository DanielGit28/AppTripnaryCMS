// import node module libraries
import { Col, Row, Card } from "react-bootstrap";
import { useEffect } from "react";
const AboutMeUser = ({ user, refreshFlag }) => {
  useEffect(() => {
    if (refreshFlag) {
      console.log("Component has refreshed.");
    } else {
      console.log("Component has not refreshed.");
    }
  }, [user, refreshFlag]);
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
              <p className="mb-0">{user.nombre}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Estado</h6>
              <p className="mb-0">{user.estado}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Teléfono </h6>
              <p className="mb-0">
                {" "}
                {user.telefono && user.telefono.trim() !== "null"
                  ? `+506 ${user.telefono}`
                  : "N/A"}
              </p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Fecha de Nacimiento </h6>
              <p className="mb-0">
                {user.fechaNacimiento
                  ? new Date(user.fechaNacimiento).toLocaleString()
                  : "N/A"}
              </p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Correo Electrónico </h6>
              <p className="mb-0">{user.correoElectronico}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Ubicación</h6>
              <p className="mb-0">
                Latitud: {user.latitudDireccion ? user.latitudDireccion : "N/A"}
              </p>
              <p className="mb-0">
                Longitud:{" "}
                {user.longitudDireccion ? user.longitudDireccion : "N/A"}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutMeUser;
