import React from "react";
import { Card, Table, Button, Image, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";
const ListaReportesCantidadViajes = () => {
  const [reportes, setReportes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    getReportes();
  }, []);

  const getReportes = async () => {
    try {
      const response = await fetch("/api/planesViajes", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const filteredReportes = data.filter((reporte) => {
        const { nombre, fechaInicio, fechaFin, idPais, imagenPortada } =
          reporte;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
          nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          fechaInicio.toLowerCase().includes(lowerCaseSearchTerm) ||
          fechaFin.toLowerCase().includes(lowerCaseSearchTerm) ||
          idPais.toLowerCase().includes(lowerCaseSearchTerm) ||
          idUsuario.toLowerCase().includes(lowerCaseSearchTerm) ||
          imagenPortada.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });

      setReportes(filteredReportes);
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

    const tableRows = [];

    reportes.forEach((reporte) => {
      const ticketData = [
        reporte.nombre,
        reporte.fechaInicio,
        reporte.fechaFin,
        reporte.idPais,
      ];
      tableRows.push(ticketData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 25 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Cantidad de viajes planificados en la aplicación", 14, 20);
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
    doc.save(`report_Cantidad_Viajes_${dateStr}.pdf`);
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Viajes Planificados</h4>
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
          {reportes.map((reporte) => {
            const { nombre, fechaInicio, fechaFin, idPais } = reporte;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !nombre.toLowerCase().includes(lowerCaseSearchTerm) &&
              !fechaInicio.toLowerCase().includes(lowerCaseSearchTerm) &&
              !fechaFin.toLowerCase().includes(lowerCaseSearchTerm) &&
              !idPais.toLowerCase().includes(lowerCaseSearchTerm)
            ) {
              return null;
            }
            return (
              <tr key={reporte.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={
                          reporte.imagenPortada ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                  </div>
                </td>
                <td className="align-middle"> {reporte.nombre}</td>
                <td className="align-middle"> {reporte.fechaInicio}</td>
                <td className="align-middle"> {reporte.fechaFin}</td>
                <td className="align-middle"> {reporte.idPais}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};
export default ListaReportesCantidadViajes;
