import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";
import "/resources/css/app.css";

function Carrousel() {
    const [banners, setBanners] = useState([]);
    const [clickedId, setClickedId] = useState(null);

    useEffect(() => {
        axios
            .get("/api/banners_index")
            .then((response) => {
                setBanners(response.data);
            })
            .catch((error) => {
                console.error("Error fetching banners:", error);
            });
    }, []);

    const handleButtonClick = (id, url) => {
        setClickedId(id);
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    };

    if (banners.length === 0) return null;

    // Estilos personalizados para este botón específico
    const circularWhiteButtonStyle = {
        borderRadius: "50px", // Bordes circulares
        backgroundColor: "white", // Fondo blanco
        border: "2px solid white",
        transition: "all 0.98s ease", // Para que el hover sea suave
    };

    return (
        <Carousel fade>
            {banners.map((banner) => (
                <Carousel.Item key={banner.id} interval={banner.interval}>
                    <img
                        className="d-block custom-carousel-img"
                        src={banner.image_url}
                        alt={banner.alt_text}
                    />
                    <Carousel.Caption className="pb-3">
                        {banner.link_url && (
                            <MDBBtn
                                // Mantenemos tus clases originales para la animación de 'clicked'
                                class={`custom-button mb-4 ${clickedId === banner.id ? "clicked" : ""}`}
                                className="mb-4 w-100"
                                style={circularWhiteButtonStyle}
                                size="lg"
                                onClick={() =>
                                    handleButtonClick(
                                        banner.id,
                                        banner.link_url,
                                    )
                                }
                            >
                                {banner.alt_text}
                            </MDBBtn>
                        )}
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default Carrousel;
