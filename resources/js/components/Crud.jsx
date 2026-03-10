import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
} from "mdb-react-ui-kit";
import {
    Form,
    FormControl,
    InputGroup,
    Container,
    Row,
    Col,
    Modal,
} from "react-bootstrap";
import "/resources/css/app.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

function Crud() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    // --- ESTADOS ---
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [productIdUpdate, setProductIdUpdate] = useState(null);

    // --- CARGAR DATOS (FUNCIÓN REUTILIZABLE) ---
    const getProducts = () => {
        axios
            .get("/api/products_index")
            .then((response) => {
                setProducts(response.data);
                // Cambio clave: Sincronizar la tabla filtrada de inmediato
                setFilteredProducts(response.data);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        getProducts();
    }, []);

    // --- BÚSQUEDA AUTOMÁTICA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? products.filter(
                  (p) =>
                      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
                      p.description
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
              )
            : products;
        setFilteredProducts(filtered);
    };

    // --- NOTIFICACIONES ---
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
                // En lugar de recargar la página, refrescamos los datos
                getProducts();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO ---
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        available_stock: "",
        images: "",
        available: false,
        category_id: "",
    });

    const [selectedColors, setSelectedColors] = useState([]);
    const [sizeFormData, setSizeFormData] = useState({ sizes: [] });
    const [errors, setErrors] = useState({});

    // --- HANDLERS ---
    const handleButtonClick = () => setIsButtonEnabled(false);

    const handleButtonAddClick = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            available_stock: "",
            images: "",
            available: false,
            category_id: "",
        });
        setSelectedColors([]);
        setSizeFormData({ sizes: [] });
        setEditMode(false);
        setIsButtonAddEnabled(false);
        setShowAddForm(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (name === "colors") {
                const colorId = parseInt(value, 10);
                setSelectedColors((prevColors) => {
                    if (checked) {
                        return [...prevColors, colorId];
                    } else {
                        return prevColors.filter((id) => id !== colorId);
                    }
                });
            } else if (name === "sizes") {
                setSizeFormData((prevData) => ({
                    ...prevData,
                    sizes: checked
                        ? [...prevData.sizes, parseInt(value, 10)]
                        : prevData.sizes.filter(
                              (id) => id !== parseInt(value, 10),
                          ),
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }

        const newErrors = { ...errors };

        const isEmpty = (value) => value === "";

        switch (name) {
            case "name":
            case "description":
            case "images":
                newErrors[name] = isEmpty(value)
                    ? `* ${
                          name.charAt(0).toUpperCase() + name.slice(1)
                      } is required`
                    : "";
                break;

            case "price":
                newErrors[name] = isEmpty(value)
                    ? "* Price is required"
                    : !/^\d+(\.\d{1,2})?$/.test(value)
                      ? "* Invalid price format. Only numbers allowed."
                      : "";
                break;

            case "available_stock":
                newErrors[name] = isEmpty(value)
                    ? "* Stock is required"
                    : !/^\d+$/.test(value)
                      ? "* Invalid stock format. Only integers allowed."
                      : "";
                break;

            case "category":
                newErrors.category = isEmpty(value)
                    ? "* Category is required"
                    : "";
                if (!isEmpty(value)) {
                    const selectedCategoryId = parseInt(value, 10);
                    setFormData({
                        ...formData,
                        category_id: selectedCategoryId,
                    });
                } else {
                    setFormData({ ...formData, category_id: "" });
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleColorChange = (colorId) => {
        // ADD OR REMOVE COLORS FROM COLORLIST
        if (selectedColors.includes(colorId)) {
            setSelectedColors(selectedColors.filter((id) => id !== colorId));
        } else {
            setSelectedColors([...selectedColors, colorId]);
        }
    };

    const handleSwitchChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            available: !prevData.available,
        }));
    };

    //CATEGORYLIST
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        axios
            .get("api/category_index")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCategoryOptions(response.data);
                } else {
                    console.error(
                        "Unexpected data format for categories:",
                        response.data,
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    //COLORLIST & SIZELIST

    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);

    useEffect(() => {
        // COLORLIST
        axios
            .get("/api/color_index")
            .then((response) => {
                setColorOptions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching color options:", error);
            });

        // SIZELIST
        axios
            .get("/api/size_index")
            .then((response) => {
                setSizeOptions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching size options:", error);
            });
    }, []);

    const isFormValid =
        Object.values(errors).every((error) => error === "") &&
        Object.keys(formData).every((key) => {
            const value = formData[key];
            return key === "images" ? value !== "" : value !== "";
        });

    //ADD PRODUCT

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            // ADD PRODUCT
            const productResponse = await fetch("api/products_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!productResponse.ok) {
                throw new Error("Error adding product. Check your data.");
            }

            const productData = await productResponse.json();
            const productId = productData.id;

            // VERIFIES SELECTED COLOR
            if (selectedColors.length > 0) {
                // ADD RELATION BETWEEN PRODUCT AND COLOR
                const colorResponse = await fetch("api/productcolors_store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        color_ids: selectedColors,
                    }),
                });

                if (!colorResponse.ok) {
                    throw new Error(
                        "Error adding product colors. Check your data.",
                    );
                }
            }

            // VERIFIES SELECTED SIZES
            if (sizeFormData.sizes.length > 0) {
                // ADD RELATION BETWEEN PRODUCT AND SIZE
                const sizeResponse = await fetch("api/productsizes_store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        size_ids: sizeFormData.sizes,
                    }),
                });

                if (!sizeResponse.ok) {
                    throw new Error(
                        "Error adding product sizes. Check your data.",
                    );
                }
            }

            showNotification("Product added successfully");
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            getProducts();

            setShowAddForm(false);
        } catch (error) {
            showNotification(error.message || "Network error.");
        }
    };

    // EDIT

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`/api/products/${id}/edit`);
            const productData = response.data;

            setFormData({
                name: productData.name,
                description: productData.description,
                category_id: productData.category_id,
                price: productData.price,
                available_stock: productData.available_stock,
                images: productData.images,
                available: productData.available,
            });
            setProductIdUpdate(id);
            setEditMode(true);
            setShowAddForm(true);
        } catch (error) {
            console.error("Error loading product data", error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            // UPDATE PRODUCT
            const response = await fetch(
                `/api/products_update/${productIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            if (!response.ok) {
                throw new Error("Error updating product. Check your data.");
            }

            // DELETES RELATIONS BETWEEN PRODUCT AND COLORS
            try {
                await axios.delete(
                    `api/productcolors_destroy/${productIdUpdate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
            } catch (error) {
                console.error("Error deleting product colors", error);
            }

            // ADD NEW RELATIONS BETWEEN PRODUCT AND COLORS
            try {
                if (selectedColors.length > 0) {
                    await axios.post(
                        "api/productcolors_store",
                        {
                            product_id: productIdUpdate,
                            color_ids: selectedColors,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );
                }
            } catch (error) {
                console.error("Error adding product colors", error);
            }

            // DELETES RELATIONS BETWEEN PRODUCT AND SIZES
            try {
                await axios.delete(
                    `api/productsizes_destroy/${productIdUpdate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
            } catch (error) {
                console.error("Error deleting product sizes", error);
            }

            // ADD NEW RELATIONS BETWEEN PRODUCT AND SIZES
            try {
                if (sizeFormData.sizes.length > 0) {
                    await axios.post(
                        "api/productsizes_store",
                        {
                            product_id: productIdUpdate,
                            size_ids: sizeFormData.sizes,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );
                }
            } catch (error) {
                console.error("Error adding product sizes", error);
            }

            showNotification("Product Updated successfully");
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            getProducts();
            setEditMode(false);
            setShowAddForm(false);
        } catch (error) {
            showNotification(error.message || "Network error.");
        }
    };

    // DELETE

    const handleDelete = async (productId) => {
        try {
            // DELETES RELATIONS FIRST
            await axios.delete(`api/productcolors_destroy/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            await axios.delete(`api/productsizes_destroy/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // DELETES PRINCIPAL PRODUCT
            const deleteResponse = await axios.delete(
                `api/products_destroy/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (deleteResponse.status === 200) {
                showNotification("Product deleted successfully");
            } else {
                showNotification("Error deleting product");
            }
        } catch (error) {
            console.error("Network error or server issue", error);
        }
    };

    return (
        <>
            <br></br>
            <div className="d-flex ">
                <Container className="mt-5">
                    <Row>
                        <Col sm={4}>
                            <Form className="d-flex">
                                <InputGroup>
                                    <InputGroup.Text className="bg-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M16.853 16.854a.5.5 0 0 0 .707 0l3.793-3.793a.5.5 0 0 0 0-.707l-3.793-3.793a.5.5 0 0 0-.707.707L19.293 12H10.5a.5.5 0 0 0 0 1h8.793l-2.646 2.646a.5.5 0 0 0 0 .707z"
                                            />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        className="me-2"
                                        placeholder="Search"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>

                <MDBBtn
                    class={`custom-button ${
                        !isButtonAddEnabled ? "clicked" : ""
                    }`}
                    size="lg"
                    className="mb-4 w-100"
                    type="submit"
                    disabled={!isButtonAddEnabled}
                    onClick={handleButtonAddClick}
                >
                    ADD NEW PRODUCT
                </MDBBtn>
            </div>
            <br></br>

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Images</th>
                        <th scope="col">Date</th>
                        <th scope="col">Available</th>
                        <th scope="col">Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <th scope="row">{product.id}</th>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category_id}</td>
                            <td>{product.price}</td>
                            <td>{product.available_stock}</td>
                            <td>{product.images}</td>
                            <td>{product.addition_date}</td>
                            <td>{product.available}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    style={{ width: "98px" }}
                                    className="mb-4 w-100"
                                    type="submit"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(product.id);
                                    }}
                                >
                                    EDIT
                                </MDBBtn>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    type="submit"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleDelete(product.id);
                                    }}
                                >
                                    DELETE
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* MODAL | ADD & UPDATE */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
                    // ENABLES BUTTON AGAIN
                }}
            >
                <Modal.Header
                    className={editMode ? "bg-primary" : "bg-warning"}
                ></Modal.Header>
                <Modal.Body>
                    <img
                        src="\img\logosmc.svg"
                        alt="Descripción de la imagen"
                        style={{
                            maxWidth: "80%",
                            maxHeight: "80%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "20px",
                        }}
                    />
                    {/* FORM */}
                    <form
                        onSubmit={
                            editMode ? handleUpdateProduct : handleAddProduct
                        }
                    >
                        {errors.name && (
                            <p className="error-text">{errors.name}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Name"
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.description && (
                            <p className="error-text">{errors.description}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Description"
                            id="description"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        {errors.price && (
                            <p className="error-text">{errors.price}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Price"
                            id="price"
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        {errors.available_stock && (
                            <p className="error-text">
                                {errors.available_stock}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Available Stock"
                            id="available_stock"
                            type="text"
                            name="available_stock"
                            value={formData.available_stock}
                            onChange={handleChange}
                        />
                        {errors.images && (
                            <p className="error-text">{errors.images}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Images"
                            id="images"
                            type="text"
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                        />
                        {errors.category && (
                            <p className="error-text">{errors.category}</p>
                        )}
                        <label htmlFor="category">Category:</label>
                        <select
                            className="form-control"
                            id="category"
                            name="category"
                            value={formData.category_id}
                            onChange={handleChange}
                        >
                            <option value="" hidden>
                                Select a category
                            </option>
                            {categoryOptions.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <br></br>
                        {/* Color List */}
                        <label>Color (Optional):</label>
                        {colorOptions.map((color) => (
                            <div key={color.id} className="form-check">
                                <input
                                    type="checkbox"
                                    id={`color-${color.id}`}
                                    name="colors"
                                    value={color.id}
                                    checked={selectedColors.includes(color.id)}
                                    onChange={() => handleColorChange(color.id)}
                                    className="form-check-input"
                                />
                                <label
                                    htmlFor={`color-${color.id}`}
                                    className="form-check-label"
                                >
                                    {color.name}
                                </label>
                            </div>
                        ))}

                        {/* Size List */}
                        <label>Size (Optional):</label>
                        {sizeOptions.map((size) => (
                            <div key={size.id} className="form-check">
                                <input
                                    type="checkbox"
                                    id={`size-${size.id}`}
                                    name="sizes"
                                    value={size.id}
                                    checked={sizeFormData.sizes.includes(
                                        size.id,
                                    )}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                <label
                                    htmlFor={`size-${size.id}`}
                                    className="form-check-label"
                                >
                                    {size.name}
                                </label>
                            </div>
                        ))}
                        <br></br>
                        {errors.available && (
                            <p className="error-text">{errors.available}</p>
                        )}
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Available"
                            name="available"
                            checked={formData.available}
                            onChange={handleSwitchChange}
                        />
                        <br></br>

                        {editMode ? (
                            <MDBBtn
                                class={`custom-button`}
                                size="lg"
                                className="mb-4 w-100"
                                type="submit"
                                disabled={!isFormValid}
                            >
                                UPDATE PRODUCT
                            </MDBBtn>
                        ) : (
                            <MDBBtn
                                class={`custom-button`}
                                size="lg"
                                className="mb-4 w-100"
                                type="submit"
                                disabled={!isFormValid}
                            >
                                ADD PRODUCT
                            </MDBBtn>
                        )}
                    </form>
                </Modal.Body>
            </Modal>

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
        </>
    );
}

export default Crud;
