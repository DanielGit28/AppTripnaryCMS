import { Row, Col, Card, Form, Button, Image, Spinner, Link } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from 'react-hook-form';
import Alert from 'react-bootstrap/Alert';

const EditarPais = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const [imagen, setImagen] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshFlag, setRefreshFlag] = useState(false);
    const router = useRouter();
    const { reference } = router.query;
    const [ pais, setPais ] = useState([]);
    const [campos, setCampos] = useState()
    const [ continentes, setContinentes ] = useState([])

    const updateCampos = (campo, value) => {
        setCampos({
          ...campos,
          [campo]: value
        })
    }

    useEffect(() => {
        getPaisByReference();
        getContinentes();
      }, []);

    const getPaisByReference = async () => {
        try {
            const response = await fetch("/api/paises?reference=" + reference, {
            method: "GET",
            });

            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();
            data.reference = reference;
            setPais(data);
            setCampos(data);
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };

    const getContinentes = async () => {
        try {
            const response = await fetch("/api/continentes", {
            method: "GET",
            });

            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();
            data.reference = reference;
            setContinentes(data);
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };
    
    useEffect(() => {
        if (pais == null) router.push("/");
      }, [pais]);

    const handleForm = async (data) => {
        event.preventDefault()
        if(data.imagen.length > 0){
            campos.imagen = data.imagen[0]
        }
        await actualizarPais()
    }

    const actualizarPais = async () => {
        const data = campos;

        try{
            setIsLoading(true);
            data.reference = reference;
            data.estado = "Activo";
            
            if(data.imagen && data.imagen !== pais.imagen){
                data.originalFileName = data.imagen.name;
                var reader = new FileReader();
                reader.readAsDataURL(data.imagen)
                reader.onload = async function () {
                    data.imagen = reader.result

                    const response = await fetch('/api/paises', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }else{
                        router.push("/pages/paises");
                    }
                }

                setIsLoading(false);

                
            }else{
                const response = await fetch('/api/paises', {
                    method: 'PUT',
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
            }
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

    const imageStyle = {
        margin: "2% 0 3% 3%",
    }

    const rowStyle = {
        paddingTop: "3%",
    }

    return (
        <Layout>

            <Row style={rowStyle} className="align-items-center justify-content-center g-0 min-vh-100">

                <Col xxl={8} lg={12} md={14} xs={20} className="py-8 py-xl-0">
                    {/* Card */}
                    <Card className="smooth-shadow-md">
                        {/* Card body */}
                        <Card.Body className="p-6">

                            <div className="mb-4">
                                <h3 className="mb-4">Editar País</h3>

                                <p className="mb-6">Por favor ingrese la información solicitada.</p>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <Form onSubmit={handleSubmit(handleForm)}>

                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" value={campos?.nombre}
                                        {...register("nombre", { required: false })}
                                        onChange={(e) => updateCampos("nombre", e.target.value)}
                                        className={errors.nombre ? "form-control is-invalid" : "form-control"} />
                                    {errors.nombre && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="codigoPais">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type="text" value={campos?.codigoPais}
                                        {...register("codigoPais", { required: false })}
                                        onChange={(e) => updateCampos("codigoPais", e.target.value)}
                                        className={errors.codigoPais ? "form-control is-invalid" : "form-control"} />
                                    {errors.codigoPais && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="idContinente">
                                    <Form.Label>Continente</Form.Label>
                                    <Form.Select aria-label="Continente" name='idContinente' value={campos?.idContinente}
                                        {...register("idContinente", { required: false })}
                                        onChange={(e) => updateCampos("idContinente", e.target.value)}
                                        className={errors.idContinente ? "form-control is-invalid" : "form-control"}>
                                        <option value="" disabled>Seleccione un continente</option>
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
                                    <Form.Control type="text" value={campos?.latitud}
                                        {...register("latitud", { required: false })}
                                        onChange={(e) => updateCampos("latitud", e.target.value)}
                                        className={errors.latitud ? "form-control is-invalid" : "form-control"} />
                                    {errors.latitud && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>
                                
                                
                                <Form.Group className="mb-3" controlId="longitud">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control type="text" value={campos?.longitud}
                                        {...register("longitud", { required: false })}
                                        onChange={(e) => updateCampos("longitud", e.target.value)}
                                        className={errors.longitud ? "form-control is-invalid" : "form-control"} />
                                    {errors.longitud && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="descripcion">
                                    <Form.Label>Descripcion</Form.Label>
                                    <Form.Control as="textarea" name='descripcion' rows={3} value={campos?.descripcion}
                                        {...register("descripcion", { required: false })}
                                        onChange={(e) => updateCampos("descripcion", e.target.value)}
                                        className={errors.descripcion ? "form-control is-invalid" : "form-control"} />
                                    {errors.descripcion && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="imagen">
                                    <Form.Label>Imagen</Form.Label>
                                    
                                    <Image
                                        style={imageStyle}
                                        src={pais.imagen}
                                        className="avatar-xl rounded-circle border border-4 border-white-color-40"
                                        alt=""
                                    />
                                    
                                    <Form.Control type="file" placeholder='Seleccione una imagen'
                                        {...register("imagen", { required: false })}
                                        onChange={(e) => updateCampos("imagen", e.target.value)}
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
                                                'Actualizar país'
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

export default EditarPais;
