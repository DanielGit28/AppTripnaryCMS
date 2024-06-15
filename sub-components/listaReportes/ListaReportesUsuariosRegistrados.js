import React from "react";
import { Card, Table, Button, Image, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";
const ListaReportesUsuariosRegistrados = () => {
  const [reportes, setReportes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    getReportes();
  }, []);

  const getReportes = async () => {
    try {
      const response = await fetch("/api/reportes?tipo=Usuarios", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const filteredReportes = data.filter((reporte) => {
        const { nombre, telefono, estado, fechaNacimiento, correoElectronico } =
          reporte;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
          nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          telefono.includes(searchTerm) ||
          estado.toLowerCase().includes(lowerCaseSearchTerm) ||
          fechaNacimiento.toLowerCase().includes(lowerCaseSearchTerm) ||
          correoElectronico.toLowerCase().includes(lowerCaseSearchTerm)
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
      "Correo Electrónico",
      "Teléfono",
      "Fecha de Nacimiento",
      "Estado",
    ];

    const tableRows = [];

    reportes.forEach((reporte) => {
      const ticketData = [
        reporte.nombre,
        reporte.correoElectronico,
        reporte.telefono && reporte.telefono.trim() !== "null"
          ? `+506 ${reporte.telefono}`
          : "N/A",
        reporte.fechaNacimiento || "N/A",
        reporte.estado,
      ];
      tableRows.push(ticketData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 25 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Cantidad de usuarios registrados en la aplicación", 14, 20);
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
    doc.save(`report_Usuarios_Registrados_${dateStr}.pdf`);
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Usuarios Registrados</h4>
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
            <th>Teléfono</th>
            <th>Fecha de Nacimiento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => {
            const { nombre, telefono, estado, correoElectronico } = reporte;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !nombre.toLowerCase().includes(lowerCaseSearchTerm) &&
              !telefono.includes(searchTerm) &&
              !estado.toLowerCase().includes(lowerCaseSearchTerm) &&
              !correoElectronico.toLowerCase().includes(lowerCaseSearchTerm)
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
                          reporte.fotoPerfil ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                  </div>
                </td>
                <td className="align-middle">
                  <div className="ms-3 lh-1">
                    <h5 className=" mb-1">{reporte.nombre}</h5>
                    <p className="mb-0">{reporte.correoElectronico}</p>
                  </div>
                </td>
                <td className="align-middle">
                  {reporte.telefono && reporte.telefono.trim() !== "null"
                    ? `+506 ${reporte.telefono}`
                    : "N/A"}
                </td>
                <td className="align-middle">
                  {reporte.fechaNacimiento &&
                  reporte.fechaNacimiento.trim() !== "null"
                    ? reporte.fechaNacimiento
                    : "N/A"}
                </td>
                <td className="align-middle">{reporte.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};
export default ListaReportesUsuariosRegistrados;
