// import node module libraries
import React from "react";
import { Card, Table, Button, Image, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ListaUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    getUsers();
  }, []);

  const redirect = (correo) => {
    const prop = { correo: correo };
    router.push({
      pathname: "/pages/perfilUsuario",
      query: prop,
    });
  };

  const getUsers = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const filteredUsers = data.filter((user) => {
        const { nombre, telefono, estado, correoElectronico } = user;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
          nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          telefono.includes(searchTerm) ||
          estado.toLowerCase().includes(lowerCaseSearchTerm) ||
          correoElectronico.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
      setUsers(filteredUsers);
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
    }
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-white py-4 d-flex">
        <h4 className="mb-0 me-auto">Usuarios</h4>
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
          {users.map((user) => {
            const { nombre, telefono, estado, correoElectronico } = user;
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
              <tr key={user.reference}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <div>
                      <Image
                        src={
                          user.fotoPerfil ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt=""
                        className="avatar-md avatar rounded-circle"
                      />
                    </div>
                    <div className="ms-3 lh-1">
                      <h5 className=" mb-1">{user.nombre}</h5>
                      <p className="mb-0">{user.correoElectronico}</p>
                    </div>
                  </div>
                </td>
                <td className="align-middle">
                  {user.telefono && user.telefono.trim() !== "null"
                    ? `+506 ${user.telefono}`
                    : "N/A"}
                </td>
                <td className="align-middle">{user.estado}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    className="me-1 mb-2"
                    onClick={() => redirect(user.correoElectronico)}
                  >
                    Ver Perfil
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

export default ListaUsuarios;
