import { Button, Form, Input } from "antd";
import bgLogin from "../assets/bg-login.png"

const Login = () => {
    return (
        <div className="lg:h-screen lg:flex lg:items-center overflow-hidden">
            <div className="w-full lg:w-[400px] p-4 lg:px-[60px]">
                <Form
                    layout="vertical"
                    className=""
                >
                    <h3 className="text-xl font-bold mb-4 text-bege">Seja bem-vindo</h3>
                    <Form.Item
                        name={"usuario_email"}
                        label={"Email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="Digite seu email" />
                    </Form.Item>
                    <Form.Item
                        name={"usuario_senha"}
                        label={"Senha"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.Password placeholder="********" />
                    </Form.Item>
                    <Button
                        type="primary"
                        className="w-full"
                    >
                        Entrar
                    </Button>
                </Form>
            </div>
            <div className="flex-1">
                <img
                    src={bgLogin}
                    alt="Tiamate"
                    className="w-full"
                />
            </div>
        </div>
    );
}

export default Login;