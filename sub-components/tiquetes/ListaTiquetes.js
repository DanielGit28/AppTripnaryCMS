// import node module libraries
import React from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaTiquetes = () => {
  const [tiquetes, setTiquetes] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    getTiquetes();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/tiquete",
      query: prop,
    });
  };

  const redirectToPerfilUsuario = (correo) => {
    const prop = { correo: correo };
    router.push({
      pathname: "/pages/perfilUsuario",
      query: prop,
    });
  };

  const getTiquetes = async () => {
    try {
      const response = await fetch("/api/tiquetes", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setTiquetes(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  const mystyle = {
    "marginLeft": "2%",
  };

  const correo = {
    "color": "#AF93EC",
    "cursor": "pointer",
    "textDecoration": "underline"
  };

  const styleBuscador = {
    marginRight: "2%",
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Tiquetes</h4>

        <Form style={styleBuscador} className="d-flex mb-0">
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </Card.Header>
      
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Correo De Usuario</th>
            <th>Categoría</th>
            <th>Nombre De Usuario</th>
            <th>Número De Referencia</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tiquetes.map((tiquete) => {
            const { categoria, nombreCompleto, estado, correoElectronico, reference } = tiquete;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !categoria.toLowerCase().includes(lowerCaseSearchTerm) &&
              !nombreCompleto.toLowerCase().includes(searchTerm) &&
              !estado.toLowerCase().includes(lowerCaseSearchTerm) &&
              !correoElectronico.toLowerCase().includes(lowerCaseSearchTerm) &&
              !reference.toLowerCase().includes(lowerCaseSearchTerm)
            ) {
              return null;
            }

            return (
              <tr key={tiquete.reference}>
                <td className="align-middle">
                    <td className="align-middle" style={mystyle}><a onClick={() => redirectToPerfilUsuario(tiquete.correoElectronico)} style={correo}>{tiquete.correoElectronico}</a></td>
                </td>
                <td className="align-middle">{tiquete.categoria}</td>
                <td className="align-middle">{tiquete.nombreCompleto}</td>
                <td className="align-middle">{tiquete.reference}</td>
                <td className="align-middle">{tiquete.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(tiquete.reference)}
                  >
                    Ver Tiquete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default ListaTiquetes;
