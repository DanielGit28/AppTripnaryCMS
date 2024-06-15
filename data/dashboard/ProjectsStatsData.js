import { set } from "date-fns";
import {
  Briefcase,
  ListTask,
  People,
  Bullseye,
  PersonGear,
  AirplaneEngines,
  PinMap,
} from "react-bootstrap-icons";
import { Container, Col, Row } from "react-bootstrap";
import { StatRightTopIcon } from "widgets";

import { Component, useEffect, useState } from "react";

export const ProjectStats = () => {
  const [estadisticas, setEstadisticas] = useState([]);

  useEffect(() => {
    getEstadisticasGenerales();
  }, []);

  const getEstadisticasGenerales = async () => {
    try {
      const response = await fetch(`/api/estadisticas`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstadisticas(data);

      return data;
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  const ProjectsStatsData = [
    {
      id: 1,
      title: "Admins",
      value: estadisticas.administradores,
      icon: <PersonGear size={18} />,
      statInfo: `<span className="text-dark me-2">${estadisticas.estadoAdmins}</span> Activos`,
    },
    {
      id: 2,
      title: "Usuarios",
      value: estadisticas.usuarios,
      icon: <People size={18} />,
      statInfo: `<span className="text-dark me-2">${estadisticas.estadoUsuarios}</span> Activos`,
    },
    {
      id: 3,
      title: "Planes de Viaje",
      value: estadisticas.planesViaje,
      icon: <AirplaneEngines size={18} />,
      statInfo: `<span className="text-dark me-2">${estadisticas.estadoPlanesViaje}</span> Activos`,
    },
    {
      id: 4,
      title: "Lugares Recomendados",
      value: estadisticas.lugaresRecomendados,
      icon: <PinMap size={18} />,
      statInfo: `<span className="text-dark me-2">${estadisticas.estadoLugaresRecomendados}</span> Activos`,
    },
  ];

  return (
    <Container>
      <Row>
        {ProjectsStatsData.map((item, index) => (
          <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
            <StatRightTopIcon info={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProjectStats;
