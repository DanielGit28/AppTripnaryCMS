// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';

// import authlayout to override default layout 
import AuthLayout from 'layouts/AuthLayout';

import signIn from "../../lib/userAuth";
import { useRouter } from 'next/navigation'


const SignIn = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [error, setError] = useState(null); 

  const handleForm = async (event) => {
    event.preventDefault()

    const { result, error } = await signIn(email, password);

    if (error) {
      setError("Correo electrónico o contraseña incorrecta"); // Actualiza el estado con el mensaje de error
      console.log(error);
    } else {
      setError(null); // Borra cualquier mensaje de error previo
      console.log(result);
    }

    console.log(result)
  }


  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/"><Image src="/images/tripnary/logo/logo_only_name_azul.png" className="mb-2" alt="" /></Link>
              <p className="mb-6">Por favor ingrese su información de usuario.</p>
            </div>
            {/* Form */}
            <Form onSubmit={handleForm}>
              {/* Username */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" name="username" placeholder="Ingrese el correo electrónico" required=""

                  onChange={(e) => setEmail(e.target.value)}

                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required=""
                  onChange={(e) => setPassword(e.target.value)}
                
                />
              </Form.Group>

              {/* Checkbox */}
              <div className="d-lg-flex justify-content-between align-items-center mb-4">
               
              </div>
              <div>
                {/* Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit">Iniciar sesión</Button>
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  
                  <div>
                    <Link href="/authentication/forget-password" className="text-inherit fs-5">Olvidó su contraseña?</Link>
                  </div>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger mt-4" role="alert">
                  {error}
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

SignIn.Layout = AuthLayout;

export default SignIn