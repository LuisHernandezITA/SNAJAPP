import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MDBTypography, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import smallImage from "/public/favicon.ico";
import { useUser } from "./UserContext";
import "/resources/css/app.css";
import { Link } from "react-router-dom";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    const { userInfo } = useUser();
    const userId = userInfo ? userInfo.id : "";

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

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
        // 1. Verificación básica en el Front
        if (!userId) {
            setIsButtonDisabled(true);
            showNotification(
                "You need to sign in to add products to the cart.",
            );
            setTimeout(() => setIsButtonDisabled(false), 2000);
            return;
        }

        // 2. Construcción de datos para el Body
        const productData = {
            user_id: userId,
            product_id: product.id,
            quantity: 1,
        };

        setIsButtonDisabled(true);

        // 3. Petición POST (Sin tokens manuales)
        // Nota: Si usas Sanctum/Web, asegúrate de que Axios tenga withCredentials: true
        axios
            .post(`/api/addcart`, productData)
            .then((response) => {
                console.log("Servidor dice:", response.data);
                showNotification("Product added to Cart!");

                // Reactivamos para que pueda agregar más si gusta
                setTimeout(() => setIsButtonDisabled(false), 1000);
            })
            .catch((error) => {
                console.error(
                    "Error detallado:",
                    error.response ? error.response.data : error.message,
                );
                showNotification("Error adding product to cart!");
                setIsButtonDisabled(false);
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.post(
                    `http://127.0.0.1:8000/api/products_show`,
                    { id },
                );
                if (productResponse.data.length > 0) {
                    setProduct(productResponse.data[0]);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error(error);
            }

            try {
                const colorsResponse = await axios.post(
                    "http://127.0.0.1:8000/api/getProductColors",
                    { id },
                );
                // Verificamos que sea un array y tenga contenido
                if (
                    Array.isArray(colorsResponse.data) &&
                    colorsResponse.data.length > 0
                ) {
                    setColors(colorsResponse.data);
                } else {
                    setColors([]); // Es mejor usar [] que null para evitar errores al hacer .map()
                }
            } catch (error) {
                console.error("Error en colores:", error);
                setColors([]);
            }

            try {
                const sizesResponse = await axios.post(
                    "http://127.0.0.1:8000/api/getProductSizes",
                    { id },
                );
                if (sizesResponse.data.length > 0) {
                    setSizes(sizesResponse.data);
                } else {
                    setSizes(null);
                }
            } catch (error) {
                console.error(error);
                setSizes(null);
            }
        };

        if (id) {
            fetchData();
        }

        //console.log(product);
        //console.log(colors);
        //console.log(sizes);
    }, [id]);

    if (!product) {
        return (
            <div className="d-flex flex-wrap justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="app" style={{ position: "relative" }}>
            <div className="details">
                <div className="big-img">
                    {!product.available && (
                        <div className="sold-out-badge">SOLD OUT</div>
                    )}
                    <img src={product.images} alt="Producto" />
                </div>
                <div className="box">
                    <div className="row">
                        <h2
                            className="product-title-detail"
                            style={{ color: "black" }}
                        >
                            {product.name}
                        </h2>
                        <span>$ {product.price} MXN</span>
                    </div>
                    <p>{product.description}</p>

                    {colors && colors.length > 0 && (
                        <div>
                            <h2 style={{ color: "black" }}>Colors</h2>
                            <div className="color-buttons">
                                {colors.map((colorId, index) => (
                                    <button
                                        key={index}
                                        className={`color-button-detail ${
                                            selectedColor === colorId
                                                ? "selected"
                                                : ""
                                        }`}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: colorId,
                                            border: "1px solid black",
                                        }}
                                        onClick={() =>
                                            setSelectedColor(colorId)
                                        }
                                    ></button>
                                ))}
                            </div>
                            <br></br>
                        </div>
                    )}

                    {sizes && sizes.length > 0 && (
                        <div>
                            <h2 style={{ color: "black" }}>Sizes</h2>
                            <div
                                className="size-buttons-detail"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                {sizes.map((sizeId, index) => (
                                    <button
                                        key={index}
                                        className={`size-button-detail ${
                                            selectedSize === sizeId
                                                ? "selected"
                                                : ""
                                        }`}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin:
                                                index === 0
                                                    ? "0 5px 0 0"
                                                    : "0 5px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onClick={() => setSelectedSize(sizeId)}
                                    >
                                        {sizeId}
                                    </button>
                                ))}
                            </div>
                            <br></br>
                        </div>
                    )}

                    <MDBBtn
                        class={`custom-button ${
                            isButtonDisabled || !product.available
                                ? "clicked"
                                : ""
                        }`}
                        block
                        size="lg"
                        onClick={handleButtonClick}
                        disabled={isButtonDisabled || !product.available}
                    >
                        <MDBIcon fas icon="shopping-cart" />{" "}
                        {isButtonDisabled ? null : "Add to Cart"}{" "}
                    </MDBBtn>
                </div>
            </div>
            <div className="thumb">
                <img src={product.images} alt="Thumbnail 1" />
                <img src="URL_IMAGEN_THUMBNAIL_2" alt="Thumbnail 2" />
            </div>
            {/* SMALL IMAGE */}
            <img
                src={smallImage}
                alt="Small Image"
                className="d-none d-md-block" // ESTO: La oculta en móviles y la muestra en tablets/PC
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    width: "40px", // Dale un tamaño fijo pequeño
                    height: "auto",
                }}
            />

            <div className="d-flex align-items-center py-4">
                <MDBTypography tag="h6" className="mb-0 ms-5">
                    {" "}
                    <Link
                        to="/"
                        className="text-body d-flex align-items-center"
                        style={{ textDecoration: "none" }}
                    >
                        <MDBIcon fas icon="long-arrow-alt-left me-2" />
                        Back to shop
                    </Link>
                </MDBTypography>
            </div>
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
        </div>
    );
}

export default Product;
