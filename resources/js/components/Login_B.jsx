import React, { useState, useEffect } from "react";
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBInput,
    MDBRow,
    MDBCol,
} from "mdb-react-ui-kit";
import axios from "axios";
import "/resources/css/app.css";
import { useUser } from "./UserContext"; // Importamos el hook
import { useNavigate } from "react-router-dom";

function Login_B() {
    const navigate = useNavigate();
    const { authenticateUser } = useUser(); // Obtenemos la función para actualizar el estado global
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [justifyActive, setJustifyActive] = useState("tab1");
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        c_password: "",
        phone_number: "",
        state: "",
        municipality: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (notificationVisible) {
            setTimeout(() => setNotificationVisible(false), 3000);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    const handleJustifyClick = (value) => {
        if (value !== justifyActive) setJustifyActive(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Actualizamos el estado del formulario primero
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        let errorMsg = "";

        // 1. Validación de campos vacíos
        if (value.trim() === "") {
            errorMsg = `* Este campo es requerido`;
        }
        // 2. Validación específica de Email
        else if (
            name === "email" &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ) {
            errorMsg = "* Email inválido";
        }
        // 3. Validación específica de Teléfono (ejemplo: 10 dígitos)
        else if (name === "phone_number" && !/^\d{10}$/.test(value)) {
            errorMsg = "* El teléfono debe tener 10 dígitos";
        }
        // 4. Validación de Confirmar Contraseña
        else if (name === "c_password" && value !== updatedFormData.password) {
            errorMsg = "* Las contraseñas no coinciden";
        }
        // 5. Si cambias la contraseña original, re-validar la confirmación
        else if (
            name === "password" &&
            formData.c_password !== "" &&
            value !== formData.c_password
        ) {
            setErrors((prev) => ({
                ...prev,
                c_password: "* Las contraseñas no coinciden",
            }));
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };

    const isRegisterValid = () => {
        // Campos requeridos que no deben estar vacíos
        const requiredFields = [
            "full_name",
            "email",
            "phone_number",
            "state",
            "municipality",
            "password",
            "c_password",
        ];

        const allFieldsFilled = requiredFields.every(
            (field) => formData[field] && formData[field].trim() !== "",
        );

        // No debe haber ningún mensaje de error en el objeto errors
        const hasNoErrors = Object.values(errors).every(
            (err) => err === "" || err === null,
        );

        return allFieldsFilled && hasNoErrors;
    };

    const isLoginValid = () => {
        return (
            formData.email &&
            formData.password &&
            !errors.email &&
            !errors.password
        );
    };

    // --- MANEJADOR DE LOGIN MODIFICADO ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email: formData.email,
                    password: formData.password,
                },
            );

            const data = response.data;

            if (data.success) {
                const userId = data.user.id || data.user.user_id;
                const token = data.user.token;

                document.cookie = `user_id=${userId}; path=/; max-age=86400`;
                localStorage.setItem("token", token);
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;

                await authenticateUser(userId);

                showNotification("¡Bienvenido!");

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                showNotification(data.message || "Credenciales incorrectas");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Error de conexión";
            showNotification(msg);
            setIsButtonEnabled(true);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification("¡Registro exitoso! Por favor inicia sesión.");
                setJustifyActive("tab1");
            } else {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    showNotification(firstError);
                } else {
                    showNotification(data.message || "Error en el registro");
                }
            }
        } catch (error) {
            showNotification("Error de red.");
        }
    };

    return (
        <MDBContainer
            className="p-3 my-5 d-flex flex-column w-50"
            style={{ minWidth: "350px" }}
        >
            <MDBTabs pills justify className="mb-3">
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab1")}
                        active={justifyActive === "tab1"}
                    >
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab2")}
                        active={justifyActive === "tab2"}
                    >
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
                {/* LOGIN */}
                <MDBTabsPane show={justifyActive === "tab1"}>
                    <form onSubmit={handleLogin}>
                        <MDBInput
                            wrapperClass="mb-1"
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {/* Validación visual de email en Login */}
                        {errors.email && (
                            <p className="text-danger small mb-3">
                                {errors.email}
                            </p>
                        )}

                        <MDBInput
                            wrapperClass="mb-1"
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {/* Validación visual de campo vacío en Login */}
                        {errors.password && (
                            <p className="text-danger small mb-3">
                                {errors.password}
                            </p>
                        )}

                        <MDBBtn
                            className="mt-3 mb-4 w-100"
                            type="submit"
                            // El botón solo se activa si los campos son válidos y no hay una petición en curso
                            disabled={!isLoginValid() || !isButtonEnabled}
                        >
                            {isButtonEnabled ? "Ingresar" : "Cargando..."}
                        </MDBBtn>
                    </form>
                </MDBTabsPane>

                {/* REGISTER */}
                <MDBTabsPane show={justifyActive === "tab2"}>
                    <form onSubmit={handleRegister}>
                        <MDBInput
                            wrapperClass="mb-1" // Bajamos el margen para mostrar el error debajo
                            label="Nombre Completo"
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                        {errors.full_name && (
                            <p className="text-danger small mb-2">
                                {errors.full_name}
                            </p>
                        )}

                        <MDBRow>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-1"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <p className="text-danger small mb-2">
                                        {errors.email}
                                    </p>
                                )}
                            </MDBCol>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-1"
                                    label="Numero Celular"
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                                {errors.phone_number && (
                                    <p className="text-danger small mb-2">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-1"
                                    label="Estado"
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                                {errors.state && (
                                    <p className="text-danger small mb-2">
                                        {errors.state}
                                    </p>
                                )}
                            </MDBCol>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-1"
                                    label="Municipio"
                                    type="text"
                                    name="municipality"
                                    value={formData.municipality}
                                    onChange={handleChange}
                                />
                                {errors.municipality && (
                                    <p className="text-danger small mb-2">
                                        {errors.municipality}
                                    </p>
                                )}
                            </MDBCol>
                        </MDBRow>

                        <MDBInput
                            wrapperClass="mb-1"
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="text-danger small mb-2">
                                {errors.password}
                            </p>
                        )}

                        <MDBInput
                            wrapperClass="mb-1"
                            label="Confirmar Contraseña"
                            type="password"
                            name="c_password"
                            value={formData.c_password}
                            onChange={handleChange}
                        />
                        {errors.c_password && (
                            <p className="text-danger small mb-2">
                                {errors.c_password}
                            </p>
                        )}

                        <MDBBtn
                            className="mt-3 mb-4 w-100"
                            type="submit"
                            disabled={!isRegisterValid()}
                        >
                            Registrar
                        </MDBBtn>
                    </form>
                </MDBTabsPane>
            </MDBTabsContent>

            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </MDBContainer>
    );
}

export default Login_B;
