import React from "react";
import ListCard from "./ListCard";
import Menu from "./Menu";
import { Routes, Route, Navigate } from "react-router-dom";
import Login_B from "./Login_B";
import Cart from "./Cart";
import Product from "./Product";
import Crud from "./Crud";
import CrudUsers from "./CrudUsers";
import CrudBanner from "./CrudBanner";
import CrudMusic from "./CrudMusic";
import MusicBlog from "./MusicBlog";

function Main() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Menu />}>
                    <Route path="item/:id" element={<Product />} />
                    <Route path="products" element={<Crud />} />
                    <Route path="users" element={<CrudUsers />} />
                    <Route path="banners" element={<CrudBanner />} />
                    <Route path="songs" element={<CrudMusic />} />
                    <Route path="store" element={<ListCard />} />
                    <Route path="music" element={<MusicBlog />} />
                    <Route path="login" element={<Login_B />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Route>
            </Routes>
        </>
    );
}

export default Main;
