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
        const user_id = passedId || getCookie("user_id");

        if (!user_id || user_id === "undefined") {
            setLoading(false);
            return;
        }

        try {
            // 1. Pedimos los datos y UN TOKEN NUEVO usando solo el ID
            // Esta ruta DEBE ser pública en api.php o no funcionará el refresco
            const response = await axios.get(
                `http://127.0.0.1:8000/api/user_show/${user_id}`,
            );
            const data = response.data.user || response.data;
            const newToken = response.data.token;

            if (newToken) {
                // 2. Inyectamos EL NUEVO TOKEN en Axios para las siguientes peticiones
                // (Carrito, Admin, etc.)
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${newToken}`;

                setUserInfo({
                    ...data,
                    role: Number(data.role),
                    token: newToken,
                });
            }
        } catch (error) {
            console.error("Error regenerando token:", error);
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
