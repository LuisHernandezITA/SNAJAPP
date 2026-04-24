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
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

function CrudMusic() {
    const { userInfo } = useUser();

    // 1. Obtenemos los detalles (manejando si vienen anidados o no)
    const userDetails = userInfo?.user || userInfo;

    // 2. Validamos el ROL (que es lo que realmente tienes en la DB)
    // Si el rol es 1, es admin.
    const userAdmin = userInfo && Number(userDetails?.role) === 1;

    if (!userAdmin) {
        // Si no es admin, o userInfo es null, redirigimos
        return <Navigate to="/" />;
    }

    // 3. Obtenemos el token del lugar correcto
    const accessToken = userInfo?.token || "";
    const [search, setSearch] = useState("");
    const [music, setMusic] = useState([]);
    const [filteredMusic, setFilteredMusic] = useState([]);

    // --- CARGAR MÚSICA ---
    useEffect(() => {
        getMusic();
    }, []);

    const getMusic = () => {
        axios
            .get("/api/music_index")
            .then((response) => {
                setMusic(response.data);
                setFilteredMusic(response.data);
            })
            .catch((error) => {
                console.error("Error fetching music:", error);
            });
    };

    // --- BÚSQUEDA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? music.filter(
                  (m) =>
                      m.nombre
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      m.artista
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
              )
            : music;
        setFilteredMusic(filtered);
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
                getMusic();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO Y VALIDACIONES ---
    const [formData, setFormData] = useState({
        nombre: "",
        artista: "",
        etiqueta: "",
        urlmusic: "",
        image: "",
    });

    const [errors, setErrors] = useState({
        nombre: "",
        artista: "",
        urlmusic: "",
        image: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        if (name !== "etiqueta") {
            newErrors[name] = value === "" ? `* ${name} is required` : "";
        }
        setErrors(newErrors);
    };

    const isFormValid =
        formData.nombre !== "" &&
        formData.artista !== "" &&
        formData.urlmusic !== "" &&
        formData.image !== "";

    // --- BOTONES DE CONTROL ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [musicIdUpdate, setMusicIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const handleButtonAddClick = () => {
        setFormData({
            nombre: "",
            artista: "",
            etiqueta: "",
            urlmusic: "",
            image: "",
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- CRUD ACTIONS ---

    const handleAddMusic = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/music_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding music.");

            showNotification("Music added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = (song) => {
        setFormData({
            nombre: song.nombre,
            artista: song.artista,
            etiqueta: song.etiqueta || "",
            urlmusic: song.urlmusic,
            image: song.image,
        });
        setMusicIdUpdate(song.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateMusic = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/music_update/${musicIdUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error updating music.");

            showNotification("Music Updated successfully");
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
            const response = await axios.delete(`/api/music_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                showNotification("Music deleted successfully");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            setIsButtonEnabled(true);
            alert("Error deleting music");
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
                                        placeholder="Search Music"
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
                    ADD NEW MUSIC
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead
                    style={{ backgroundColor: "#f46112", color: "white" }}
                >
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Artista</th>
                        <th scope="col" className="text-center">
                            Actions
                        </th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredMusic.map((m) => (
                        <tr key={m.id}>
                            <th scope="row">{m.id}</th>
                            <td>{m.nombre}</td>
                            <td>{m.artista}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    style={{ width: "98px" }}
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(m);
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
                                        handleDelete(m.id);
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
                        onSubmit={editMode ? handleUpdateMusic : handleAddMusic}
                    >
                        {errors.nombre && (
                            <p className="error-text">{errors.nombre}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Song Name"
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        {errors.artista && (
                            <p className="error-text">{errors.artista}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Artist"
                            id="artista"
                            type="text"
                            name="artista"
                            value={formData.artista}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Genre / Tag (Optional)"
                            id="etiqueta"
                            type="text"
                            name="etiqueta"
                            value={formData.etiqueta}
                            onChange={handleChange}
                        />

                        {errors.urlmusic && (
                            <p className="error-text">{errors.urlmusic}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Music URL (MP3)"
                            id="urlmusic"
                            type="text"
                            name="urlmusic"
                            value={formData.urlmusic}
                            onChange={handleChange}
                        />

                        {errors.image && (
                            <p className="error-text">{errors.image}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Image URL"
                            id="image"
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            {editMode ? "UPDATE MUSIC" : "ADD MUSIC"}
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

export default CrudMusic;
