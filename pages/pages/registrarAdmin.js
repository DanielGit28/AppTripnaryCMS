// import node module libraries
import { Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";


// import widget as custom components

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";


// import sub components

const RegistrarAdmin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        if (user == null) router.push("/")
    }, [user])


    const onSubmit = async (data) => {
        setIsLoading(true);
        const { email, password } = data;
        const userExist = await validarUser();
        if (!userExist) {
            const { result, error } = await signUp(email, password);
            setError(null)
            if (error) {
                console.log(error);
                setIsLoading(false);
            } else {
                await createAdmin();
                await sendEmail();
                console.log(result);
                router.push("/pages/administradores");
            }
        } else {
            setError("El administrador ya existe");
            setIsLoading(false);
        }




    };

    const sendEmail = async () => {
        const msg = {
            email: email,
            name: nombre,
            password: password
        };

        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msg)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
        } catch (error) {
            console.error('There was a problem creating the task:', error.message);
        }
    };

    const createAdmin = async () => {
        const newAdmin = {
            nombre: nombre,
            correoElectronico: email,
            estado: "Activo",
            fechaNacimiento: "No disponible",
            fotoPerfil: "https://i.pinimg.com/474x/e9/4a/d1/e94ad1c7a1fb16b9ce2b15f94ff4764b.jpg",
            idInteresesGenerales: "",
            latitudDireccion: "",
            longitudDireccion: "",
            telefono: telefono,
            contrasennia: ""
        };

        try {
            const response = await fetch('/api/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAdmin)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
        } catch (error) {
            console.error('There was a problem creating the task:', error.message);
        }
    };

    const validarUser = async () => {
        try {
            const response = await fetch(`/api/user?correoElectronico=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('There was a problem fetching the data:', error.message);
            return null; // Retorna null en caso de error
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
                    {/* Card */}
                    <Card className="smooth-shadow-md">
                        {/* Card body */}
                        <Card.Body className="p-6">

                            <div className="mb-4">
                                <h3 className="mb-4">Registrar Administrador</h3>

                                <p className="mb-6">Por favor ingrese su información.</p>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                {/* Username */}

                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Nombre completo</Form.Label>
                                    <Form.Control type="text" placeholder='Ingrese el nombre'
                                        {...register("username", { required: true })}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className={errors.username ? "form-control is-invalid" : "form-control"} />
                                    {errors.username && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                {/* Email */}
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control type="email" name='email' placeholder='Ingrese el correo electrónico'
                                        {...register("email", { required: true })}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={errors.email ? "form-control is-invalid" : "form-control"} />
                                    {errors.email && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                {/* Password */}
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" name='password' placeholder='**************'
                                        {...register("password", { required: true })}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={errors.password ? "form-control is-invalid" : "form-control"} />
                                    {errors.password && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                {/* Confirm Password */}
                                <Form.Group className="mb-3" controlId="confirm-password">
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control type="password" name='confirm-password' placeholder='**************'
                                        {...register("confirmPassword", { required: true })}
                                        className={errors.password ? "form-control is-invalid" : "form-control"}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">Este campo es requerido.</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="telefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="telefono"
                                        placeholder="Teléfono"
                                        {...register("telefono", { required: true })}
                                        className={errors.telefono ? "form-control is-invalid" : "form-control"}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                    {errors.telefono && (
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
                                                'Crear cuenta'
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

export default RegistrarAdmin;
