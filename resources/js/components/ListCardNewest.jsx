import React, { useState, useEffect } from "react";
import { Spinner, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Card_C from "./Card_C"; // Tu componente de tarjeta
import { Link } from "react-router-dom";
import "/resources/css/app.css"; // Donde pondremos el CSS nuevo

function ListCardNewest() {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usamos la URL completa para el entorno local
                const response = await axios.get(
                    "http://localhost:8000/api/products_newest",
                );
                setProductData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "40vh" }}
            >
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">
                        Cargando plataforma ENFOCA...
                    </span>
                </Spinner>
            </div>
        );
    }

    // Separamos el más nuevo (Curso Destacado)
    const featuredCourse = productData.length > 0 ? productData[0] : null;
    const otherCourses = productData.slice(1); // El resto de los cursos

    return (
        <div className="home-container">
            {/* --- SECCIÓN 2: CURSO DESTACADO (ANUNCIO CON IMAGEN CORREGIDA) --- */}
            {featuredCourse && (
                <section className="featured-section py-5">
                    <Container>
                        <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end border-bottom pb-3">
                            {/* Izquierda: El Título con estilo fuerte */}
                            <div className="text-start">
                                <h2
                                    className="display-4 fw-black mb-0 text-uppercase"
                                    style={{
                                        letterSpacing: "-2px",
                                        fontWeight: "1000",
                                        color: "#1a3c5e",
                                        lineHeight: "1",
                                    }}
                                >
                                    Curso de
                                    <br />
                                    <span style={{ color: "#ffffff" }}>
                                        Lanzamiento
                                    </span>
                                </h2>
                            </div>

                            {/* Derecha: El Anuncio llamativo */}
                            <div className="mt-3 mt-md-0">
                                <span
                                    className="badge rounded-pill px-4 py-2 animate-pulse shadow-sm"
                                    style={{
                                        letterSpacing: "2px",
                                        fontSize: "0.9rem",
                                        background:
                                            "linear-gradient(90deg, #f46112 0%, #ea1d2e 100%)",
                                        fontWeight: "700",
                                    }}
                                >
                                    <i className="fas fa-bolt me-2"></i> LO MÁS
                                    NUEVO
                                </span>
                            </div>
                        </div>

                        {/* Contenedor igual al de otherCourses */}
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            <div className="card-wrapper hover-lift">
                                <Card_C
                                    id={featuredCourse.id}
                                    name={featuredCourse.name}
                                    description={featuredCourse.description}
                                    price={featuredCourse.price}
                                    images={featuredCourse.images}
                                    available={featuredCourse.available}
                                />
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            {/* --- SECCIÓN 1: SOBRE NOSOTROS (ESTILO VIDRIO NARANJA) --- */}
            <section
                className="about-section position-relative overflow-hidden py-5 text-white"
                style={{ minHeight: "500px" }}
            >
                {/* Contenedor del GIF de Fondo */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0,
                    }}
                >
                    <img
                        src="https://xnetwork.online/wp-content/uploads/2025/10/Social-Media-monetization.gif"
                        alt="Fondo dinámico"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    {/* Capa de "Vidrio Naranjoso" (Overlay) */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(135deg, rgba(244, 97, 18, 0.85) 0%, rgba(234, 29, 46, 0.9) 100%)",
                            backdropFilter: "blur(8px)", // Esto crea el efecto de vidrio esmerilado
                            zIndex: 1,
                        }}
                    ></div>
                </div>

                <Container className="position-relative" style={{ zIndex: 2 }}>
                    <Row className="align-items-center">
                        {/* Espacio Izquierdo (Vacío para que luzca el GIF/Efecto) */}
                        <Col lg={5} className="d-none d-lg-block">
                            {/* Aquí no ponemos texto para que el efecto visual del GIF "respire" */}
                        </Col>

                        {/* Lado Derecho: Información Institucional */}
                        <Col lg={7} className="text-start">
                            <div
                                className="p-4 rounded-4"
                                style={{ background: "rgba(0,0,0,0.15)" }}
                            >
                                <h2 className="fw-light mb-0">
                                    Escuela Nacional de Formación
                                </h2>
                                <h1
                                    className="fw-black mb-4 display-3"
                                    style={{ letterSpacing: "2px" }}
                                >
                                    ENFOCA
                                </h1>

                                <p
                                    className="lead mb-5"
                                    style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "300",
                                    }}
                                >
                                    Un espacio dedicado a la formación integral
                                    de líderes juveniles, inspirado en los
                                    valores del humanismo político y el legado
                                    de
                                    <strong> Carlos Abascal Carranza</strong>.
                                    Certifica tus habilidades con nosotros.
                                </p>

                                <Row className="g-3">
                                    <Col md={4}>
                                        <div className="p-3 rounded-3 bg-white text-dark shadow-sm border-bottom border-danger border-4 text-center">
                                            <i className="fas fa-certificate text-warning mb-2"></i>
                                            <h6 className="mb-0 small fw-bold">
                                                Validez
                                            </h6>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="p-3 rounded-3 bg-white text-dark shadow-sm border-bottom border-warning border-4 text-center">
                                            <i className="fas fa-users text-warning mb-2"></i>
                                            <h6 className="mb-0 small fw-bold">
                                                Formación
                                            </h6>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="p-3 rounded-3 bg-white text-dark shadow-sm border-bottom border-danger border-4 text-center">
                                            <i className="fas fa-laptop-code text-warning mb-2"></i>
                                            <h6 className="mb-0 small fw-bold">
                                                24/7
                                            </h6>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <br></br>
            <br></br>

            {/* --- SECCIÓN 3: OTROS CURSOS (RESTO DE LA LISTA) --- */}
            {otherCourses.length > 0 && (
                <section className="other-courses py-5 bg-light border-top">
                    <Container>
                        <h4 className="fw-bold mb-5 border-start border-danger border-4 ps-3 text-dark">
                            Ofertas Académicas Adicionales
                        </h4>

                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            {otherCourses.map((product) => (
                                <div
                                    key={product.id}
                                    className="card-wrapper hover-lift"
                                >
                                    <Card_C
                                        id={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        images={product.images}
                                        available={product.available}
                                    />
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            )}
            <br></br>
            <br></br>
        </div>
    );
}

export default ListCardNewest;
