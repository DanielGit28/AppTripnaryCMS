// import node module libraries
import { Col, Row, Card } from 'react-bootstrap';

const InfoGeneralLugar = ({ lugar }) => {
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* card */}
            <Card>
                {/* card body */}
                <Card.Body>
                    {/* card title */}
                    <Card.Title as="h4">Información</Card.Title>

                    <Row>
                      
                        <Col xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Categoría</h6>
                            <p className="mb-0">{lugar.categoriaViaje}</p>
                        </Col>

                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Temporada recomendada </h6>
                            <p className="mb-0">{lugar.temporada}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Puntuación</h6>
                            <p className="mb-0">{lugar.puntuacion}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Latitud </h6>
                            <p className="mb-0">{lugar.latitud}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Longitud</h6>
                            <p className="mb-0">{lugar.longitud}</p>
                        </Col>

                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default InfoGeneralLugar