import { NavLink } from "react-router"
import logo from "../assets/logo.png"
import { AppstoreOutlined, CommentOutlined, FileImageOutlined, MailOutlined, PictureOutlined, PieChartOutlined, ReadOutlined, ShopOutlined, ShoppingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons"

const Header = () => {
    return (
        <header className="w-[270px] h-screen overflow-auto bg-cafe p-4">
            <img src={logo} alt="Tiamate" className="m-auto" />
            <nav className="grid gap-3 mt-8 *:leading-[40px] *:text-creme *:duration-150 *:rounded *:pl-4">
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin"}
                    end
                >
                    <PieChartOutlined />
                    Dashboard
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/usuarios"}
                    end
                >
                    <UserOutlined />
                    Usuarios
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/categorias"}
                    end
                >
                    <AppstoreOutlined />
                    Categorias
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/produtos"}
                    end
                >
                    <ShoppingOutlined />
                    Produtos
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/unidades"}
                    end
                >
                    <ShopOutlined />
                    Unidades
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/banners"}
                    end
                >
                    <PictureOutlined />
                    Banners
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/redes"}
                    end
                >
                    <TeamOutlined />
                    Redes
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/depoimentos"}
                    end
                >
                    <CommentOutlined />
                    Depoimentos
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/noticias"}
                    end
                >
                    <ReadOutlined />
                    Noticias
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/leads"}
                    end
                >
                    <MailOutlined />
                    Leads
                </NavLink>
                <NavLink
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/pictures"}
                    end
                >
                    <FileImageOutlined />
                    Pictures
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;