// import node module libraries
import { Col, Row, Container, Button, Card, Spinner } from "react-bootstrap";
import { Component, useEffect, useState } from "react";

import { useRouter } from "next/router";
import DefaultDashboardLayout from "../../../layouts/DefaultDashboardLayout";

// import sub components
import AboutPrompt from "sub-components/prompts/AboutPrompt";
import EditarPrompt from "sub-components/prompts/EditarPrompt";
import EliminarPrompt from "sub-components/prompts/EliminarPrompt";

const PerfilPrompt = () => {
    const [prompt, setPrompt] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [show, setShow] = useState(false);

    const [promptAI, setPromptAI] = useState('')
    const [loadingPrompt, setLoadingPrompt] = useState(false)
    const router = useRouter();
    const { reference } = router.query;
    //   const admin = admins[0];
    const handleMethodFinish = () => {
        setRefreshFlag(!refreshFlag);
        getPromptByReference();
    };

    useEffect(() => {
        getPromptByReference();
    }, []);

    const getPromptByReference = async () => {
        try {
            const response = await fetch("/api/prompts?reference=" + reference, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            data.reference = reference;
            setPrompt(data);
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };

    const pruebaPrompt = async () => {
        const newPrompt = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt.descripcion }]
        };
        try {
            setLoadingPrompt(true)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                },
                body: JSON.stringify(newPrompt)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data);
            } else {
                setLoadingPrompt(false)
                setPromptAI(JSON.parse(data.choices[0].message.content).recomendaciones)
                console.log(JSON.parse(data.choices[0].message.content))
            }
        } catch (error) {
            setPromptAI(error.message)
        }
    }

    useEffect(() => {
        if (prompt == null) router.push("/");
    }, [prompt]);

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
            <Container fluid className="p-6">
                {prompt && (
                    <div>
                        <Row className="align-items-center">
                            <Col lg={12} md={12} xs={12}>
                                <div
                                    className="pt-20 rounded-top"
                                    style={{
                                        background: "url(/images/background/profile-cover.jpg) no-repeat",
                                        backgroundSize: "cover",
                                    }}
                                ></div>
                                <div className="bg-white rounded-bottom smooth-shadow-sm ">
                                    <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                                        <div className="d-flex align-items-center">
                                            <div className="lh-1">
                                                <h2 className="mb-0">
                                                    {prompt.nombre}

                                                </h2>
                                                <p className="mb-0 d-block">{prompt.descripcion}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                className="me-1 mb-2"
                                                onClick={() => {
                                                    setShow(true)
                                                }}
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                        <EliminarPrompt reference={prompt.reference} />
                                    </div>

                                </div>
                            </Col>
                        </Row>
                        <div className="py-6">
                            <Row>
                                <AboutPrompt prompt={prompt} />
                            </Row>
                        </div>
                        <div className="py-6">
                            <Col lg={12} md={12} xs={12} className="mb-6">
                                <Card>
                                    <Card.Body>
                                        <Card.Title as="h3">Probar el Prompt</Card.Title>
                                        <Button
                                            variant="primary"
                                            onClick={() => pruebaPrompt()}
                                        >
                                            Probarlo
                                        </Button>
                                        {loadingPrompt && <Col xs={6} className="mb-5 mt-5">
                                            <Spinner animation="grow" />

                                        </Col>}
                                        {promptAI && (
                                            <Col xs={8} className="mb-5 mt-5">
                                                {promptAI.map((recomendacion, index) => (
                                                    <div key={index} className="mb-t mt-5">
                                                        <h6 className="text-uppercase fs-5 ls-2">{recomendacion.destino ? recomendacion.destino : recomendacion.nombre}</h6>
                                                        <p className="mb-0">{recomendacion.descripcion}</p>
                                                    </div>
                                                ))}
                                            </Col>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>
                    </div>
                )}
                {show && <EditarPrompt prompt={prompt} showEdit={show} handleView={setShow} updatePrompt={setPrompt} />}
            </Container>
        </Layout>
    );
};

export default PerfilPrompt;
