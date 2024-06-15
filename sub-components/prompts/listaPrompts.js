// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState('')
  const router = useRouter();
  useEffect(() => {
    getPrompts();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/prompts/perfilPrompt",
      query: prop,
    });
  };

  const redirectToCrearPrompt = () => {
    router.push('/pages/prompts/registrarPrompt');
  };

  const actualizarPrompts = (id) => {
    setPrompts(prompts.filter((v) => v.reference !== id))
  }

  const eliminarprompt = async (id) => {
    try {
      const response = await fetch(`/api/prompts?reference=${id}`, {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      } else {
        actualizarPrompts(id)
        return data
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const getPrompts = async () => {
    try {
      const response = await fetch("/api/prompts", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPrompts(data);
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
        <h4 className="mb-0 me-auto">Prompts</h4>
        <Button variant="primary" onClick={redirectToCrearPrompt} className="ms-auto">Crear prompt</Button>
      </Card.Header>
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => {
            return (
              <tr key={prompt.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div className="ms-3 lh-1">
                      <h5 className=" mb-1">{prompt.nombre}</h5>
                    </div>
                  </div>
                </td>
                <td className="align-middle">{prompt.estado}</td>
                <td className="align-middle">{prompt.tipo}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(prompt.reference)}
                  >
                    Ver prompt
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="me-1 mb-2"
                    onClick={() => eliminarprompt(prompt.reference)}
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

export default ListaPrompts;
