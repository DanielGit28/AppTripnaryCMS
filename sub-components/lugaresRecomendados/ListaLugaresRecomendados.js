// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Form, Modal } from "react-bootstrap";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";

const ListaLugaresRecomendados = () => {
  const [lugares, setLugares] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  useEffect(() => {
    getLugares();
  }, []);

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/perfilLugar",
      query: prop,
    });
  };

  const redirectToCrearLugares = () => {
    router.push('/pages/registrarLugar');
  };


  const handleEliminar = (reference) => {
    handleShow();
    eliminarLugares(reference);
  }

  const eliminarLugares = async (reference) => {
    setShow(false);
    try {
      const response = await fetch(`/api/lugares?reference=${reference}`, {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      } else {
        
        await getLugares();
      }
    } catch (error) {
      setError(error.message)
    }
  }



  const getLugares = async () => {
    try {
      const response = await fetch("/api/lugares", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();


      setLugares(data);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  const styleBuscador = {
    marginRight: "2%",
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Lugares</h4>
        <Form style={styleBuscador} className="d-flex">
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <Button variant="primary" onClick={redirectToCrearLugares}>Crear Lugar</Button>
      </Card.Header>
      <Table responsive className="text-nowrap">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Código Postal</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lugares.map((lugar) => {
            const { nombre, idCiudad, codigoPostal, estado } = lugar;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (
              !nombre.toLowerCase().includes(lowerCaseSearchTerm) &&
              !idCiudad.includes(searchTerm) &&
              !codigoPostal.toLowerCase().includes(lowerCaseSearchTerm) &&
              !estado.toLowerCase().includes(lowerCaseSearchTerm)
            ) {
              return null;
            }

            return (
              <tr key={lugar.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={lugar.imagen}
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                    <div className="ms-3 lh-1">
                      <h5 className=" mb-1">{lugar.nombre}</h5>
                    </div>
                  </div>
                </td>
                <td className="align-middle"> {lugar.idCiudad}</td>
                <td className="align-middle">{lugar.codigoPostal}</td>
                <td className="align-middle">{lugar.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(lugar.reference)}
                  >
                    Ver Lugar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="me-1 mb-2"
                    onClick={() => handleEliminar(lugar.reference)}

                  >
                    Eliminar 
                  </Button>
                  <Modal show={show} onHide={handleClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0)', boxShadow: 'none' }}>
                    <Modal.Header closeButton>
                      <Modal.Title>Eliminar Lugar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      ¿Estás seguro que deseas eliminar un lugar?
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

export default ListaLugaresRecomendados;
