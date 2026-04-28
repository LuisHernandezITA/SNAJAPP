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

function CrudUsers() {
    const { userInfo } = useUser();
    const userDetails = userInfo?.user || userInfo;
    const userAdmin = userInfo && Number(userDetails?.role) === 1;
    const accessToken = userInfo?.token || "";

    if (!userAdmin) return <Navigate to="/" />;

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Formulario completo para edición
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        role: 0,
        phone_number: "",
        dob: "",
        address: "",
        state: "",
        municipality: "",
        section: "",
        voter_key: "",
        curp: "",
        ocr_id: "",
        id_card_front: "",
        id_card_back: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [userIdUpdate, setUserIdUpdate] = useState(null);
    const [notification, setNotification] = useState(null);

    // Helper para mostrar el nombre del rol
    const getRoleName = (role) => {
        const r = Number(role);
        if (r === 1) return "Administrador";
        if (r === 2) return "Formador";
        return "Juvenil";
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        axios
            .get("/api/user_index", {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch((err) => console.error(err));
    };

    const handleSearchChange = (e) => {
        const text = e.target.value.toLowerCase();
        setSearch(text);
        const filtered = users.filter(
            (u) =>
                u.full_name.toLowerCase().includes(text) ||
                u.email.toLowerCase().includes(text),
        );
        setFilteredUsers(filtered);
    };

    const handleEdit = (user) => {
        setFormData({
            full_name: user.full_name || "",
            email: user.email || "",
            role: user.role ?? 0,
            phone_number: user.phone_number || "",
            // CORRECCIÓN AQUÍ: Extraemos solo los primeros 10 caracteres (YYYY-MM-DD)
            dob: user.dob ? user.dob.substring(0, 10) : "",
            address: user.address || "",
            state: user.state || "",
            municipality: user.municipality || "",
            section: user.section || "",
            voter_key: user.voter_key || "",
            curp: user.curp || "",
            ocr_id: user.ocr_id || "",
            id_card_front: user.id_card_front || "",
            id_card_back: user.id_card_back || "",
        });
        setUserIdUpdate(user.id);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `/api/user_update_admin/${userIdUpdate}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );
            setShowModal(false);
            setNotification("Usuario actualizado");
            getUsers();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el usuario");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            await axios.delete(`/api/user_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            getUsers();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-4">
                <Col md={8}>
                    <h3>Panel de Control: Usuarios</h3>
                    {notification && (
                        <div className="alert alert-success">
                            {notification}
                        </div>
                    )}
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por nombre o correo..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <MDBTable align="middle" hover responsive>
                <MDBTableHead className="bg-dark text-white">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Ubicación</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredUsers.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.full_name}</td>
                            <td>{u.email}</td>
                            <td>
                                {u.municipality}, {u.state}
                            </td>
                            <td>
                                <span
                                    className={`badge ${u.role === 1 ? "bg-danger" : u.role === 2 ? "bg-warning text-dark" : "bg-primary"}`}
                                >
                                    {getRoleName(u.role)}
                                </span>
                            </td>
                            <td>
                                <MDBBtn
                                    color="info"
                                    size="sm"
                                    onClick={() => handleEdit(u)}
                                    className="me-2"
                                >
                                    Editar
                                </MDBBtn>
                                <MDBBtn
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    Borrar
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* MODAL DE EDICIÓN COMPLETO */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        Expediente Completo de Usuario: {formData.full_name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        {/* SECCIÓN 1: DATOS GENERALES */}
                        <h6 className="text-primary mb-3">
                            Información de Cuenta y Contacto
                        </h6>
                        <Row>
                            <Col md={4}>
                                <MDBInput
                                    label="Nombre Completo"
                                    className="mb-3"
                                    value={formData.full_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            full_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <MDBInput
                                    label="Correo Electrónico"
                                    className="mb-3"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <MDBInput
                                    label="Teléfono"
                                    className="mb-3"
                                    value={formData.phone_number}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone_number: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>
                                        <small>Rol del Sistema</small>
                                    </Form.Label>
                                    <Form.Select
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                role: Number(e.target.value),
                                            })
                                        }
                                    >
                                        <option value={0}>
                                            Juvenil (Usuario)
                                        </option>
                                        <option value={2}>Formador</option>
                                        <option value={1}>Administrador</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <MDBInput
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    className="mt-4"
                                    value={formData.dob}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            dob: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>

                        <hr />

                        {/* SECCIÓN 2: DATOS DE IDENTIFICACIÓN (OCR) */}
                        <h6 className="text-primary mb-3">
                            Datos de Identificación Oficial (INE)
                        </h6>
                        <Row>
                            <Col md={3}>
                                <MDBInput
                                    label="CURP"
                                    className="mb-3"
                                    value={formData.curp}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            curp: e.target.value.toUpperCase(),
                                        })
                                    }
                                />
                            </Col>
                            <Col md={3}>
                                <MDBInput
                                    label="Clave de Elector"
                                    className="mb-3"
                                    value={formData.voter_key}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            voter_key:
                                                e.target.value.toUpperCase(),
                                        })
                                    }
                                />
                            </Col>
                            <Col md={3}>
                                <MDBInput
                                    label="Sección"
                                    className="mb-3"
                                    value={formData.section}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={3}>
                                <MDBInput
                                    label="OCR ID / Identificador"
                                    className="mb-3"
                                    value={formData.ocr_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            ocr_id: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>

                        <hr />

                        {/* SECCIÓN 3: UBICACIÓN */}
                        <h6 className="text-primary mb-3">Domicilio Actual</h6>
                        <Row>
                            <Col md={4}>
                                <MDBInput
                                    label="Estado"
                                    className="mb-3"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            state: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <MDBInput
                                    label="Municipio"
                                    className="mb-3"
                                    value={formData.municipality}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            municipality: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <MDBInput
                                    label="Dirección Completa"
                                    className="mb-3"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>

                        <hr />

                        {/* SECCIÓN 4: DOCUMENTACIÓN (RUTAS) */}
                        <h6 className="text-primary mb-3">
                            Documentación Digital
                        </h6>
                        <Row>
                            <Col md={6}>
                                <MDBInput
                                    label="Ruta Imagen Frontal (INE)"
                                    className="mb-2"
                                    value={formData.id_card_front}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            id_card_front: e.target.value,
                                        })
                                    }
                                />
                                {formData.id_card_front && (
                                    <small className="text-muted">
                                        Archivo actual:{" "}
                                        {formData.id_card_front
                                            .split("/")
                                            .pop()}
                                    </small>
                                )}
                            </Col>
                            <Col md={6}>
                                <MDBInput
                                    label="Ruta Imagen Trasera (INE)"
                                    className="mb-2"
                                    value={formData.id_card_back}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            id_card_back: e.target.value,
                                        })
                                    }
                                />
                                {formData.id_card_back && (
                                    <small className="text-muted">
                                        Archivo actual:{" "}
                                        {formData.id_card_back.split("/").pop()}
                                    </small>
                                )}
                            </Col>
                        </Row>

                        <div className="text-end mt-4">
                            <MDBBtn
                                color="secondary"
                                onClick={() => setShowModal(false)}
                                className="me-2"
                            >
                                Cerrar
                            </MDBBtn>
                            <MDBBtn type="submit" color="success">
                                Actualizar Expediente
                            </MDBBtn>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default CrudUsers;
