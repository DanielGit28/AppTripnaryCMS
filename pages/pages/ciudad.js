// import node module libraries
import { Col, Row, Container, Button } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import sub components
import {
  AboutCiudad,
  CambiarEstado,
  HeaderCiudad,
  CambiarEstadoCiudad
} from "sub-components";

const Ciudad = () => {
  const [ciudad, setCiudad] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const router = useRouter();
  const { reference } = router.query;
//   const admin = admins[0];
  const handleMethodFinish = () => {
    setRefreshFlag(!refreshFlag);
    getCiudadByReference();
  };

  useEffect(() => {
    getCiudadByReference();
  }, []);

  const getCiudadByReference = async () => {
    try {
      const response = await fetch("/api/ciudades?reference=" + reference, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      data.reference = reference;
      setCiudad(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  useEffect(() => {
    if (ciudad == null) router.push("/");
  }, [ciudad]);

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
        {ciudad && (
          <div>
            <HeaderCiudad ciudad={ciudad} />
            <div className="py-6">
              <Row>
                <AboutCiudad ciudad={ciudad} refreshFlag={refreshFlag} />
                <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                  <CambiarEstadoCiudad
                    reference={ciudad.reference}
                    estado={ciudad.estado}
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

export default Ciudad;
