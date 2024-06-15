// import node module libraries
import Link from "next/link";
import { Col, Row, Image, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const HeaderPais = ({ pais }) => {
  const router = useRouter();

  const redirect = (reference) => {
    const prop = { reference: reference };
    router.push({
      pathname: "/pages/editarPais",
      query: prop,
    });
  };

  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
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
              {/* avatar */}
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image
                  src={pais.imagen}
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt=""
                />
              </div>
              {/* text */}
              <div className="lh-1">
                <h2 className="mb-0">
                  {pais.nombre}
                  <Link
                    href="#!"
                    className="text-decoration-none"
                    data-bs-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Beginner"
                  ></Link>
                </h2>
                <br/>
                <p className="mb-0 d-block">{pais.descripcion}</p>
              </div>
            </div>
            <div>
              {/* <Link
                href="#"
                className="btn btn-outline-primary d-none d-md-block"
                onClick={() => redirect(pais.reference)}
              >
                Editar País
              </Link> */}

              <Button
                    variant="outline-primary"
                    className="me-1 mb-2"
                    onClick={() => redirect(pais.reference)}
                  >
                    Editar
              </Button>
            </div>
          </div>
          {/* nav */}
          <ul className="nav nav-lt-tab px-4" id="pills-tab" role="tablist">
            <li className="nav-item">
              <Link className="nav-link active" href="#">
                General
              </Link>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default HeaderPais;
