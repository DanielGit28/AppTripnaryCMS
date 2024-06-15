import { Alert, Button, Modal, Form, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";


const EditarPrompt = ({ prompt: promptProp, showEdit, handleView, updatePrompt }) => {
    const [prompt, setPrompt] = useState(promptProp)
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        handleView(false)
    };
    const handleShow = () => setShow(true);
    const [campos, setCampos] = useState(promptProp)
    const [error, setError] = useState('')

    const updateCampos = (campo, value) => {
        setCampos({
            ...campos,
            [campo]: value
        })
    }
    useEffect(() => {
        console.log("At load: ",showEdit,promptProp, prompt, campos)
    }, [])
    useEffect(() => {
        console.log(showEdit,promptProp, prompt, campos)
        showEdit ? handleShow() : handleClose()
    }, [showEdit, prompt, campos, promptProp])

    const actualizarPrompt = async () => {
        console.log(campos)
        try {
            const response = await fetch("/api/prompts", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(campos),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data);
            } else {
                setPrompt(campos)
                updatePrompt(campos)
                handleClose()
            }
        } catch (error) {
            setError(error.message)
        }
    };

    const puedeEnviarForm = () => {
        if (campos.nombre.length === 0 || campos.tipo.length === 0 || campos.descripcion.length === 0) {
            setError('Revisar los campos e intentar de nuevo ')
            return false
        } else {
            return true
        }
    }

    const handleForm = async (event) => {
        event.preventDefault()
        if (puedeEnviarForm()) {
            await actualizarPrompt()
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar {prompt?.nombre} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}
                </div>
                <Form onSubmit={handleForm}>
                    <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control value={campos?.nombre} type="text" name="nombre"
                            onChange={(e) => updateCampos('nombre', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control value={campos?.descripcion} type="text" name="descripcion"
                            onChange={(e) => updateCampos('descripcion', e.target.value)}

                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Group className="mb-3" controlId="tipo">
                            <Form.Label>Tipo Prompt</Form.Label>
                            <Form.Control
                                as="select"
                                value={campos.tipo}
                                onChange={e => updateCampos('tipo', e.target.value)}
                            >
                                <option value="Lugares">Lugares</option>
                                <option value="Restaurantes">Restaurantes</option>
                            </Form.Control>
                        </Form.Group>
                        
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default EditarPrompt;
