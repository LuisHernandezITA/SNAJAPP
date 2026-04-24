import React, { useState, useEffect } from "react";
import {
    Spinner,
    Navbar,
    Nav,
    Container,
    Form,
    InputGroup,
} from "react-bootstrap";
import axios from "axios";
import CardMusic from "./CardMusic";
import { MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function MusicBlog() {
    const [musicData, setMusicData] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA BÚSQUEDA Y PAGINACIÓN ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/music_index",
                );
                setMusicData(response.data.reverse());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching music:", error);
                setLoading(false);
            }
        };
        fetchMusic();
    }, []);

    // --- LÓGICA DE FILTRADO ---
    const filteredItems = musicData.filter((track) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            track.nombre.toLowerCase().includes(searchLower) ||
            track.artista.toLowerCase().includes(searchLower) ||
            (track.etiqueta &&
                track.etiqueta.toLowerCase().includes(searchLower))
        );
    });

    // --- LÓGICA DE PAGINACIÓN (Basada en los items filtrados) ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Manejar el cambio en el buscador y resetear a la página 1
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden">Cargando archivo...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <br />
            <Navbar
                expand="lg"
                variant="dark"
                style={{
                    background:
                        "linear-gradient(135deg, rgb(18, 37, 244) 0%, rgb(29, 149, 234) 100%)",
                    borderBottom: "1px solid rgba(235, 199, 199, 0.1)",
                }}
                className="shadow-sm py-3 w-100 sticky-top"
            >
                <Container className="px-4">
                    {/* BUSCADOR INTEGRADO */}
                    <div className="d-flex align-items-center flex-grow-1 me-md-5">
                        <InputGroup style={{ maxWidth: "400px" }}>
                            <InputGroup.Text
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    color: "white",
                                }}
                            >
                                <MDBIcon fas icon="search" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar curso, instructor o etiqueta..."
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    border: "none",
                                    color: "white",
                                    placeholderColor: "white",
                                }}
                                className="search-input-custom"
                            />
                        </InputGroup>
                    </div>

                    <Nav className="ms-auto d-none d-md-flex align-items-center">
                        <span
                            className="small text-uppercase fw-bold"
                            style={{
                                color: "white",
                                letterSpacing: "2px",
                                fontSize: "0.75rem",
                            }}
                        >
                            Página {currentPage} de {totalPages || 1} —{" "}
                            {filteredItems.length} Resultados
                        </span>
                    </Nav>
                </Container>
            </Navbar>

            <div className="container-fluid px-md-5 mt-5">
                <div className="d-flex flex-column gap-3 align-items-center pb-5">
                    {currentItems.length > 0 ? (
                        currentItems.map((track) => (
                            <CardMusic
                                key={track.id}
                                id={track.id}
                                nombre={track.nombre}
                                artista={track.artista}
                                etiqueta={track.etiqueta}
                                urlmusic={track.urlmusic}
                                image={track.image}
                            />
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <MDBIcon
                                fas
                                icon="search-minus"
                                size="3x"
                                className="mb-3 text-muted"
                            />
                            <h4 className="text-muted">
                                No se encontraron cursos que coincidan con tu
                                búsqueda
                            </h4>
                        </div>
                    )}
                </div>

                {/* --- CONTROLES DE PAGINACIÓN --- */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-2 mt-4 pb-5">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`btn ${currentPage === index + 1 ? "btn-light" : "btn-outline-light"}`}
                                style={{
                                    width: "45px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MusicBlog;
