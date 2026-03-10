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

function CrudCategory() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    // --- CARGAR CATEGORÍAS ---
    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axios
            .get("/api/category_index")
            .then((response) => {
                setCategories(response.data);
                setFilteredCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    // --- BÚSQUEDA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? categories.filter(
                  (cat) =>
                      cat.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      (cat.description &&
                          cat.description
                              .toLowerCase()
                              .includes(searchText.toLowerCase())),
              )
            : categories;
        setFilteredCategories(filtered);
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
                // Aquí podrías decidir si recargar o no.
                // Para mantener consistencia con tu código:
                getCategories();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO Y VALIDACIONES ---
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState({
        name: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        if (name === "name") {
            newErrors.name = value === "" ? "* Name is required" : "";
        }
        setErrors(newErrors);
    };

    const isFormValid = formData.name !== "" && errors.name === "";

    // --- BOTONES DE CONTROL ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [categoryIdUpdate, setCategoryIdUpdate] = useState(null);

    const handleButtonAddClick = () => {
        setFormData({ name: "", description: "" });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- CRUD ACTIONS ---

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/categories_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding category.");

            showNotification("Category added successfully");
            setShowAddForm(false);

            // REHABILITAR BOTONES
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || "",
        });
        setCategoryIdUpdate(category.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/categories_update/${categoryIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            if (!response.ok) throw new Error("Error updating category.");

            showNotification("Category Updated successfully");
            setShowAddForm(false);

            // REHABILITAR BOTONES
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            // REHABILITAR EN CASO DE ERROR PARA PODER REINTENTAR
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `/api/categories_destroy/${id}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            if (response.status === 200) {
                showNotification("Category deleted successfully");
                // Nota: El showNotification que tienes recarga la página,
                // pero es buena práctica habilitarlos aquí también por si acaso.
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            // Si hay un error, los habilitamos para que el usuario pueda reintentar
            setIsButtonEnabled(true);
            alert("Error deleting category");
        }
    };

    return (
        <>
            <br />
            <div className="d-flex">
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
                                            <path d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z" />
                                            <path d="M16.853 16.854a.5.5 0 0 0 .707 0l3.793-3.793a.5.5 0 0 0 0-.707l-3.793-3.793a.5.5 0 0 0-.707.707L19.293 12H10.5a.5.5 0 0 0 0 1h8.793l-2.646 2.646a.5.5 0 0 0 0 .707z" />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        className="me-2"
                                        placeholder="Search Categories"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>

                <MDBBtn
                    class={`custom-button ${!isButtonAddEnabled ? "clicked" : ""}`}
                    size="lg"
                    className="mb-4 w-100"
                    type="submit"
                    disabled={!isButtonAddEnabled}
                    onClick={handleButtonAddClick}
                >
                    ADD NEW CATEGORY
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col" className="text-center">
                            Actions
                        </th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredCategories.map((cat) => (
                        <tr key={cat.id}>
                            <th scope="row">{cat.id}</th>
                            <td>{cat.name}</td>
                            <td>{cat.description || "No description"}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    style={{ width: "98px" }}
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(cat);
                                    }}
                                >
                                    EDIT
                                </MDBBtn>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleDelete(cat.id);
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
                }}
            >
                <Modal.Header
                    className={editMode ? "bg-primary" : "bg-warning"}
                ></Modal.Header>
                <Modal.Body>
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "80%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "20px",
                        }}
                    />
                    <form
                        onSubmit={
                            editMode ? handleUpdateCategory : handleAddCategory
                        }
                    >
                        {errors.name && (
                            <p className="error-text">{errors.name}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Category Name"
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Description"
                            id="description"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            {editMode ? "UPDATE CATEGORY" : "ADD CATEGORY"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>

            {/* NOTIFICATION UI */}
            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </>
    );
}

export default CrudCategory;
