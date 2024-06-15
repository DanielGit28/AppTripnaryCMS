// import node module libraries
import { Col, Row, Container, Button, Card, Link, Dropdown } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import widget as custom components
import { PageHeading } from 'widgets'

import { CambiarEstadoTiquete } from "sub-components";

const Tiquete = () => {
  const [tiquete, setTiquete] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const router = useRouter();
  const { reference } = router.query;

  const handleMethodFinish = () => {
    setRefreshFlag(!refreshFlag);
    getTiqueteByReference();
  };

  const handleStateChange = (event) => {
    updateState(event.target.textContent);
  };

  const updateState = async (estado) => {
    const newAdmin = {
      reference: reference,
      estado: estado,
    };
    try {
      const response = await fetch("/api/tiquetes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      handleMethodFinish();
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  useEffect(() => {
    getTiqueteByReference();
  }, []);

  const getTiqueteByReference = async () => {
    try {
      const response = await fetch(`/api/tiquetes?reference=${reference}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      data.reference = reference;

      // data.fechaDeCreacion = new Date( data.fechaDeCreacion._seconds * 1000 + data.fechaDeCreacion._nanoseconds / 1000, ).toUTCString()

      setTiquete(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  const redirectToPerfilUsuario = (correo) => {
    const prop = { correo: correo };
    router.push({
      pathname: "/pages/perfilUsuario",
      query: prop,
    });
  };

  const responderTiquete = (tiquete) => {
    window.open(`mailto:${tiquete.correoElectronico}?subject=ref:${tiquete.reference}&body=En respuesta a su tiquete ${tiquete.mensajeUsuario}`, '_blank').focus();
  }

  const correo = {
    "color": "#AF93EC",
    "cursor": "pointer",
    "textDecoration": "underline"
  };

  const dropdownEstado = {
    "width": "100%",
  }

  useEffect(() => {
    if (tiquete == null) router.push("/");
  }, [tiquete]);

  const Layout =
    Component.Layout ||
    (router.pathname && router.pathname.includes("dashboard")
      ? router.pathname.includes("instructor") ||
        router.pathname.includes("student")
        ? DefaultDashboardLayout
        : DefaultDashboardLayout
      : DefaultDashboardLayout);

  return (
    <Layout>
        <Container fluid className="p-6">
        <PageHeading heading="Tiquete" />

        <Row className="mt-6">
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10, offset: 1 }} md={12} xs={12}>
               <Row>
                    <Col xs={12} className="mb-6">
                        <Card>
                            <Card.Header className="p-4 bg-white">
                                <h4 className="mb-0"><span className="text-muted">Número de tiquete: </span>{tiquete.reference}</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row className="row">
                                    <Col xl={8} lg={6} md={12} xs={12}>
                                        <div className="mb-2">
                                            <p className="text-muted mb-0">Categoría: {tiquete.categoria}</p>
                                            <h3 className="mt-2 mb-3 fw-bold"><span className="text-muted">Usuario: </span><a style={correo} onClick={() => {redirectToPerfilUsuario(tiquete.correoElectronico)}}>{tiquete.correoElectronico}</a></h3>
                                            
                                            <small className="text-muted">
                                                Mensaje del usuario:
                                            </small>
                                            <p>{tiquete.mensajeUsuario}</p>
                                            <p>
                                                <i className="fe fe-info fs-4 me-2 text-muted icon-xs"></i>
                                                Fecha y hora de creación: <span className="text-dark fw-bold"> {tiquete.fechaDeCreacion} </span>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={6} md={12} xs={12}>
                                        <div>
                                            <small className="text-muted">
                                                Responder por correo
                                            </small>
                                            <Button variant="success" className="d-grid mb-2 w-100" onClick={() => responderTiquete(tiquete)}>
                                                Responder
                                            </Button>

                                            <small className="text-muted">
                                                Cambiar estado
                                            </small>

                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" style={dropdownEstado} id="dropdown-basic">
                                                    {tiquete.estado}
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

                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Col>
        </Row>
        </Container>
    </Layout>
  );
};

export default Tiquete;
