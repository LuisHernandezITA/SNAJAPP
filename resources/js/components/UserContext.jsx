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
        setUserInfo(null);
        document.cookie =
            "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    };

    const authenticateUser = useCallback(async (passedId = null) => {
        setLoading(true);
        try {
            // Si no nos pasan un ID, lo buscamos en la cookie
            const user_id = passedId || getCookie("user_id");
            const token = localStorage.getItem("token");

            // Solo hacemos la petición si hay un ID válido
            if (
                user_id &&
                user_id !== "undefined" &&
                user_id !== "null" &&
                token
            ) {
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;

                // Usamos la URL completa para evitar problemas de rutas relativas
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/user_show/${user_id}`,
                );

                const data = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;

                setUserInfo({
                    ...data,
                    token: token,
                    role: Number(data.role),
                });
            }
        } catch (error) {
            console.error("Auth error:", error);
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                logout();
            }
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
            value={{ userInfo, setUserInfo, logout, authenticateUser, loading }}
        >
            {children}
        </UserContext.Provider>
    );
};
