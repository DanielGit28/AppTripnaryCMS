import { Row, Col, Card, Form, Button, Image, Spinner, Link } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";

const EditarUsuarioActual = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshFlag, setRefreshFlag] = useState(false);
    const router = useRouter();
    const { reference } = router.query;
    const [ usuario, setUsuario ] = useState([]);
    const [campos, setCampos] = useState()

    const updateCampos = (campo, value) => {
        setCampos({
          ...campos,
          [campo]: value
        })
    }

    useEffect(() => {
        getUsuarioByReference();
      }, []);

    const getUsuarioByReference = async () => {
        try {
            const response = await fetch("/api/user?reference=" + reference, {
            method: "GET",
            });

            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();
            data.reference = reference;

            let fechaNacimiento = data.fechaNacimiento.split("/")

            data.fechaNacimiento = fechaNacimiento[2] + "-" + fechaNacimiento[1] + "-" + fechaNacimiento[0]

            setUsuario(data);
            setCampos(data);
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };
    
    useEffect(() => {
        if (usuario == null) router.push("/");
      }, [usuario]);

    const handleForm = async (data) => {
        event.preventDefault()
        if(data.fotoPerfil.length > 0){
            campos.fotoPerfil = data.fotoPerfil[0]
        }
        await actualizarUsuario()
    }

    const actualizarUsuario = async () => {
        const data = campos;

        try{
            setIsLoading(true);
            data.reference = reference;
            data.estado = "Activo";

            let fechaNacimiento = data.fechaNacimiento.split("-")
            data.fechaNacimiento = fechaNacimiento[2] + "/" + fechaNacimiento[1] + "/" + fechaNacimiento[0]

            if(data.fotoPerfil && data.fotoPerfil !== usuario.fotoPerfil){
                data.originalFileName = data.fotoPerfil.name;
                var reader = new FileReader();
                reader.readAsDataURL(data.fotoPerfil)
                reader.onload = async function () {
                    data.fotoPerfil = reader.result

                    const response = await fetch('/api/user', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                        query: {fecha: true}
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }else{
                        const prop = { correo: data.correoElectronico };
                        router.push({
                        pathname: "/pages/perfilUsuarioActual",
                        query: prop,
                        });
                    }
                }

                setIsLoading(false);

                
            }else{
                const response = await fetch('/api/user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    query: {fecha: true}
                });

                setIsLoading(false);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }else{
                    const prop = { correo: data.correoElectronico };
                        router.push({
                        pathname: "/pages/perfilUsuarioActual",
                        query: prop,
                    });
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
                                <h3 className="mb-4">Editar Perfil</h3>

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

                                <Form.Group className="mb-3" controlId="telefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="number" value={campos?.telefono}
                                        {...register("telefono", { required: false })}
                                        onChange={(e) => updateCampos("telefono", e.target.value)}
                                        className={errors.telefono ? "form-control is-invalid" : "form-control"} />
                                    {errors.idContinente && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="fechaNacimiento">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control type="date" value={campos?.fechaNacimiento}
                                        {...register("fechaNacimiento", { required: false })}
                                        onChange={(e) => updateCampos("fechaNacimiento", e.target.value)}
                                        className={errors.fechaNacimiento ? "form-control is-invalid" : "form-control"} />
                                    {errors.fechaNacimiento && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="latitudDireccion">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control type="text" value={campos?.latitudDireccion}
                                        {...register("latitudDireccion", { required: false })}
                                        onChange={(e) => updateCampos("latitudDireccion", e.target.value)}
                                        className={errors.latitudDireccion ? "form-control is-invalid" : "form-control"} />
                                    {errors.latitudDireccion && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>
                                
                                
                                <Form.Group className="mb-3" controlId="longitudDireccion">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control type="text" value={campos?.longitudDireccion}
                                        {...register("longitudDireccion", { required: false })}
                                        onChange={(e) => updateCampos("longitudDireccion", e.target.value)}
                                        className={errors.longitudDireccion ? "form-control is-invalid" : "form-control"} />
                                    {errors.longitudDireccion && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="fotoPerfil">
                                    <Form.Label>Foto de Perfil</Form.Label>
                                    
                                    <Image
                                        style={imageStyle}
                                        src={usuario.fotoPerfil}
                                        className="avatar-xl rounded-circle border border-4 border-white-color-40"
                                        alt=""
                                    />
                                    
                                    <Form.Control type="file" placeholder='Seleccione una imagen'
                                        {...register("fotoPerfil", { required: false })}
                                        onChange={(e) => updateCampos("fotoPerfil", e.target.value)}
                                        className={errors.fotoPerfil ? "form-control is-invalid" : "form-control"} />
                                    {errors.fotoPerfil && (
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
                                                'Actualizar Perfil'
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

export default EditarUsuarioActual;