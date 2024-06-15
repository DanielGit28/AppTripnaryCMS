// import node module libraries
import Link from "next/link";
import { useState } from "react";
import { Col, Form, Button, Card, Image } from "react-bootstrap";
import resetPassword from "../../lib/resetPasswordAuth";
import { useForm } from "react-hook-form";

const RecuperarContrasenniaUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null);

  const onSubmit = async (data) => {

    const { email } = data;
    const { result, error } = await resetPassword(email);

    if (error) {
      setResult(null);
    } else {
      setResult("Se envió un correo electrónico con la información para restablecer la contraseña");
    }

  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title as="h4">Restablecer Contraseña</Card.Title>
        {result && (
          <div className="alert alert-success mt-4" role="alert">
            {result}
          </div>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
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
          {/* Button */}
          <div className="mb-3 d-grid">
            <Button variant="primary" type="submit">
              Restablecer Contraseña
            </Button>
          </div>

        </Form>
      </Card.Body>
    </Card>
  );
};

export default RecuperarContrasenniaUser;
