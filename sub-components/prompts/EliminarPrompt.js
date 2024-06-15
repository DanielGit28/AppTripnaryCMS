import { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
const EliminarPrompt = ({reference}) => {
    const [showEliminar, setShowEliminar] = useState(false);
    const router = useRouter();
    const eliminarPrompt = async (reference) => {
        try {
            const response = await fetch(`/api/prompts?reference=${reference}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return router.push("/pages/prompts/prompts");
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };
    return (
        <>
            <Alert show={showEliminar} variant="danger">
                <Alert.Heading>Alerta!</Alert.Heading>
                <p>¿Está seguro que desea eliminar el prompt?</p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button
                        variant="outline-danger"
                        onClick={() => eliminarPrompt(reference)}
                    >
                        Si
                    </Button>
                    <Button
                        style={{
                            marginLeft: "2%",
                          }}
                        onClick={() => setShowEliminar(false)}
                        variant="outline-success"
                    >
                        No
                    </Button>
                </div>
            </Alert>
            <Button
                variant="danger"
                onClick={() => (showEliminar ? setShowEliminar(false) : setShowEliminar(true))}
            >
                Eliminar Prompt
            </Button>
        </>
    )
}

export default EliminarPrompt