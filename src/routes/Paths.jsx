import { BrowserRouter, Route, Routes } from "react-router"
import Login from "../pages/Login"
import DashboardLayout from "../layouts/DashboardLayout"
import Dashboard from "../pages/Dashboard"
import Usuarios from "../pages/Usuarios"
import Depoimentos from "../pages/Depoimentos"
import Noticias from "../pages/Noticias"
import Unidades from "../pages/Unidades"
import Categorias from "../pages/Categorias"
import Produtos from "../pages/Produtos"
import Banners from "../pages/Banners"
import Redes from "../pages/Redes"
import Leads from "../pages/Leads"
import Pictures from "../pages/Pictures"
import SafePaths from "./SafePaths"

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={<SafePaths><DashboardLayout /></SafePaths>}>
                    <Route index element={<Dashboard />} />
                    <Route path="/admin/usuarios" element={<Usuarios />} />
                    <Route path="/admin/categorias" element={<Categorias />} />
                    <Route path="/admin/produtos" element={<Produtos />} />
                    <Route path="/admin/unidades" element={<Unidades />} />
                    <Route path="/admin/banners" element={<Banners />} />
                    <Route path="/admin/redes" element={<Redes />} />
                    <Route path="/admin/depoimentos" element={<Depoimentos />} />
                    <Route path="/admin/noticias" element={<Noticias />} />
                    <Route path="/admin/leads" element={<Leads />} />
                    <Route path="/admin/pictures" element={<Pictures />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;