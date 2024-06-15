import React from "react";
// import node module libraries
import { Col, Row, Container } from "react-bootstrap";
import { Component, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// import widget as custom components
import {
  ListaReportesUsuariosRegistrados,
  ListaReportesCantidadViajes,
  ListaReportesCantidadPorDestinoViajes,
} from "sub-components";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";

const Reportes = () => {
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
          <div className="py-6" style={{ display: "flex", gap: "20px" }}>
            <ListaReportesUsuariosRegistrados></ListaReportesUsuariosRegistrados>
            <ListaReportesCantidadViajes></ListaReportesCantidadViajes>
          </div>
          <ListaReportesCantidadPorDestinoViajes></ListaReportesCantidadPorDestinoViajes>
        </Container>
      </Layout>
    </div>
  );
};

export default Reportes;
