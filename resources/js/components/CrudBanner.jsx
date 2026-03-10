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

function CrudBanner() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    const [search, setSearch] = useState("");
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);

    // --- CARGAR BANNERS ---
    useEffect(() => {
        getBanners();
    }, []);

    const getBanners = () => {
        axios
            .get("/api/banners_index")
            .then((response) => {
                setBanners(response.data);
                setFilteredBanners(response.data);
            })
            .catch((error) => {
                console.error("Error fetching banners:", error);
            });
    };

    // --- BÚSQUEDA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? banners.filter((ban) =>
                  ban.alt_text.toLowerCase().includes(searchText.toLowerCase()),
              )
            : banners;
        setFilteredBanners(filtered);
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
                getBanners();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO Y VALIDACIONES ---
    const [formData, setFormData] = useState({
        image_url: "",
        alt_text: "",
        link_url: "",
        interval: 2000,
    });

    const [errors, setErrors] = useState({
        alt_text: "",
        image_url: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        if (name === "alt_text") {
            newErrors.alt_text = value === "" ? "* Alt text is required" : "";
        }
        if (name === "image_url") {
            newErrors.image_url = value === "" ? "* Image URL is required" : "";
        }
        setErrors(newErrors);
    };

    const isFormValid =
        formData.alt_text !== "" &&
        formData.image_url !== "" &&
        errors.alt_text === "" &&
        errors.image_url === "";

    // --- BOTONES DE CONTROL ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [bannerIdUpdate, setBannerIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const handleButtonAddClick = () => {
        setFormData({
            image_url: "",
            alt_text: "",
            link_url: "",
            interval: 2000,
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- CRUD ACTIONS ---

    const handleAddBanner = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/banners_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding banner.");

            showNotification("Banner added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = (banner) => {
        setFormData({
            image_url: banner.image_url,
            alt_text: banner.alt_text,
            link_url: banner.link_url || "",
            interval: banner.interval || 2000,
        });
        setBannerIdUpdate(banner.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/banners_update/${bannerIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            if (!response.ok) throw new Error("Error updating banner.");

            showNotification("Banner Updated successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/api/banners_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                showNotification("Banner deleted successfully");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            setIsButtonEnabled(true);
            alert("Error deleting banner");
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
                                        placeholder="Search Banners"
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
                    ADD NEW BANNER
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Alt Text</th>
                        <th scope="col">Image URL</th>
                        <th scope="col" className="text-center">
                            Actions
                        </th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredBanners.map((ban) => (
                        <tr key={ban.id}>
                            <th scope="row">{ban.id}</th>
                            <td>{ban.alt_text}</td>
                            <td>{ban.image_url || "No image"}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    style={{ width: "98px" }}
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(ban);
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
                                        handleDelete(ban.id);
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
                            editMode ? handleUpdateBanner : handleAddBanner
                        }
                    >
                        {errors.alt_text && (
                            <p className="error-text">{errors.alt_text}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Banner Title (Alt Text)"
                            id="alt_text"
                            type="text"
                            name="alt_text"
                            value={formData.alt_text}
                            onChange={handleChange}
                        />

                        {errors.image_url && (
                            <p className="error-text">{errors.image_url}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Image URL"
                            id="image_url"
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Link URL (Optional)"
                            id="link_url"
                            type="text"
                            name="link_url"
                            value={formData.link_url}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Interval (ms)"
                            id="interval"
                            type="number"
                            name="interval"
                            value={formData.interval}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            {editMode ? "UPDATE BANNER" : "ADD BANNER"}
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

export default CrudBanner;
