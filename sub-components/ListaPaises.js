// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Col, Row, Container, Form, Modal } from "react-bootstrap";
import { Component, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaPaises = () => {
  const [paises, setPaises] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    getPaises();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/pais",
      query: prop,
    });
  };

  const redirectToCrearPais = () => {
    router.push('/pages/registrarPais');
  };

  const handleEliminar = (reference) => {
    handleShow();
    eliminarPais(reference);
  }

  const eliminarPais = async (reference) => {
    setShow(false);

    try {
      const response = await fetch(`/api/paises?reference=${reference}`, {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      } else {
        await getPaises();
      }
    } catch (error) {
      setError(error.message)
    }
  }
  
  const redirectToContinente = (referenceContinente) => {
    router.push(`/pages/perfilContinente?reference=${referenceContinente}`);
  }

  const getPaises = async () => {
    try {
      const response = await fetch("/api/paises?paisContinente=true", {
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

  const mystyle = {
    "marginLeft": "2%",
  };

  const continente = {
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
        <h4 className="mb-0 me-auto">Paises</h4>
        <Form style={styleBuscador} className="d-flex mb-0">
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <Button variant="primary" onClick={redirectToCrearPais} className="">Crear País</Button>
      </Card.Header>
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Continente</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paises.map((pais) => {
            const { nombre, codigoPais, nombreContinente, estado } = pais;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !nombre.toLowerCase().includes(lowerCaseSearchTerm) &&
              !codigoPais.includes(searchTerm) &&
              !nombreContinente.toLowerCase().includes(lowerCaseSearchTerm) &&
              !estado.toLowerCase().includes(lowerCaseSearchTerm)
            ) {
              return null;
            }

            return (
              <tr key={pais.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={pais.imagen}
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                    <td className="align-middle" style={mystyle}>{pais.nombre}</td>
                  </div>
                </td>
                <td className="align-middle">{pais.codigoPais}</td>
                <td className="align-middle" onClick={() => redirectToContinente(pais.referenceContinente)}><a style={continente}>{pais.nombreContinente}</a></td>
                <td className="align-middle">{pais.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(pais.reference)}
                  >
                    Ver País
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="me-1 mb-2"
                    onClick={() => handleEliminar(pais.reference)}

                  >
                    Eliminar
                  </Button>
                  <Modal show={show} onHide={handleClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0)', boxShadow: 'none' }}>
                    <Modal.Header closeButton>
                      <Modal.Title>Eliminar País</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      ¿Está seguro que desea eliminar este país?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={handleClose}>
                        Cancelar
                      </Button>
                      <Button variant="danger">
                        Eliminar
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default ListaPaises;
