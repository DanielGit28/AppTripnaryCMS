// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import sub components
import {
  AboutMeUser,
  CambiarEstado,
  RecuperarContrasenniaUser,
  ProfileHeaderUser,
} from "sub-components";

const Profile = () => {
  const [admins, setAdmin] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();
  const { correo } = router.query;
  const admin = admins[0];
  const handleMethodFinish = () => {
    setRefreshFlag(!refreshFlag);
    getUserByMail();
  };

  useEffect(() => {
    getUserByMail();
  }, []);

  const getUserByMail = async () => {
    try {
      const response = await fetch("/api/user?correoElectronico=" + correo, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAdmin(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
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
        {admin && (
          <div>
            <ProfileHeaderUser user={admin} />
            <div className="py-6">
              <Row>
                <AboutMeUser user={admin} refreshFlag={refreshFlag} />
                <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                  <CambiarEstado
                    reference={admin.reference}
                    estado={admin.estado}
                    onMethodFinish={handleMethodFinish}
                  />
                  <RecuperarContrasenniaUser />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Profile;
