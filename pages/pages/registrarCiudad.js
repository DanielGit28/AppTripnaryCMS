import { Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";
import Alert from 'react-bootstrap/Alert';

const RegistrarCiudad = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const router = useRouter()
    const [codigoCiudad, setCodigoCiudad] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [nombre, setNombre] = useState('')
    const [estado, setEstado] = useState('')
    const [idPais, setIdPais] = useState('')
    const [imagen, setImagen] = useState('')
    const [latitud, setLatitud] = useState('')
    const [longitud, setLongitud] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [paises, setPaiss] = useState([])
    const [ seleccionePaisDisabled, setSeleccionePaisDisabled ] = useState(false)


    useEffect(() => {
        getPaiss();
        if (user == null) router.push("/")
    }, [user])

    const getPaiss = async () => {
        try {
            const response = await fetch("/api/paises", {
            method: "GET",
            });

            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();

            setPaiss(data);
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

                const response = await fetch('/api/ciudades', {
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
                    router.push("/pages/ciudades");
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
                                <h3 className="mb-4">Registrar Ciudad</h3>

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

                                <Form.Group className="mb-3" controlId="codigoCiudad">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese el código de la ciudad'
                                        {...register("codigoCiudad", { required: true })}
                                        onChange={(e) => setCodigoCiudad(e.target.value)}
                                        className={errors.codigoCiudad ? "form-control is-invalid" : "form-control"} />
                                    {errors.codigoCiudad && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="idPais">
                                    <Form.Label>Pais</Form.Label>
                                    <Form.Select aria-label="Pais" name='idPais'
                                        {...register("idPais", { required: true })}
                                        onChange={(e) => setIdPais(e.target.value)}
                                        onClick={(e) => setSeleccionePaisDisabled(true)}
                                        className={errors.idPais ? "form-control is-invalid" : "form-control"}>
                                        <option value="" disabled={seleccionePaisDisabled}>Seleccione un pais</option>
                                        {
                                            paises.map(pais => <option key={pais.codigoPais} value={pais.codigoPais}>{pais.nombre}</option>)

                                        }
                                    </Form.Select>
                                    {errors.idPais && (
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
                                                'Crear ciudad'
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

export default RegistrarCiudad;
