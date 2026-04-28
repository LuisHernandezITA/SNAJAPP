import React from "react";
import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
} from "mdb-react-ui-kit";

function Footer() {
    return (
        <MDBFooter
            className="text-center text-lg-start text-white" // Cambiamos text-muted por text-white
            style={{
                background:
                    "linear-gradient(135deg, rgb(244, 97, 18) 0%, rgb(234, 29, 46) 100%)",
            }} // Aplicamos tu color
        >
            {/* Sección de redes sociales con borde sutil */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom border-secondary">
                <div className="me-5 d-none d-lg-block">
                    <span>Conecta con nuestras redes sociales:</span>
                </div>

                <div>
                    {/* Cambié color="secondary" por "light" para que resalten en el fondo oscuro */}
                    <a href="" className="me-4 text-reset">
                        <MDBIcon fab icon="facebook-f" color="light" />
                    </a>
                    <a href="" className="me-4 text-reset">
                        <MDBIcon fab icon="twitter" color="light" />
                    </a>
                    <a href="" className="me-4 text-reset">
                        <MDBIcon fab icon="google" color="light" />
                    </a>
                    <a href="" className="me-4 text-reset">
                        <MDBIcon fab icon="instagram" color="light" />
                    </a>
                    <a href="" className="me-4 text-reset">
                        <MDBIcon fab icon="github" color="light" />
                    </a>
                </div>
            </section>

            <section className="">
                <MDBContainer className="text-center text-md-start mt-5">
                    <MDBRow className="mt-3">
                        <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <img
                                    alt="Logo"
                                    src="/img/acjuvenil.svg"
                                    width="120"
                                    height="60"
                                    className="d-inline-block align-top"
                                    style={{
                                        filter: "brightness(0) invert(1)",
                                    }} // Si el logo es negro, esto lo hace blanco
                                />
                            </h6>
                            <p className="text-white-50">
                                {" "}
                                {/* Texto un poco más suave que el blanco puro */}
                                Accion Juvenil, Accion Juvenil, Accion Juvenil
                                Cultura de jovenes en politica mexicana.
                            </p>
                        </MDBCol>

                        <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Cursos
                            </h6>
                            <p>
                                <a href="#!" className="text-white-50">
                                    Store
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-white-50">
                                    New Arrivals
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-white-50">
                                    Featured
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Useful links
                            </h6>
                            <p>
                                <a href="#!" className="text-white-50">
                                    Pricing
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-white-50">
                                    Orders
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-white-50">
                                    Help
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol
                            md="4"
                            lg="3"
                            xl="3"
                            className="mx-auto mb-md-0 mb-4"
                        >
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contacto
                            </h6>
                            <p>
                                <MDBIcon
                                    icon="home"
                                    className="me-2"
                                    color="light"
                                />{" "}
                                Mexico City, MX
                            </p>
                            <p>
                                <MDBIcon
                                    icon="envelope"
                                    className="me-3"
                                    color="light"
                                />{" "}
                                info@accionjuvenil.com
                            </p>
                            <p>
                                <MDBIcon
                                    icon="phone"
                                    className="me-3"
                                    color="light"
                                />{" "}
                                + 52 55 1234 5678
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Copyright con un tono de negro ligeramente distinto para dar profundidad */}
            <div
                className="text-center p-4"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }}
            >
                © 2026 Copyright:
                <a className="text-reset fw-bold ms-1" href="#">
                    Accion Juvenil 2026
                </a>
            </div>
        </MDBFooter>
    );
}

export default Footer;
