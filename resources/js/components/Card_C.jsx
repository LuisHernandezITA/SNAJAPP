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
        <Card
            className="my-card"
            style={{
                backgroundColor: "#111", // Gris casi negro para despegar del fondo puro
            }}
        >
            <Link to={`/item/${id}`}>
                <div className="my-card-img-container">
                    {!available && (
                        <div className="sold-out-badge">SOLD OUT</div>
                    )}
                    <Card.Img
                        src={images}
                        alt={firstName}
                        className={`my-card-img ${
                            !available ? "sold-out" : ""
                        }`}
                    />
                </div>
            </Link>

            <Card.Body className="p-3" style={{ color: "#eee" }}>
                <Card.Title>{firstName}</Card.Title>

                <Card.Subtitle
                    className="mb-2 text-white-50 small"
                    style={{ fontWeight: "300" }}
                >
                    {description}
                </Card.Subtitle>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>${price}</span>

                    <MDBBtn
                        class={`custom-button ${isButtonDisabled || !available ? "clicked" : ""}`}
                        size="lg"
                        className="mb-4 w-100"
                        onClick={handleButtonClick}
                        disabled={isButtonDisabled || !available}
                    >
                        <MDBIcon fas icon="shopping-cart" className="me-1" />
                        {isButtonDisabled ? "" : "ADD"}
                    </MDBBtn>
                </div>
            </Card.Body>

            {notification && (
                <div
                    className={`notification ${
                        notificationVisible ? "show" : ""
                    }`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </Card>
    );
}

export default Card_C;
