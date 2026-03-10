import React, { useState, useEffect } from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBRow,
    MDBTypography,
    MDBIcon,
} from "mdb-react-ui-kit";
import { useUser } from "./UserContext";
import { Link } from "react-router-dom";

function Cart() {
    const { userInfo } = useUser();
    const userId = userInfo ? userInfo.id : "";
    const accessToken = userInfo ? userInfo.token : "";

    // VERIFIES AUTH USER
    const isLoggedIn = userInfo && userInfo.id;

    const [cartProducts, setCartProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // EXECUTES IF USER IS AUTH
        if (isLoggedIn) {
            fetch("http://127.0.0.1:8000/api/getProductsInCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ user_id: userId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setCartProducts(data);
                    updateTotalPrice(data);
                })
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, [isLoggedIn, userId]);

    const updateTotalPrice = (products) => {
        const total = products.reduce(
            (accumulator, product) =>
                accumulator + product.price * product.quantity,
            0,
        );
        setTotalPrice(total);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        // 1. Actualización Visual Inmediata (Optimistic UI)
        // Si la cantidad es 0, lo filtramos de una vez para que desaparezca de la vista
        if (newQuantity <= 0) {
            const filtered = cartProducts.filter((p) => p.id !== productId);
            setCartProducts(filtered);
            updateTotalPrice(filtered);
        } else {
            const updated = cartProducts.map((p) =>
                p.id === productId ? { ...p, quantity: newQuantity } : p,
            );
            setCartProducts(updated);
            updateTotalPrice(updated);
        }

        // 2. Petición al Backend usando Axios (Sincronizado con tu controlador)
        axios
            .post("http://127.0.0.1:8000/api/updateQuantity", {
                user_id: userId,
                product_id: productId,
                quantity: newQuantity, // Tu controlador maneja si es > 0 (update) o 0 (delete)
            })
            .then((response) => {
                console.log("Servidor dice:", response.data.message);
            })
            .catch((error) => {
                console.error("Error al actualizar cantidad:", error);
                // Opcional: Aquí podrías recargar los productos si hubo error para revertir el cambio visual
            });
    };

    const handleRemoveFromCart = (productId) => {
        // Borrado visual
        const updated = cartProducts.filter((p) => p.id !== productId);
        setCartProducts(updated);
        updateTotalPrice(updated);

        // Borrado en BD
        axios
            .post("http://127.0.0.1:8000/api/removeProductFromCart", {
                user_id: userId,
                product_id: productId,
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.error("Error al eliminar:", error);
            });
    };

    return (
        <section className="h-100 h-custom">
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol size="12">
                        <MDBCard
                            className="card-registration card-registration-2"
                            style={{ borderRadius: "15px", padding: "30px" }}
                        >
                            <MDBCardBody className="p-0">
                                <h2
                                    style={{
                                        color: "black",
                                        fontSize: "2.6em",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Shopping Cart
                                </h2>
                                <br></br>
                                {!isLoggedIn && ( // Display the link only if the user is not authenticated
                                    <div>
                                        <p>
                                            You need to log in to use the cart.
                                        </p>
                                        <Link to="/Login_B">Log in</Link>
                                    </div>
                                )}

                                {/* RENDER PRODUCTS IN CART */}
                                {cartProducts.map((product) => (
                                    <MDBRow
                                        key={product.id}
                                        className="mb-4 d-flex justify-content-between align-items-center"
                                    >
                                        <MDBCol md="2" lg="2" xl="2">
                                            <img
                                                src={product.images}
                                                className="rounded-3 img-fluid"
                                                alt={product.name}
                                            />
                                        </MDBCol>
                                        <MDBCol md="3" lg="3" xl="3">
                                            <MDBTypography
                                                tag="h6"
                                                className="text-muted"
                                            >
                                                {product.category}
                                            </MDBTypography>
                                            <MDBTypography
                                                tag="h6"
                                                className="text-black mb-0"
                                            >
                                                {product.name}
                                            </MDBTypography>
                                        </MDBCol>
                                        <MDBCol
                                            md="3"
                                            lg="3"
                                            xl="3"
                                            className="d-flex align-items-center"
                                        >
                                            {/* BOTÓN MENOS */}
                                            <MDBBtn
                                                color="link"
                                                className="px-2"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        product.id,
                                                        product.quantity - 1,
                                                    )
                                                }
                                            >
                                                <MDBIcon fas icon="minus" />
                                            </MDBBtn>

                                            {/* INPUT */}
                                            <MDBInput
                                                type="number"
                                                readOnly
                                                value={product.quantity}
                                                size="sm"
                                                className="text-center"
                                            />

                                            {/* BOTÓN MÁS */}
                                            <MDBBtn
                                                color="link"
                                                className="px-2"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        product.id,
                                                        product.quantity + 1,
                                                    )
                                                }
                                            >
                                                <MDBIcon fas icon="plus" />
                                            </MDBBtn>
                                        </MDBCol>
                                        <MDBCol
                                            md="3"
                                            lg="2"
                                            xl="2"
                                            className="text-end"
                                        >
                                            <MDBTypography
                                                tag="h6"
                                                className="mb-0"
                                            >
                                                $ {product.price}
                                            </MDBTypography>
                                        </MDBCol>
                                        <MDBCol
                                            md="1"
                                            lg="1"
                                            xl="1"
                                            className="text-end"
                                        >
                                            <a
                                                href="#!"
                                                className="text-muted"
                                                onClick={() =>
                                                    handleRemoveFromCart(
                                                        product.id,
                                                    )
                                                }
                                            >
                                                <MDBIcon fas icon="times" />
                                            </a>
                                        </MDBCol>
                                    </MDBRow>
                                ))}

                                <hr className="my-4" />

                                {/* TOTAL PRICE */}
                                <MDBRow className="d-flex justify-content-end">
                                    <MDBCol
                                        md="3"
                                        lg="2"
                                        xl="2"
                                        className="text-end"
                                    >
                                        <MDBTypography
                                            tag="h6"
                                            className="mb-0"
                                        >
                                            Total: $ {totalPrice}
                                        </MDBTypography>
                                    </MDBCol>
                                </MDBRow>

                                <hr className="my-4" />

                                <div className="pt-5">
                                    <MDBTypography tag="h6" className="mb-0">
                                        <MDBTypography
                                            tag="a"
                                            href="#!"
                                            className="text-body"
                                        >
                                            <MDBIcon
                                                fas
                                                icon="long-arrow-alt-left me-2"
                                            />{" "}
                                            <Link
                                                to="/"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "black",
                                                }}
                                            >
                                                Back to shop
                                            </Link>
                                        </MDBTypography>
                                    </MDBTypography>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}

export default Cart;
