// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

// import widget as custom components
import { PageHeading } from "widgets";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

// import sub components
import {
  AboutPerfilLugar,
  InfoGeneralLugar,
  PerfilHeaderLugar,
  ProjectsContributions,
  RecentFromBlog,
} from "sub-components";

const PerfilLugar = () => {
  const [lugar, setLugar] = useState([]);
  const { user } = useAuthContext()
  const { userInfo } = useAuthContext()
  const router = useRouter();
  const { reference } = router.query;

  useEffect(() => {
   
    if (user == null) router.push("/")
  }, [user])

  useEffect(() => {
    getLugar();
  }, []);

  const getLugar = async () => {
    try {
      const response = await fetch("/api/lugares?reference=" + reference, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setLugar(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };


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
        {/* Page Heading */}

      {/* Profile Header  */}
      <PerfilHeaderLugar lugar={lugar} />

        {/* content */}
        <div className="py-6">
          <Row>
            {/* About Me */}
            <AboutPerfilLugar lugar={lugar} />

            <InfoGeneralLugar lugar={lugar} />


           

    
           
          </Row>
        </div>
      </Container>
    </Layout>
  );
};

export default PerfilLugar;
