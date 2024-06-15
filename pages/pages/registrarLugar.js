// import node module libraries
import { Row, Col, Card, Form, Button, Image, Spinner, Dropdown } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

// import widget as custom components

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';




// import sub components
import {
    DropdownSearch,

} from "sub-components";

const RegistrarLugar = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuthContext()
    const router = useRouter()
    const [nombre, setNombre] = useState('')
    const [puntuacion, setPuntuacion] = useState('')
    const [temporada, setTemporada] = useState('')
    const [categoriaViaje, setCategoriaViaje] = useState('')
    const [codigoPostal, setCodigoPostal] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [horaInicial, setHoraInicial] = useState('');
    const [horaFinal, setHoraFinal] = useState('');
    const [estado, setEstado] = useState('')
    const [imagen, setImagen] = useState('')
    const [idCiudad, setIdCiudad] = useState('')
    const [latitud, setLatitud] = useState('')
    const [longitud, setLongitud] = useState('')
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [cover, setCover] = useState('');
    const [imagenCover, setImagenCover] = useState('');
    const [horarios, setHorarios] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const storage = getStorage();

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        const url = await handleUpload(file);
        setImageUrl(url);
    };

    const handleCoverUpload = async (event) => {
        const file = event.target.files[0];

        const url = await handleUpload(file);
      
        setImagenCover(url);
    };

    const generateUniqueName = (originalName) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExtension = originalName.split('.').pop();
        return `${timestamp}_${randomString}.${fileExtension}`;
    };

    const handleUpload = async (file) => {

        const storageRef = ref(storage, `lugares/${generateUniqueName(file.name)}`);

        try {
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            return downloadUrl;

        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };


    const handleSelect = (selectedValue) => {

        setIdCiudad(selectedValue.value);
    };

    useEffect(() => {

        if (user == null) router.push("/")
    }, [user])

    useEffect(() => {
        getCiudades();
    }, []);

    const handleHoraInicialChange = (event) => {
        const value = event.target.value;
        setHoraInicial(value);
    };

    const handleHoraFinalChange = (event) => {
        const value = event.target.value;
        setHoraFinal(value);
    };



    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            const imagenFile = data.imagen[0];

            setImagen(imagenFile.name);


            await createLugar();
        } catch (error) {
            setError(error.message);
        }
    };


    const getCiudades = async () => {
        try {
            const response = await fetch("/api/ciudades", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            const convertedOptions = data.map((ciudad) => ({
                value: ciudad.codigoCiudad,
                label: ciudad.nombre,
            }));

            setOptions(convertedOptions);


        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };

    const createLugar = async () => {
        const newLugar = {
            nombre: nombre,
            estado: estado,
            puntuacion: puntuacion,
            longitud: longitud,
            latitud: latitud,
            imagen: imageUrl,
            idCiudad: idCiudad,
            horaInicial: horaInicial,
            horaFinal: horaFinal,
            descripcion: descripcion,
            codigoPostal: codigoPostal,
            categoriaViaje: categoriaViaje,
            temporada: temporada,
            url: "",
            imagenCover: imagenCover,
        };


        try {
            const response = await fetch('/api/lugares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLugar)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            await createDocumento(data.reference);

        } catch (error) {
            console.error('There was a problem creating the task:', error.message);
        }
    };


    const createDocumento = async (idLugar) => {
        const newDocumento = {
            nombre: "Cover " + nombre,
            estado: "Activo",
            idLugarPlan: "",
            idPlanViaje: "",
            idLugar: idLugar,
            url: cover,
        };


        try {
            const response = await fetch('/api/documentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDocumento)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            router.push("/pages/lugares");
        } catch (error) {
            console.error('There was a problem creating the task:', error.message);
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
                                <h3 className="mb-4">Registrar Lugar</h3>

                                <p className="mb-6">Por favor ingrese su información.</p>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <div style={{ height: '600px', overflowY: 'auto' }}>
                                <Form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Username */}

                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" placeholder='Ingrese el nombre'
                                            {...register("nombre", { required: true })}
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            className={errors.nombre ? "form-control is-invalid" : "form-control"} />
                                        {errors.nombre && (
                                            <div className="invalid-feedback">Este campo es requerido.</div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="descripcion">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Ingrese la descripción"
                                            value={descripcion}
                                            {...register("descripcion", { required: true })}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className={errors.descripcion ? "form-control is-invalid" : "form-control"}
                                        />
                                        {errors.descripcion && (
                                            <div className="invalid-feedback">Este campo es requerido.</div>
                                        )}
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="codigoPostal">
                                                <Form.Label>Código Postal</Form.Label>
                                                <Form.Control type="text" placeholder='00000'
                                                    {...register("codigoPostal", { required: true })}
                                                    value={codigoPostal}
                                                    onChange={(e) => setCodigoPostal(e.target.value)}
                                                    className={errors.codigoPostal ? "form-control is-invalid" : "form-control"} />
                                                {errors.codigoPostal && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <DropdownSearch
                                                options={options}
                                                onSelect={handleSelect}
                                                register={register}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {/* Hora Inicial */}
                                            <Form.Group className="mb-3" controlId="horaInicial">
                                                <Form.Label>Hora Inicial</Form.Label>
                                                <Form.Control type="time" placeholder='00:00'
                                                    {...register("horaInicial", { required: true })}
                                                    value={horaInicial}
                                                    onChange={handleHoraInicialChange}
                                                    className={errors.horaInicial ? "form-control is-invalid" : "form-control"} />
                                                {errors.horaInicial && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Hora Final */}
                                            <Form.Group className="mb-3" controlId="horaFinal">
                                                <Form.Label>Hora Final</Form.Label>
                                                <Form.Control type="time" placeholder='00:00'
                                                    {...register("horaFinal", { required: true })}
                                                    value={horaFinal}
                                                    onChange={handleHoraFinalChange}
                                                    className={errors.horaFinal ? "form-control is-invalid" : "form-control"} />
                                                {errors.horaFinal && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="categoriaViaje">
                                                <Form.Label>Categoría del lugar</Form.Label>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id="dropdown-categoriaViaje" className="w-100" style={{ backgroundColor: 'transparent', borderColor: '#c4cdd5', color: '#898E94' }}>
                                                        {categoriaViaje ? categoriaViaje : 'Seleccionar categoría'}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="w-100">
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Histórico')}>Histórico</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Bosque')}>Bosque</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Aventura')}>Aventura</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Natural')}>Natural</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Religioso')}>Religioso</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Ciudad')}>Ciudad</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Arqueológico')}>Arqueológico</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Emblemático')}>Emblemático</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Museo')}>Museo</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Parque nacional')}>Parque nacional</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Sagrado')}>Sagrado</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Jardín')}>Jardín</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Industrial')}>Industrial</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Literario')}>Literario</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Cinematográfico')}>Cinematográfico</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Gastronómico')}>Gastronómico</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Monumento')}>Monumento</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Científico')}>Científico</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Entretenimiento')}>Entretenimiento</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setCategoriaViaje('Arquitectura')}>Arquitectura</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {errors.categoriaViaje && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>

                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="temporada">
                                                <Form.Label>Temporada</Form.Label>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id="dropdown-temporada" className="w-100" style={{ backgroundColor: 'transparent', borderColor: '#c4cdd5', color: '#898E94' }}>
                                                        {temporada ? temporada : 'Seleccionar la temporada'}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="w-100">
                                                        <Dropdown.Item onClick={() => setTemporada('Primavera')}>Primavera</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setTemporada('Verano')}>Verano</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setTemporada('Otoño')}>Otoño</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setTemporada('Invierno')}>Invierno</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {errors.temporada && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>

                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="puntuacion">
                                                <Form.Label>Puntuación</Form.Label>
                                                <Form.Control type="text" placeholder='4.5'
                                                    {...register("puntuacion", { required: true })}
                                                    value={puntuacion}
                                                    onChange={(e) => setPuntuacion(e.target.value)}
                                                    className={errors.puntuacion ? "form-control is-invalid" : "form-control"} />
                                                {errors.puntuacion && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="estado">
                                                <Form.Label>Estado</Form.Label>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id="dropdown-estado" className="w-100" style={{ backgroundColor: 'transparent', borderColor: '#c4cdd5', color: '#898E94' }}>
                                                        {estado ? estado : 'Seleccionar el estado'}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="w-100">
                                                        <Dropdown.Item onClick={() => setEstado('Activo')}>Activo</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => setEstado('Inactivo')}>Inactivo</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {errors.estado && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="latitud">
                                                <Form.Label>Latitud</Form.Label>
                                                <Form.Control type="text" placeholder='00000'
                                                    {...register("latitud", { required: true })}
                                                    value={latitud}
                                                    onChange={(e) => setLatitud(e.target.value)}
                                                    className={errors.latitud ? "form-control is-invalid" : "form-control"} />
                                                {errors.latitud && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="longitud">
                                                <Form.Label>Longitud</Form.Label>
                                                <Form.Control type="text" placeholder='00000'
                                                    {...register("longitud", { required: true })}
                                                    value={longitud}
                                                    onChange={(e) => setLongitud(e.target.value)}
                                                    className={errors.longitud ? "form-control is-invalid" : "form-control"} />
                                                {errors.longitud && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>

                                            <Form.Group className="mb-3" controlId="imagen">
                                                <Form.Label>Imagen</Form.Label>
                                                <Form.Control type="file" placeholder='Seleccione una imagen'
                                                    {...register("imagen", { required: true })}
                                                    onChange={handleImageUpload}
                                                    className={errors.imagen ? "form-control is-invalid" : "form-control"} />
                                                {errors.imagen && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="cover">
                                                <Form.Label>Portada</Form.Label>
                                                <Form.Control type="file" placeholder='Seleccione una imagen'
                                                    {...register("cover", { required: true })}
                                                    onChange={handleCoverUpload}
                                                    className={errors.cover ? "form-control is-invalid" : "form-control"} />
                                                {errors.cover && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>

                                        </Col>
                                    </Row>

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
                                                    'Crear Lugar'
                                                )}

                                            </Button>
                                        </div>

                                    </div>

                                </Form>

                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default RegistrarLugar;
