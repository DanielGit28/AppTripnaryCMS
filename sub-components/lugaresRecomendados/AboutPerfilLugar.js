// import node module libraries
import { Col, Row, Card } from 'react-bootstrap';

const AboutPerfilLugar = ({lugar}) => {
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* card */}
            <Card>
                {/* card body */}
                <Card.Body>
                    {/* card title */}
                    <Card.Title as="h4">Información</Card.Title>
                    <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Descripción</span>
                    <p className="mt-2 mb-6">{lugar.descripcion}
                    </p>
                    <Row>
                        <Col xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Código Postal</h6>
                            <p className="mb-0">{lugar.codigoPostal}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Estado </h6>
                            <p className="mb-0">{lugar.estado}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Puntuación</h6>
                            <p className="mb-0">{lugar.puntuacion}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Hora de Apertura </h6>
                            <p className="mb-0">{lugar.horaInicial}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Hora de Cierre</h6>
                            <p className="mb-0">{lugar.horaFinal}</p>
                        </Col>
                       
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutPerfilLugar