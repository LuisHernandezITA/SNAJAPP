/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import "./bootstrap";

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import ReactDOM from "react-dom/client";
import React from "react";
import Main from "./components/Main";
import { BrowserRouter } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { UserProvider } from "./components/UserContext";
import "@fortawesome/fontawesome-svg-core/styles.css";

ReactDOM.createRoot(document.getElementById("app")).render(
    <UserProvider>
        <BrowserRouter>
            <Main />
        </BrowserRouter>
    </UserProvider>
);
