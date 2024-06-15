// import node module libraries
import Link from 'next/link';
import { Col, Row, Image } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PerfilHeaderLugar = ({ lugar }) => {

    const [documento, setDocumento] = useState([]);
    const router = useRouter();
    const { reference } = router.query;

    useEffect(() => {
        getDocumento();
    }, []);

    const getDocumento = async () => {
        try {
            const response = await fetch(`/api/documentos?idLugar=${reference}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setDocumento(data[0]);
        } catch (error) {
            console.error("There was a problem fetching the data:", error.message);
        }
    };

    const redirect = () => {
        const props = {
          reference: reference
        };
      
        router.push({
          pathname: "/pages/actualizarLugar",
          query: props,
        });
      };

    return (
        <Row className="align-items-center">
            <Col xl={12} lg={12} md={12} xs={12}>
                {/* Bg */}
                <div className="pt-20 rounded-top" style={{ backgroundImage: `url(${lugar.imagenCover})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                </div>

                <div className="bg-white rounded-bottom smooth-shadow-sm ">
                    <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
                        <div className="d-flex align-items-center">
                            {/* avatar */}
                            <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                                <Image src={lugar.imagen} className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt="" />

                            </div>
                            {/* text */}
                            <div className="lh-1">
                                <h2 className="mb-2">{lugar.nombre}
                                    <Link href="#!" className="text-decoration-none" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Beginner">
                                    </Link>
                                </h2>
                                <p className="mb-0 d-block">{lugar.idCiudad}</p>
                            </div>
                        </div>
                        <div>
                            <Link href="#" className="btn btn-outline-primary d-none d-md-block" onClick={redirect}>Editar perfil</Link>
                        </div>
                    </div>
                    {/* nav */}
                    <ul className="nav nav-lt-tab px-4" id="pills-tab" role="tablist">

                    </ul>
                </div>
            </Col>
        </Row>
    )
}

export default PerfilHeaderLugar