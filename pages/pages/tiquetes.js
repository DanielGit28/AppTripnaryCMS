import React from "react";
// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

// import widget as custom components
import { ListaTiquetes } from "sub-components";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

const Tiquetes = () => {
  const { user } = useAuthContext();
  const router = useRouter();

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
    <div>
      <Layout>
        <Container fluid className="p-6">
          <div className="py-6">
            <ListaTiquetes></ListaTiquetes>
          </div>
        </Container>
      </Layout>
    </div>
  );
};

export default Tiquetes;