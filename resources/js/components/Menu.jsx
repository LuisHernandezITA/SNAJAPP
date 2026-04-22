import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet } from "react-router-dom";
import "/resources/css/app.css";
import Carrousel from "./Carrousel";
import React, { useState, useEffect } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import ListCardNewest from "./ListCardNewest";

function Menu() {
    const { userInfo, loading, logout } = useUser();
    const location = useLocation();

    // Simplificación total de la detección
    const userDetails = userInfo?.user || userInfo;
    const userAdmin = userInfo && Number(userDetails?.role) === 1;
    const userName = userDetails?.full_name || userDetails?.name || "";

    // Si está cargando la autenticación, podrías mostrar un spinner o nada
    if (loading) return null;

    const [showCarousel, setShowCarousel] = useState(true);
    console.log("¿Qué hay en userInfo?", userInfo); // Obtén la información del usuario desde el contexto.

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    //NOTIFICATIONS

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    const handleLogout = () => {
        // 2. Llama a la función logout del contexto (ella ya borra cookies y limpia userInfo)
        logout();

        // 3. Notificación y redirección
        showNotification("Sesión cerrada exitosamente");

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const hideListCardNewest =
        location.pathname === "/store" || location.pathname === "/music";

    useEffect(() => {
        // VERIFIES LOCATION "Login_B"
        if (
            location.pathname === "/login" ||
            location.pathname === "/cart" ||
            location.pathname === "/products" ||
            location.pathname === "/categories" ||
            location.pathname === "/banners" ||
            location.pathname === "/songs" ||
            location.pathname.startsWith("/item")
        ) {
            setShowCarousel(false);
        } else {
            setShowCarousel(true);
        }
    }, [location]);

    console.log("¿Es Admin?", userAdmin, "Rol actual:", userDetails?.role);

    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                fixed="top" // Mantiene el navbar siempre arriba
                variant="dark"
                className={
                    scrolled ? "navbar-custom scrolled" : "navbar-custom"
                } // Clase personalizada para el CSS
            >
                <Container>
                    <Navbar.Brand as={Link} to="">
                        <img
                            alt="Logo"
                            src="/img/acjuvenil.png"
                            width="130"
                            height="55"
                            className="d-inline-block align-top logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="responsive-navbar-nav"
                        className="custom-toggler-icon"
                    />

                    {/* CONTENIDO COLAPSABLE */}
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            {/* LÓGICA DE USUARIO / ADMIN */}
                            {userName ? (
                                userAdmin ? (
                                    <>
                                        <Nav.Link>{userName} Mode</Nav.Link>
                                        <Nav.Link as={Link} to="songs">
                                            Songs
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="banners">
                                            Banners
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="categories">
                                            Categories
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="products">
                                            Products
                                        </Nav.Link>
                                    </>
                                ) : (
                                    <Nav.Link>Hi, {userName}</Nav.Link>
                                )
                            ) : null}

                            {/* ENLACES GENERALES */}
                            <Nav.Link as={Link} to="">
                                Inicio
                            </Nav.Link>
                            <Nav.Link as={Link} to="music">
                                Normatividad
                            </Nav.Link>
                            <Nav.Link as={Link} to="store">
                                Cursos
                            </Nav.Link>

                            {/* ICONOS DE ACCIÓN (LOGIN/LOGOUT Y CARRITO) */}

                            <div className="d-flex align-items-center gap-3 px-3">
                                <Nav.Link
                                    as={Link}
                                    to="cart"
                                    title="Shopping Cart"
                                >
                                    <MDBIcon
                                        fas
                                        icon="shopping-cart"
                                        className="icon"
                                    />
                                </Nav.Link>
                                {userName ? (
                                    <Nav.Link
                                        onClick={handleLogout}
                                        title="Logout"
                                    >
                                        <MDBIcon
                                            fas
                                            icon="user-slash"
                                            className="icon"
                                        />
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link
                                        as={Link}
                                        to="login"
                                        title="Login"
                                    >
                                        <MDBIcon
                                            fas
                                            icon="user"
                                            className="icon"
                                        />
                                    </Nav.Link>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* NOTIFICACIONES (FUERA DEL NAVBAR) */}
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
            {showCarousel && <Carrousel />}
            {!hideListCardNewest && showCarousel && <ListCardNewest />}
            {!hideListCardNewest && showCarousel && (
                <div className="text-center mb-5">
                    {" "}
                    <Link to="/store" className="ver-todo-link">
                        SEE ALL <i className="fas fa-eye"></i>
                    </Link>
                </div>
            )}{" "}
            <section>
                <Container fluid className="px-0">
                    <Outlet></Outlet>
                </Container>
            </section>
            <Footer />
        </>
    );
}

export default Menu;
