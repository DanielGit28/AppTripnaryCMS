// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Col, Row, Container, Form, Modal } from "react-bootstrap";
import { Component, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaCiudades = () => {
  const [ciudades, setCiudades] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getCiudades();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/ciudad",
      query: prop,
    });
  };

  const redirectToCrearCiudad = () => {
    router.push('/pages/registrarCiudad');
  };

  const handleEliminar = (reference) => {
    handleShow();
    eliminarCiudad(reference);
  }

  const eliminarCiudad = async (reference) => {
    setShow(false);

    try {
      const response = await fetch(`/api/ciudades?reference=${reference}`, {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      } else {
        await getCiudades();
      }
    } catch (error) {
      setError(error.message)
    }
  }
  

  const getCiudades = async () => {
    try {
      const response = await fetch("/api/ciudades?ciudadPais=true", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log(data)

      setCiudades(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  const redirectToPais = (referencePais) => {
    router.push(`/pages/pais?reference=${referencePais}`);
  }

  const mystyle = {
    "marginLeft": "2%",
  };
  
  const pais = {
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
        <h4 className="mb-0 me-auto">Ciudades</h4>
        <Form style={styleBuscador} className="d-flex">
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <Button variant="primary" onClick={redirectToCrearCiudad}>Crear Ciudad</Button>
      </Card.Header>
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Pais</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ciudades.map((ciudad) => {
            const { nombre, codigoCiudad, nombrePais, estado } = ciudad;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !nombre.toLowerCase().includes(lowerCaseSearchTerm) &&
              !codigoCiudad.includes(searchTerm) &&
              !nombrePais.toLowerCase().includes(lowerCaseSearchTerm) &&
              !estado.toLowerCase().includes(lowerCaseSearchTerm)
            ) {
              return null;
            }

            return (
              <tr key={ciudad.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={ciudad.imagen}
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                    <td className="align-middle" style={mystyle}>{ciudad.nombre}</td>
                  </div>
                </td>
                <td className="align-middle">{ciudad.codigoCiudad}</td>
                <td className="align-middle" onClick={() => redirectToPais(ciudad.referencePais)}><a style={pais}>{ciudad.nombrePais}</a></td>
                <td className="align-middle">{ciudad.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(ciudad.reference)}
                  >
                    Ver Ciudad
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="me-1 mb-2"
                    onClick={() => handleEliminar(ciudad.reference)}

                  >
                    Eliminar
                  </Button>
                  <Modal show={show} onHide={handleClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0)', boxShadow: 'none' }}>
                    <Modal.Header closeButton>
                      <Modal.Title>Eliminar Ciudad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      ¿Está seguro que desea eliminar esta ciudad?
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

export default ListaCiudades;
