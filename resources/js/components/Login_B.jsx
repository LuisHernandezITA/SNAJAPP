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
        setFormData({ ...formData, [name]: value });

        let errorMsg = "";
        if (value.trim() === "") {
            errorMsg = `* Este campo es requerido`;
        }

        if (
            name === "email" &&
            value !== "" &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ) {
            errorMsg = "* Email inválido";
        }

        if (name === "c_password" && value !== formData.password) {
            errorMsg = "* Las contraseñas no coinciden";
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };

    const isRegisterValid = () => {
        return (
            formData.full_name &&
            formData.email &&
            formData.password &&
            formData.c_password === formData.password &&
            formData.state &&
            formData.municipality &&
            Object.values(errors).every((err) => err === "" || err === null)
        );
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

                // 1. Guardar datos físicos
                document.cookie = `user_id=${userId}; path=/; max-age=86400`;
                localStorage.setItem("token", token);

                // 2. IMPORTANTE: Configurar Axios inmediatamente
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;

                // 3. Actualizar estado global
                await authenticateUser(userId);

                showNotification("¡Bienvenido!");
                navigate("/");
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
                            wrapperClass="mb-4"
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <MDBBtn
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isLoginValid() || !isButtonEnabled}
                        >
                            Sign in
                        </MDBBtn>
                    </form>
                </MDBTabsPane>

                {/* REGISTER */}
                <MDBTabsPane show={justifyActive === "tab2"}>
                    <form onSubmit={handleRegister}>
                        <MDBInput
                            wrapperClass="mb-3"
                            label="Full Name"
                            type="text"
                            name="full_name"
                            onChange={handleChange}
                        />
                        <MDBRow>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-3"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </MDBCol>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-3"
                                    label="Phone"
                                    type="text"
                                    name="phone_number"
                                    onChange={handleChange}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-3"
                                    label="State"
                                    type="text"
                                    name="state"
                                    onChange={handleChange}
                                />
                            </MDBCol>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-3"
                                    label="Municipality"
                                    type="text"
                                    name="municipality"
                                    onChange={handleChange}
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBInput
                            wrapperClass="mb-3"
                            label="Password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                        />
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Confirm Password"
                            type="password"
                            name="c_password"
                            onChange={handleChange}
                        />

                        {errors.c_password && (
                            <p className="text-danger small">
                                {errors.c_password}
                            </p>
                        )}

                        <MDBBtn
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isRegisterValid()}
                        >
                            Sign up
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
