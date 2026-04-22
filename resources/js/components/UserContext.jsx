import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import axios from "axios";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        // Limpiar estado
        setUserInfo(null);
        // Borrar Cookie
        document.cookie =
            "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Limpiar Axios Header
        delete axios.defaults.headers.common["Authorization"];
        // Limpiar token si lo guardaste en localStorage por error
        localStorage.removeItem("token");
    };

    const authenticateUser = useCallback(async (passedId = null) => {
        const user_id = passedId || getCookie("user_id");

        if (!user_id || user_id === "undefined") {
            setLoading(false);
            return;
        }

        try {
            // PASO 1: Generar el token (Lógica del reto)
            // Hacemos el login solo con el ID para obtener un token fresco
            const loginResponse = await axios.post("/api/login", {
                user_id: user_id,
            });

            const newToken =
                loginResponse.data.token || loginResponse.data.user?.token;

            if (newToken) {
                // PASO 2: Inyectar el token inmediatamente en Axios
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${newToken}`;

                // PASO 3: Obtener info del usuario usando el token recién inyectado
                // Nota: Aquí usamos el endpoint que ya tenías en tu api.php
                const userInfoResponse = await axios.get(
                    `http://127.0.0.1:8000/api/user_show/${user_id}`,
                );

                // Ajustamos según como devuelva Laravel (array u objeto)
                const data = Array.isArray(userInfoResponse.data)
                    ? userInfoResponse.data[0]
                    : userInfoResponse.data.user || userInfoResponse.data;

                setUserInfo({
                    ...data,
                    role: Number(data.role),
                    token: newToken,
                });
            }
        } catch (error) {
            console.error(
                "Error en el flujo de autenticación del reto:",
                error,
            );
            // Si el login falla, limpiamos
            if (error.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        authenticateUser();
    }, [authenticateUser]);

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === name) return cookie[1];
        }
        return null;
    }

    return (
        <UserContext.Provider
            value={{ userInfo, setUserInfo, logout, loading, authenticateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};
