import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import "/resources/css/app.css";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

function Card_C(props) {
    const id = props.id;
    const firstName = props.name;
    const price = props.price;
    const description = props.description;
    const images = props.images;
    const available = props.available;

    const { userInfo } = useUser(); // USERINFO
    const userId = userInfo ? userInfo.id : "";
    const accessToken = userInfo ? userInfo.token : "";

    console.log(userId);

    //NOTIFICATIONS

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    //ADD TO CART

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleButtonClick = () => {
        if (!userId) {
            showNotification(
                "You need to sign in to add products to the cart.",
            );
            setIsButtonDisabled(true);
            return;
        }

        // Limpiamos productData para enviar solo lo que la base de datos necesita
        // Mandar descripción o imágenes por POST es innecesario si Laravel ya las tiene
        const productData = {
            user_id: userId, // <--- Ahora lo enviamos aquí
            product_id: props.id,
            quantity: 1, // <--- Especificamos que añadimos 1 por cada clic
        };

        // ADD PRODUCT TO CART
        axios
            .post(`/api/addcart`, productData, {
                // <--- URL limpia sin el ${userId}
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                showNotification("Product added to Cart!");

                // Opcional: Si quieres que el usuario pueda seguir añadiendo,
                // no deshabilites el botón o usa un temporizador.
                setTimeout(() => setIsButtonDisabled(false), 1000);
            })
            .catch((error) => {
                console.error("Error adding product to cart:", error);
                showNotification("Error adding product to cart!");
                setIsButtonDisabled(false);
            });

        setIsButtonDisabled(true);
    };

    return (
        <Card className="course-card-huge border-0 overflow-hidden">
            <div className="row g-0 h-100">
                {/* ÁREA DE IMAGEN/BANNER CON ENLACE */}
                <div className="col-md-7 col-lg-8 position-relative">
                    <Link to={`/item/${id}`} className="text-decoration-none">
                        <div className="huge-card-img-container">
                            {!available && (
                                <div className="sold-out-badge">
                                    CUPOS AGOTADOS
                                </div>
                            )}

                            <Card.Img
                                src={images}
                                alt={firstName}
                                className="huge-course-img"
                            />

                            {/* El degradado blanquecino */}
                            <div className="huge-card-gradient-overlay"></div>

                            {/* Opcional: Un pequeño icono de "ver más" que aparece al pasar el mouse */}
                            <div className="view-details-icon">
                                <MDBIcon fas icon="plus" />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-5 col-lg-4 d-flex align-items-center bg-light-glass">
                    {/* Cambiamos la clase a bg-light-glass */}
                    <Card.Body className="p-4 p-lg-5">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h2 className="huge-course-title-dark">
                                {firstName}
                            </h2>
                            <span className="huge-course-price-blue">
                                ${price}
                            </span>
                        </div>

                        <p className="huge-course-description-dark">
                            {description}
                        </p>

                        <div className="mt-5">
                            <MDBBtn
                                className="huge-course-btn-blue"
                                onClick={handleButtonClick}
                            >
                                <MDBIcon
                                    fas
                                    icon="graduation-cap"
                                    className="me-2"
                                />
                                INSCRIBIRME AHORA
                            </MDBBtn>
                        </div>
                    </Card.Body>
                </div>
            </div>
            {/* Notificación (se mantiene igual) */}
            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </Card>
    );
}

export default Card_C;
