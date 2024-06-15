import { useState } from "react";
import {  Button, Modal, Form, Alert, Dropdown } from "react-bootstrap";
const EditarContinente = ({continente, setContinente}) => {
    console.log(continente)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [campos, setCampos] = useState(continente)
    const [error, setError] = useState('')
    const updateCampos = (campo, value) => {
        setCampos({
          ...campos,
          [campo]: value
        })
      }
    const actualizarContinente = async () => {
        try {
          const response = await fetch("/api/continentes", {
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
            setContinente(campos)
            setShow(false)
          }
        } catch (error) {
          setError(error.message)
        }
      };
    
      const puedeEnviarForm = () => {
        if (campos.nombre.length === 0 || campos.codigoContinente.length === 0 || campos.descripcion.length === 0) {
          setError('Revisar los campos e intentar de nuevo ')
          return false
        } else {
          return true
        }
      }
    
      const handleForm = async (event) => {
        event.preventDefault()
        if (puedeEnviarForm()) {
          await actualizarContinente()
        }
      }
    return continente ?
        <>
            <Button variant="primary" onClick={handleShow}>
            Editar
          </Button>
          <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar {continente?.nombre} </Modal.Title>
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
              <Form.Group className="mb-3" controlId="descripcion">
                <Form.Label>Código continente</Form.Label>
                <Form.Control value={campos?.codigoContinente} type="text" name="continente" maxLength={2}
                  onChange={(e) => updateCampos('codigoContinente', e.target.value)}

                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {campos?.estado}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item key={"Activo"} onClick={() => updateCampos('estado', 'Activo')}>
                      Activo
                    </Dropdown.Item>
                    <Dropdown.Item key={"Inactivo"} onClick={() => updateCampos('estado', 'Inactivo')}>
                      Inactivo
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
        </>
    : <></>
}

export default EditarContinente