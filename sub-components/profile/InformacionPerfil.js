import { Col, Row, Card } from 'react-bootstrap';

//Propiedades a mostrar
/*Ej: propiedades: [{
    titulo: '',
    valor: ''
}]*/
const InformacionPerfil = ({titulo, subtitulo, descripcion, propiedades, children}) => {
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">{titulo}</Card.Title>
                    <span className="text-uppercase fw-medium text-dark fs-5 ls-2">{subtitulo && subtitulo}</span>
                    <p className="mt-2 mb-6">{descripcion && descripcion}
                    </p>
                    <Row>
                        {propiedades && propiedades.map((propiedad, i) => propiedad && <Col key={`propiedad-${i}`} xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">{propiedad.titulo}</h6>
                            <p className="mb-0">{propiedad.valor}</p>
                        </Col>)}
                    </Row>
                    {children}
                </Card.Body>
            </Card>
            
        </Col>
    )
}

export default InformacionPerfil