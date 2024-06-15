import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Component, useState } from "react";

import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../../layouts/DefaultDashboardLayout";

const RegistroPrompt = () => {
    const router = useRouter()

    const [descripcion, setDescripcion] = useState('')
    const [tipo, setTipo] = useState('Lugares')
    const [nombre, setNombre] = useState('')
    const [error, setError] = useState('')


    const puedeEnviarForm = () => {
        if (nombre.length === 0 || tipo.length === 0 || descripcion.length === 0) {
            setError('Revisar los campos del formulario e intentar de nuevo ')
            return false
        } else {
            return true
        }
    }

    const handleForm = async (event) => {
        event.preventDefault()
        if (puedeEnviarForm()) {
            const response = await createPrompt()
            if (!response) {
                return console.log(response)
            } else {
                console.log(response)
                return router.push("/pages/prompts/prompts")
            }
        }
    }

    const createPrompt = async () => {
        const newPrompt = {
            nombre: nombre,
            descripcion: descripcion,
            estado: "Activo",
            tipo: tipo
        };

        try {
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPrompt)
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
                                <h3 className="mb-4">Registro Prompt</h3>
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
                                    <Form.Control type="text" name="descripcion" placeholder="Ingrese una descripción del Prompt"
                                        onChange={(e) => setDescripcion(e.target.value)}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="tipo">
                                    <Form.Label>Tipo Prompt</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={tipo}
                                        onChange={e => setTipo(e.target.value)}
                                    >
                                        <option value="Lugares">Lugares</option>
                                        <option value="Restaurantes">Restaurantes</option>
                                    </Form.Control>
                                </Form.Group>


                                <div>
                                    {/* Button */}
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit">Crear Prompt</Button>
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

export default RegistroPrompt;
