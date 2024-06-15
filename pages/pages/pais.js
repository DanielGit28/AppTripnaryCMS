// import node module libraries
import { Col, Row, Container, Button } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import sub components
import {
  AboutPais,
  CambiarEstado,
  HeaderPais,
  CambiarEstadoPais
} from "sub-components";

const Pais = () => {
  const [pais, setPais] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const router = useRouter();
  const { reference } = router.query;
  const handleMethodFinish = () => {
    setRefreshFlag(!refreshFlag);
    getPaisByReference();
  };

  useEffect(() => {
    getPaisByReference();
  }, []);

  const getPaisByReference = async () => {
    try {
      const response = await fetch("/api/paises?reference=" + reference, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      data.reference = reference;
      setPais(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  useEffect(() => {
    if (pais == null) router.push("/");
  }, [pais]);

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
        {pais && (
          <div>
            <HeaderPais pais={pais} />
            <div className="py-6">
              <Row>
                <AboutPais pais={pais} refreshFlag={refreshFlag} />
                <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                  <CambiarEstadoPais
                    reference={pais.reference}
                    estado={pais.estado}
                    onMethodFinish={handleMethodFinish}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Pais;
