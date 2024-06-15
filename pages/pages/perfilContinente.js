import {  Container, Row, Col, Card } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import InformacionPerfil from "sub-components/profile/InformacionPerfil";
import EditarContinente from "sub-components/continentes/EditarContinente";


const PerfilContinente = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const { reference } = router.query;
  const [continente, setContinente] = useState()

  useEffect(() => {
    getContinente()
  }, []);

  const getContinente = async () => {
    try {
      const response = await fetch("/api/continentes?reference=" + reference, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("No se pudo obtener la información");
      } else {
        setContinente({ ...data, reference: reference })
      }
    } catch (error) {
      console.error("Problema obteniendo la información:", error.message);
    }
  };




  useEffect(() => {
    if (user == null) router.push("/");
  }, [user]);

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
        {continente && (
          <div>
            <Row className="align-items-center">
              <Col lg={12} md={12} xs={12}>
                <div
                  className="pt-20 rounded-top"
                  style={{
                    background: "url(/images/background/profile-cover.jpg) no-repeat",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="bg-white rounded-bottom smooth-shadow-sm ">
                  <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                    <div className="d-flex align-items-center">
                      <div className="lh-1">
                        <h2 className="mb-0">
                          {continente.nombre}

                        </h2>
                        <p className="mb-0 d-block">{continente.descripcion}</p>
                      </div>
                    </div>
                    <div>
                      <EditarContinente continente={continente} setContinente={setContinente} />
                    </div>
                    
                  </div>

                </div>
              </Col>
            </Row>
            <div className="py-6">
              <Row>
                <Col lg={12} md={12} xs={12} className="mb-6">
                  <Card>
                    <Card.Body>
                      <Card.Title as="h3">Información</Card.Title>

                      <Row>
                        <Col xs={6} className="mb-5">
                          <h6 className="text-uppercase fs-5 ls-2">Nombre</h6>
                          <p className="mb-0">{continente.nombre}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                          <h6 className="text-uppercase fs-5 ls-2">Estado</h6>
                          <p className="mb-0">{continente.estado}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                          <h6 className="text-uppercase fs-5 ls-2">Código continente </h6>
                          <p className="mb-0">{continente.codigoContinente}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                          <h6 className="text-uppercase fs-5 ls-2">Descripción</h6>
                          <p className="mb-0">{continente.descripcion}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

          </div>
        )}
      </Container>
    </Layout>
  );
};

export default PerfilContinente;
