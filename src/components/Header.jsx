import { NavLink } from "react-router"
import logo from "../assets/logo.png"
import { CommentOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons"

const Header = () => {
    return (
        <header className="w-[270px] bg-cafe p-4">
            <img src={logo} alt="Tiamate" className="m-auto" />
            <nav className="grid gap-3 mt-6 *:leading-[40px] *:text-creme *:duration-150 *:rounded *:pl-4">
                <NavLink
                    end
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin"}
                >
                    <PieChartOutlined />
                    Dashboard
                </NavLink>
                <NavLink
                    end
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/usuarios"}
                >
                    <UserOutlined />
                    Usuarios
                </NavLink>
                <NavLink
                    end
                    className={"flex gap-2 hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/depoimentos"}
                >
                    <CommentOutlined />
                    Depoimentos
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;