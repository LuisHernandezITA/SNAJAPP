import React, { useState, useEffect } from "react";
import { Spinner, Navbar, Nav, Container } from "react-bootstrap";
import axios from "axios";
import Card_C from "./Card_C";
import "/resources/css/app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function ListCard() {
    const [productData, setProductData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortByPrice, setSortByPrice] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/products_index", // Antes localhost
                );
                setProductData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/category_index",
                );
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        fetchCategories();
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleSortByPrice = () => {
        setSortByPrice((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
    };

    const getFilteredProducts = () => {
        let filteredProducts;
        if (selectedCategory === null) {
            filteredProducts = [...productData];
        } else {
            filteredProducts = productData.filter(
                (product) => product.category_id === selectedCategory,
            );
        }

        if (sortByPrice === "asc") {
            return filteredProducts.sort(
                (a, b) => parseFloat(a.price) - parseFloat(b.price),
            );
        } else if (sortByPrice === "desc") {
            return filteredProducts.sort(
                (a, b) => parseFloat(b.price) - parseFloat(a.price),
            );
        } else {
            return filteredProducts;
        }
    };

    if (productData.length === 0 || categories.length === 0) {
        return (
            <div className="d-flex flex-wrap justify-content-center">
                <Spinner animation="border" role="status">
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
                    backgroundColor: "rgb(227, 89, 25)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                className="shadow-sm py-3 w-100"
            >
                <Container className="px-4">
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        className="border-0 custom-toggler d-flex align-items-center"
                    >
                        <span
                            className="institutional-text"
                            style={{
                                fontSize: "1.2rem",
                                letterSpacing: "4px",
                                opacity: "0.8",
                                fontWeight: "300",
                            }}
                        >
                            CURSOS
                        </span>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link
                                onClick={() => handleCategoryChange(null)}
                                className="text-uppercase small"
                            >
                                Todos
                            </Nav.Link>
                            {categories.map((category) => (
                                <Nav.Link
                                    key={category.id}
                                    className="text-uppercase small"
                                    onClick={() =>
                                        handleCategoryChange(category.id)
                                    }
                                >
                                    {category.name}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link
                                onClick={handleSortByPrice}
                                className="small"
                            >
                                Sort by Price{" "}
                                {sortByPrice === "asc" ? (
                                    <FontAwesomeIcon
                                        icon={faArrowDown}
                                        className="ms-1"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faArrowUp}
                                        className="ms-1"
                                    />
                                )}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* CONTENEDOR CORREGIDO: Igual a ListCardNewest */}
            <div
                className="d-flex flex-wrap justify-content-center px-2"
                style={{
                    gap: "20px",
                    padding: "40px 0",
                    width: "100%" /* Quitamos el truco de 100vw para que se comporte igual que el Newest */,
                }}
            >
                {getFilteredProducts().map((product) => (
                    <div
                        key={product.id}
                        className="card-wrapper" /* Usamos la clase que te gusta de Newest */
                        style={{ margin: "10px" }}
                    >
                        <Card_C {...product} />
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
}

export default ListCard;
