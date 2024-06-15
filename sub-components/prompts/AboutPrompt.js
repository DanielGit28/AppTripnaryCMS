import { Col, Row, Card, Button, Alert } from "react-bootstrap";

const AboutPrompt = ({ prompt }) => {

  return prompt && (
    <Col  lg={12} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <Card.Title as="h3">Información</Card.Title>
          
          <Row>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Nombre</h6>
              <p className="mb-0">{prompt.nombre}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Estado</h6>
              <p className="mb-0">{prompt.estado}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Tipo </h6>
              <p className="mb-0">{prompt.tipo}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Descripción</h6>
              <p className="mb-0">{prompt.descripcion}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutPrompt;
