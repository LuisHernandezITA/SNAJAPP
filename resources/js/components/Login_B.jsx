import React, { useState, useEffect } from "react";
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox,
} from "mdb-react-ui-kit";
import "/resources/css/app.css";

function Login_B() {
    //NOTIFICATIONS

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    //TABS

    const [justifyActive, setJustifyActive] = useState("tab1");

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }

        setJustifyActive(value);
    };

    //VALIDATIONS

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };

        if (name === "name") {
            newErrors[name] = value.trim() === "" ? "* Name is required" : "";
        } else if (name === "email") {
            newErrors[name] =
                value.trim() === ""
                    ? "* Email is required"
                    : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                      ? "* Invalid email address"
                      : "";
        } else if (name === "password") {
            newErrors[name] =
                value.trim() === "" ? "* Password is required" : "";
        } else if (name === "c_password") {
            newErrors[name] =
                value.trim() === ""
                    ? "* Confirm Password is required"
                    : value !== formData.password
                      ? "* Passwords do not match"
                      : "";
        }

        setErrors(newErrors);
    };

    const isFormValid =
        Object.values(errors).every((error) => error === "") &&
        Object.values(formData).every((value) => value.trim() !== "");

    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    //LOGIN

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false); // Deshabilitar al empezar

        const loginData = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData), // Enviamos loginData, no formData
            });

            if (response.ok) {
                const data = await response.json();

                const { success, message, user } = data;

                showNotification(message);

                if (success) {
                    //console.log("User data:", user);
                    document.cookie = `user_id=${user.user_id}; path=/`;

                    axios.defaults.headers.common["Authorization"] =
                        `Bearer ${user.token}`;

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
            } else {
                showNotification("Login error. Verify your data.");
                setIsButtonEnabled(true); // <--- REACTIVAR AQUÍ
                setTimeout(() => {
                    window.location.href = "/Login_B";
                }, 1500);
            }
        } catch (error) {
            console.error("ERROR DETALLADO:", error); // <-- AGREGA ESTO
            showNotification("Network Error.");
            setIsButtonEnabled(true);
        }
    };

    //REGISTER

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showNotification("User registered successfully");
                setTimeout(() => {
                    window.location.href = "/Login_B";
                }, 1500);
            } else {
                showNotification("Register error. Verify your data.");
                /*setTimeout(() => {
                    window.location.href = "/Login_B";
                }, 1500);*/
            }
        } catch (error) {
            showNotification("Network Error.");
            setTimeout(() => {
                window.location.href = "/Login_B";
            }, 1500);
        }
    };

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <MDBTabs
                pills
                justify
                className="mb-3 d-flex flex-row justify-content-between"
            >
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
                <MDBTabsPane show={justifyActive === "tab1"}>
                    <form onSubmit={handleLogin}>
                        {errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="error-text">{errors.password}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div className="d-flex justify-content-between mx-4 mb-4">
                            <MDBCheckbox
                                name="flexCheck"
                                value=""
                                id="flexCheckDefault"
                                label="Remember me"
                            />
                            <a href="!#">Forgot password?</a>
                        </div>

                        <MDBBtn
                            class={`custom-button ${
                                !isButtonEnabled ? "clicked" : ""
                            }`}
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isButtonEnabled}
                            //onClick={handleButtonClick}
                        >
                            Sign in
                        </MDBBtn>
                        <p className="text-center">
                            Not a member?{" "}
                            <a
                                href="#!"
                                onClick={() => handleJustifyClick("tab2")}
                                active={justifyActive === "tab2"}
                            >
                                Register
                            </a>
                        </p>
                    </form>
                </MDBTabsPane>

                <MDBTabsPane show={justifyActive === "tab2"}>
                    <form onSubmit={handleRegister}>
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
                        {errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="error-text">{errors.password}</p>
                        )}

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.c_password && (
                            <p className="error-text">{errors.c_password}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Confirm Password"
                            id="c_password"
                            type="password"
                            name="c_password"
                            value={formData.c_password}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            class={`custom-button`}
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Sign up
                        </MDBBtn>
                    </form>
                </MDBTabsPane>
            </MDBTabsContent>
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
        </MDBContainer>
    );
}

export default Login_B;
