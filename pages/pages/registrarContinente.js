// import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";

// import widget as custom components

import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";


// import sub components

const RegistroContinente = () => {
    const router = useRouter()

    const [descripcion, setDescripcion] = useState('')
    const [codigo, setCodigo] = useState('')
    const [nombre, setNombre] = useState('')
    const [error, setError] = useState('')


    const puedeEnviarForm = () => {
        if (nombre.length === 0 || codigo.length === 0 || descripcion.length === 0) {
            setError('Revisar los campos del formulario e intentar de nuevo ')
            return false
        } else {
            return true
        }
    }

    const handleForm = async (event) => {
        event.preventDefault()
        if (puedeEnviarForm()) {
            const response = await createContinente()
            if (!response) {
                return console.log(response)
            } else {
                console.log(response)
                return router.push("/pages/continentes")
            }
        }
    }

    const createContinente = async () => {
        const newContinente = {
            nombre: nombre,
            descripcion: descripcion,
            estado: "Activo",
            codigoContinente: codigo
        };

        try {
            const response = await fetch('/api/continentes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newContinente)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data);
            } else {
                return data
            }
        } catch (error) {
            setError(error.message)
        }
    };

    const Layout =
        Component.Layout ||
        (router.pathname && router.pathname.includes("dashboard")
            ? router.pathname.includes("instructor") ||
                router.pathname.includes("student")
                ? DefaultDashboardLayout
                : DefaultDashboardLayout
            : DefaultDashboardLayout);

    return (
        <Layout>

            <Row className="align-items-center justify-content-center g-0 min-vh-100">
                <Col xxl={8} lg={12} md={14} xs={20} className="py-8 py-xl-0">
                    <Card className="smooth-shadow-md">
                        <Card.Body className="p-6">

                            <div className="mb-4">
                                {error && (
                                    <Alert variant="danger">
                                        {error}
                                    </Alert>
                                )}
                                <h3 className="mb-4">Registro Continente</h3>
                            </div>
                            <Form onSubmit={handleForm}>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" name="nombre" placeholder="Nombre"
                                        onChange={(e) => setNombre(e.target.value)}
                                    />

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="descripcion">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control type="text" name="descripcion" placeholder="Ingrese una descripción del continente" 
                                        onChange={(e) => setDescripcion(e.target.value)}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="descripcion">
                                    <Form.Label>Código continente</Form.Label>
                                    <Form.Control type="text" name="continente" placeholder="EU" maxLength={2}
                                        onChange={(e) => setCodigo(e.target.value)}

                                    />
                                </Form.Group>


                                <div>
                                    {/* Button */}
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit">Crear continente</Button>
                                    </div>

                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default RegistroContinente;
