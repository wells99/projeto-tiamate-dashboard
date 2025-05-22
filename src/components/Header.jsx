import { NavLink } from "react-router";
import logo from "../assets/logo.png";

const Header = () => {
    return (
        <header className="w-[270px] bg-cafe p-4">
            <img src={logo} alt="Tiamate" className="m-auto" />
            <nav className="grid gap-3 mt-6 *:leading-[40px] *:text-creme *:duration-150 *:rounded *:pl-4">
                <NavLink
                    end
                    className={"hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin"}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    end
                    className={"hover:bg-creme/10 [&.active]:bg-bege"}
                    to={"/admin/usuarios"}
                >
                    Usuarios
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;