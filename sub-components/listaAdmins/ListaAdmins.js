// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    getAdmins();
  }, []);

  const redirect = (correo) => {
    const prop = { correo: correo };
    router.push({
      pathname: "/pages/perfilAdmin",
      query: prop,
    });
  };

  const redirectToCrearAdministrador = () => {
    router.push("/pages/registrarAdmin");
  };

  const getAdmins = async () => {
    try {
      const response = await fetch("/api/admin", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const filteredAdmins = data.filter((admin) => {
        const { nombre, telefono, estado, correoElectronico } = admin;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
          nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          telefono.includes(searchTerm) ||
          estado.toLowerCase().includes(lowerCaseSearchTerm) ||
          correoElectronico.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Administradores</h4>
        <Form className="d-flex">
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
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => {
            const { nombre, telefono, estado, correoElectronico } = admin;
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
              <tr key={admin.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={
                          admin.fotoPerfil ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                    <div className="ms-3 lh-1">
                      <h5 className=" mb-1">{admin.nombre}</h5>
                      <p className="mb-0">{admin.correoElectronico}</p>
                    </div>
                  </div>
                </td>
                <td className="align-middle">+506 {admin.telefono}</td>
                <td className="align-middle">{admin.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(admin.correoElectronico)}
                  >
                    Perfil
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

export default ListaAdmins;
