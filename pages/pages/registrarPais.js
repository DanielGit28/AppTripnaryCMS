import { Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";
import Alert from 'react-bootstrap/Alert';

const RegistrarPais = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const router = useRouter()
    const [codigoPais, setCodigoPais] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [nombre, setNombre] = useState('')
    const [estado, setEstado] = useState('')
    const [idContinente, setIdContinente] = useState('')
    const [imagen, setImagen] = useState('')
    const [latitud, setLatitud] = useState('')
    const [longitud, setLongitud] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [continentes, setContinentes] = useState([])
    const [ seleccioneContinenteDisabled, setSeleccioneContinenteDisabled ] = useState(false)


    useEffect(() => {
        getContinentes();
        if (user == null) router.push("/")
    }, [user])

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


    const onSubmit = async (data) => {
        try{
            setIsLoading(true);
            data.originalFileName = data.imagen[0].name;
            data.estado = "Activo";

            var reader = new FileReader();
            reader.readAsDataURL(data.imagen[0])
            reader.onload = async function () {
                data.imagen = reader.result

                const response = await fetch('/api/paises', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
        
                setIsLoading(false);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }else{
                    router.push("/pages/paises");
                }
            };
        }catch(error){
            setError(error.message)
        }
    }

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
                    {/* Card */}
                    <Card className="smooth-shadow-md">
                        {/* Card body */}
                        <Card.Body className="p-6">

                            <div className="mb-4">
                                <h3 className="mb-4">Registrar País</h3>

                                <p className="mb-6">Por favor ingrese la información solicitada.</p>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <Form onSubmit={handleSubmit(onSubmit)}>

                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese el nombre'
                                        {...register("nombre", { required: true })}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className={errors.nombre ? "form-control is-invalid" : "form-control"} />
                                    {errors.nombre && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="codigoPais">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese el código del país'
                                        {...register("codigoPais", { required: true })}
                                        onChange={(e) => setCodigoPais(e.target.value)}
                                        className={errors.codigoPais ? "form-control is-invalid" : "form-control"} />
                                    {errors.codigoPais && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="idContinente">
                                    <Form.Label>Continente</Form.Label>
                                    <Form.Select aria-label="Continente" name='idContinente'
                                        {...register("idContinente", { required: true })}
                                        onChange={(e) => setIdContinente(e.target.value)}
                                        onClick={(e) => setSeleccioneContinenteDisabled(true)}
                                        className={errors.idContinente ? "form-control is-invalid" : "form-control"}>
                                        <option value="" disabled={seleccioneContinenteDisabled}>Seleccione un continente</option>
                                        {
                                            continentes.map(continente => <option key={continente.codigoContinente} value={continente.codigoContinente}>{continente.nombre}</option>)

                                        }
                                    </Form.Select>
                                    {errors.idContinente && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="latitud">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese la latitud'
                                        {...register("latitud", { required: true })}
                                        onChange={(e) => setLatitud(e.target.value)}
                                        className={errors.latitud ? "form-control is-invalid" : "form-control"} />
                                    {errors.latitud && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>
                                
                                
                                <Form.Group className="mb-3" controlId="longitud">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese la longitud'
                                        {...register("longitud", { required: true })}
                                        onChange={(e) => setLongitud(e.target.value)}
                                        className={errors.longitud ? "form-control is-invalid" : "form-control"} />
                                    {errors.longitud && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="descripcion">
                                    <Form.Label>Descripcion</Form.Label>
                                    <Form.Control as="textarea" name='descripcion' rows={3} placeholder='Ingrese una breve descripción'
                                        {...register("descripcion", { required: true })}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        className={errors.descripcion ? "form-control is-invalid" : "form-control"} />
                                    {errors.descripcion && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="imagen">
                                    <Form.Label>Imagen</Form.Label>
                                    <Form.Control type="file" placeholder='Seleccione una imagen'
                                        {...register("imagen", { required: true })}
                                        onChange={(e) => setImagen(e.target.value)}
                                        className={errors.imagen ? "form-control is-invalid" : "form-control"} />
                                    {errors.imagen && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <div>
                                    {/* Button */}
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" disabled={isLoading}>

                                            {isLoading ? (
                                                <div className="d-flex align-items-center">
                                                    <Spinner animation="border" size="sm" role="status" className="me-2" />
                                                    <span>Enviando...</span>
                                                </div>
                                            ) : (
                                                'Crear país'
                                            )}

                                        </Button>
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

export default RegistrarPais;
