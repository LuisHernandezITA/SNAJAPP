import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const user_id = getCookie("user_id");

                if (user_id) {
                    // AUTH USER WITH ID
                    const response = await axios.post("/api/login", {
                        user_id: user_id,
                    });

                    //console.log(response.data.user.token);

                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${response.data.user.token}`;

                    if (response.data.success) {
                        // OBTAINING USER INFO
                        const userInfoResponse = await axios.post(
                            `/api/user_show?id=${user_id}`
                        );
                        const userInfo = {
                            ...userInfoResponse.data[0], // USER DATA
                            token: response.data.user.token, // ADDS GENERATED TOKEN IN LOGIN
                        };
                        if (userInfo) {
                            setUserInfo(userInfo);
                            //console.log("Auth User:", userInfo);
                        } else {
                            console.error("User data not found");
                        }
                    } else {
                        console.error("Failed Authentication");
                    }
                } else {
                    console.error("user_id not found (not logged)");
                }
            } catch (error) {
                console.error(error);
            }
        };

        authenticateUser();
    }, []);

    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === name) {
                return cookie[1];
            }
        }
        return null;
    };

    return (
        <UserContext.Provider value={{ userInfo }}>
            {children}
        </UserContext.Provider>
    );
};
