import React from "react";
// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";



import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import ListaContinentes from "sub-components/continentes/listaContinentes";

const Continentes = () => {
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
            <ListaContinentes></ListaContinentes>
          </div>
        </Container>
      </Layout>
    </div>
  );
};

export default Continentes;
