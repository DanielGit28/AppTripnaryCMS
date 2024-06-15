// import node module libraries
import { Row, Col, Card, Form, Button, Image, Spinner, Dropdown } from 'react-bootstrap';
import { Component, useEffect, useState } from "react";
import signUp from "../../lib/createUserAuth";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

// import widget as custom components

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../layouts/DefaultDashboardLayout";
import { useForm } from "react-hook-form";

// import sub components
import {
    DropdownSearch,

} from "sub-components";

const ActualizarLugar = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
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
    const [imageUrl, setImageUrl] = useState('');
    const storage = getStorage();
    const [lugar, setLugar] = useState(null);
    const [selectedCiudad, setSelectedCiudad] = useState(null);
    const [campos, setCampos] = useState();
    const [imagenCover, setImagenCover] = useState('');



    const updateCampos = (campo, value) => {
        setCampos({
            ...campos,
            [campo]: value
        })
    }

    const { reference } = router.query;

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        const url = await handleUpload(file);
        campos.imagen = url;
    };

    const handleCoverUpload = async (event) => {
        const file = event.target.files[0];

        const url = await handleUpload(file);
        campos.imagenCover = url;
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

        campos.idCiudad = selectedValue.value
    };

    useEffect(() => {

        if (user == null) router.push("/")
    }, [user])

    useEffect(() => {
        const fetchData = async () => {
            await getCiudades();
            await getLugarByReference();
        };

        fetchData();
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

            await actualizarLugar();
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

    const getLugarByReference = async () => {
        try {
            const response = await fetch("/api/lugares?reference=" + reference, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCampos(data);
            setLugar(data);
            setCategoriaViaje(data.categoriaViaje);
            setTemporada(data.temporada);
            setEstado(data.estado);
            setImageUrl(data.imagen);
            setCover(data.imagenCover);

            await getCiudadByReference(data.idCiudad);

        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };

    const getCiudadByReference = async (ciudadReference) => {
        try {
            const response = await fetch("/api/ciudades?codigoCiudad=" + ciudadReference, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            setSelectedCiudad({ value: data[0].codigoCiudad, label: data[0].nombre });

        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };


    const actualizarLugar = async () => {
  
        const newLugar = {
            reference: reference,
            nombre: campos.nombre,
            estado: estado,
            puntuacion: campos.puntuacion,
            longitud: campos.longitud,
            latitud: campos.latitud,
            imagen: campos.imagen,
            idCiudad: campos.idCiudad,
            horaInicial: campos.horaInicial,
            horaFinal: campos.horaFinal,
            descripcion: campos.descripcion,
            codigoPostal: campos.codigoPostal,
            categoriaViaje: categoriaViaje,
            temporada: temporada,
            url: "",
            imagenCover: campos.imagenCover,
        };


        try {
            const response = await fetch('/api/lugares', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLugar)
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

    const imageStyle = {
        margin: "2% 0 3% 3%",
    }

    const rowStyle = {
        paddingTop: "3%",
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
                                <h3 className="mb-4">Actualizar Lugar</h3>

                                <p className="mb-6">Por favor actualice su información.</p>
                            </div>
                            {error && (
                                <div className="alert alert-danger mt-4" role="alert">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <div style={{ height: '600px', overflowY: 'auto' }}>
                                <Form onSubmit={handleSubmit(onSubmit)}>

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

                                    <Form.Group className="mb-3" controlId="descripcion">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={campos?.descripcion}
                                            {...register("descripcion", { required: false })}
                                            onChange={(e) => updateCampos("descripcion", e.target.value)}
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
                                                <Form.Control type="text" value={campos?.codigoPostal}
                                                    {...register("codigoPostal", { required: false })}
                                                    onChange={(e) => updateCampos("codigoPostal", e.target.value)}
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
                                                selectedCiudadOption={selectedCiudad}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {/* Hora Inicial */}

                                            <Form.Group className="mb-3" controlId="horaInicial">
                                                <Form.Label>Hora Inicial</Form.Label>
                                                <Form.Control type="time" value={campos?.horaInicial}
                                                    {...register("horaInicial", { required: false })}
                                                    onChange={(e) => updateCampos("horaInicial", e.target.value)}
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
                                                <Form.Control type="time" value={campos?.horaFinal}
                                                    {...register("horaFinal", { required: false })}
                                                    onChange={(e) => updateCampos("horaFinal", e.target.value)}
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
                                                <Form.Control type="text" value={campos?.puntuacion}
                                                    {...register("puntuacion", { required: false })}
                                                    onChange={(e) => updateCampos("puntuacion", e.target.value)}
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
                                                <Form.Control type="text" value={campos?.latitud}
                                                    {...register("latitud", { required: false })}
                                                    onChange={(e) => updateCampos("latitud", e.target.value)}
                                                    className={errors.latitud ? "form-control is-invalid" : "form-control"} />
                                                {errors.latitud && (
                                                    <div className="invalid-feedback">Este campo es requerido.</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
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
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Image
                                                style={imageStyle}
                                                src={imageUrl}
                                                className="avatar-xl rounded-circle border border-4 border-white-color-40"
                                                alt=""
                                            />

                                            <Form.Group className="mb-3" controlId="imagen">
                                                <Form.Label>Imagen</Form.Label>
                                                <Form.Control type="file" placeholder='Seleccione una imagen'
                                                    
                                                    onChange={handleImageUpload}
                                                    className={errors.imagen ? "form-control is-invalid" : "form-control"} />
                                               
                                            </Form.Group>
                                        </Col>
                                        <Col>

                                            <Image
                                                style={imageStyle}
                                                src={cover}
                                                className="avatar-xl rounded-circle border border-4 border-white-color-40"
                                                alt=""
                                            />

                                            <Form.Group className="mb-3" controlId="cover">
                                                <Form.Label>Portada</Form.Label>
                                                <Form.Control type="file" placeholder='Seleccione una imagen'
                                                   
                                                    onChange={handleCoverUpload}
                                                    className={errors.cover ? "form-control is-invalid" : "form-control"} />
                                                
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
                                                        <span>Actualizando...</span>
                                                    </div>
                                                ) : (
                                                    'Actualizar Lugar'
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

export default ActualizarLugar;
