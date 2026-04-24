import React, { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function CardMusic(props) {
    const { id, nombre, artista, etiqueta, urlmusic, image } = props;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleListenClick = () => {
        setIsButtonDisabled(true);
        if (urlmusic) {
            window.open(urlmusic, "_blank");
        }
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 2000);
    };

    return (
        <Card
            className="mb-2 shadow-sm border-0"
            onClick={handleListenClick}
            style={{
                width: "100%",
                background:
                    "linear-gradient(135deg, rgb(18, 22, 244) 0%, rgb(234, 29, 46) 100%)", // Fondo claro para que resalte en el fondo azul/naranja
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s",
            }}
        >
            <div className="d-flex align-items-center p-2">
                {/* 2. INFORMACIÓN CENTRAL (Nombre y Artista/Descripción) */}
                <div className="ms-3 flex-grow-1">
                    <div className="d-flex align-items-center">
                        <h6
                            className="mb-0 text-light me-2"
                            style={{
                                fontSize: "1.4rem",
                                letterSpacing: ".5px",
                            }}
                        >
                            {nombre}
                        </h6>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default CardMusic;
