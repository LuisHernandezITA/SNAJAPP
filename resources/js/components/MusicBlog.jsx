import React, { useState, useEffect } from "react";
import { Spinner, Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import CardMusic from "./CardMusic";
import "/resources/css/app.css";

function MusicBlog() {
    const [musicData, setMusicData] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/music_index",
                );
                // Invertimos la data para que los últimos registros (IDs más altos) salgan primero
                setMusicData(response.data.reverse());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching music:", error);
                setLoading(false);
            }
        };
        fetchMusic();
    }, []);

    // --- LÓGICA DE PAGINACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = musicData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(musicData.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden">Loading...</span>
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
                    backgroundColor: "rgb(18, 18, 18)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                className="shadow-sm py-3 w-100"
            >
                <Container className="px-4">
                    <div className="d-flex align-items-center">
                        <span
                            className="glitch-text"
                            style={{
                                fontSize: "1.2rem",
                                letterSpacing: "4px",
                                opacity: "0.8",
                                fontWeight: "300",
                            }}
                        >
                            MUSIC ARCHIVE ♱༺༒︎⊰
                        </span>
                    </div>
                    <Nav className="ms-auto d-none d-md-flex align-items-center">
                        <span
                            className="small text-uppercase"
                            style={{
                                color: "rgba(255,255,255,0.3)",
                                letterSpacing: "2px",
                                fontSize: "0.7rem",
                            }}
                        >
                            {/* Cambia dinámicamente según la página actual */}
                            Release Vol.{" "}
                            {currentPage.toString().padStart(2, "0")} —{" "}
                            {new Date().getFullYear()}
                        </span>
                    </Nav>
                </Container>
            </Navbar>

            <div className="container-fluid px-md-5 mt-5">
                <div className="d-flex flex-column gap-5 align-items-center pb-5">
                    {currentItems.map((track) => (
                        <CardMusic
                            key={track.id}
                            id={track.id}
                            nombre={track.nombre}
                            artista={track.artista}
                            etiqueta={track.etiqueta}
                            urlmusic={track.urlmusic}
                            image={track.image}
                        />
                    ))}
                </div>

                {/* --- CONTROLES DE PAGINACIÓN / VOLÚMENES --- */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-3 mt-4 pb-5">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`custom-button ${currentPage === index + 1 ? "clicked" : ""}`}
                                style={{
                                    width: "50px",
                                    padding: "10px",
                                    fontSize: "0.8rem",
                                    border:
                                        currentPage === index + 1
                                            ? "1px solid crimson"
                                            : "1px solid #333",
                                    background:
                                        currentPage === index + 1
                                            ? "rgba(220, 20, 60, 0.1)"
                                            : "transparent",
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
