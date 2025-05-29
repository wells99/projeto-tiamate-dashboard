import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Depoimentos from "../pages/Depoimentos";

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/admin/usuarios" element={<Usuarios />} />
                    <Route path="/admin/depoimentos" element={<Depoimentos />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;