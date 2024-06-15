// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaContinentes = () => {
  const [continentes, setContinentes] = useState([]);
  const [error, setError] = useState('')
  const router = useRouter();
  useEffect(() => {
    getContinentes();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/perfilContinente",
      query: prop,
    });
  };

  const redirectToCrearContinente = () => {
    router.push('/pages/registrarContinente');
  };

  const actualizarContinentes = (id) => {
    setContinentes(continentes.filter((v) => v.reference !== id))
  }

  const eliminarContinente = async (id) => {
    try {
      const response = await fetch(`/api/continentes?reference=${id}`, {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      } else {
        actualizarContinentes(id)
        return data
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const getContinentes = async () => {
    try {
      const response = await fetch("/api/continentes", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setContinentes(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  return (
    <Card className="h-100">
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Continentes</h4>
        <Button variant="primary" onClick={redirectToCrearContinente} className="ms-auto">Crear Continente</Button>
      </Card.Header>
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {continentes.map((continente) => {
            return (
              <tr key={continente.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div className="ms-3 lh-1">
                      <h5 className=" mb-1">{continente.nombre}</h5>
                      <p className="mb-0">{continente.codigoContinente}</p>
                    </div>
                  </div>
                </td>
                
                <td className="align-middle">{continente.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(continente.reference)}
                  >
                    Ver continente
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="me-1 mb-2"
                    onClick={() => eliminarContinente(continente.reference)}
                  >
                    Eliminar
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

export default ListaContinentes;
