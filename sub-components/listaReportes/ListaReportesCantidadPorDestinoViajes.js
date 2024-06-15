import React from "react";
import {
  Card,
  Table,
  Image,
  Form,
  Container,
  Button,
  Nav,
  Tab,
} from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaReportesCantidadPorDestinoViajes = () => {
  const [reportes, setReportes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    getReportes();
  }, []);

  const getReportes = async () => {
    try {
      const response = await fetch("/api/reportes?tipo=Destinos", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const filteredReportes = data.filter((reporte) => {
        const { idPais } = reporte;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return idPais.toLowerCase().includes(lowerCaseSearchTerm);
      });

      setReportes(filteredReportes);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };
  const getPaises = async () => {
    try {
      const response = await fetch("/api/paises", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setPaises(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Nombre",
      "Fecha de Inicio",
      "Fecha de Finalización",
      "País",
    ];
    let startY = 10;

    reportes.forEach((reporte) => {
      const tableRows = [];
      reporte.planes.forEach((plan) => {
        const ticketData = [
          plan.nombre,
          plan.fechaInicio,
          plan.fechaFin,
          plan.idPais,
        ];
        tableRows.push(ticketData);
      });
      const titleHeight = 5;
      const tableHeight = tableRows.length * 10;
      const startYWithSpacing = startY + titleHeight + 10;

      doc.text(
        "Cantidad de viajes planificados en: " + reporte.idPais,
        14,
        startY + 10
      );
      doc.autoTable(tableColumn, tableRows, { startY: startYWithSpacing });
      startY += titleHeight + tableHeight + 15;
    });

    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text(
      "Reporte del día " +
        date[2] +
        "/" +
        date[1] +
        "/" +
        date[3] +
        " a las " +
        date[4],
      14,
      10
    );
    doc.save(`report_Cantidad_Viajes_Destino_${dateStr}.pdf`);
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Cantidad de Viajes por Destino</h4>
        <Form className="d-flex me-auto">
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <Button
          variant="outline-secondary"
          className="d-flex"
          onClick={generatePDF}
        >
          Generar reporte
        </Button>
      </Card.Header>
      {reportes.map((reporte) => {
        const { idPais } = reporte;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (!idPais.toLowerCase().includes(lowerCaseSearchTerm)) {
          return null;
        }
        return (
          <>
            <Container fluid className="p-3">
              <Tab.Container defaultActiveKey="design">
                <Card className="mt-5">
                  <Card.Title className="mb-0 p-3 border-bottom">
                    <h4 className="mb-0"> {reporte.idPais}</h4>
                  </Card.Title>
                  <Card.Header className="border-bottom-0 p-0 ">
                    <Nav className="nav-lb-tab">
                      <Nav.Item>
                        <Nav.Link eventKey="design" className="mb-sm-3 mb-md-0">
                          Cantidad
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="react" className="mb-sm-3 mb-md-0">
                          Lugares
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Tab.Content>
                      <Tab.Pane eventKey="design" className="pb-4 p-4">
                        <h2>{reporte.count}</h2>
                        <h4>viajes están destinados para {reporte.idPais} </h4>
                      </Tab.Pane>
                      <Tab.Pane
                        eventKey="react"
                        className="pb-4 p-4 react-code"
                      >
                        <Table responsive className="text-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th></th>
                              <th>Nombre</th>
                              <th>Fecha de Inicio</th>
                              <th>Fecha de Finalización</th>
                              <th>País</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reporte.planes.map((plan) => {
                              return (
                                <tr key={plan.reference}>
                                  <td className="align-middle">
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <Image
                                          src={
                                            plan.imagenPortada ||
                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                          }
                                          alt=""
                                          className="avatar-md avatar rounded-circle"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="align-middle">
                                    {" "}
                                    {plan.nombre}
                                  </td>
                                  <td className="align-middle">
                                    {plan.fechaInicio}
                                  </td>
                                  <td className="align-middle">
                                    {plan.fechaFin}
                                  </td>
                                  <td className="align-middle">
                                    {" "}
                                    {plan.idPais}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Tab.Pane>
                    </Tab.Content>
                  </Card.Body>
                </Card>
              </Tab.Container>
            </Container>
          </>
        );
      })}
    </Card>
  );
};

export default ListaReportesCantidadPorDestinoViajes;
