import { useState, useContext } from "react"
import { useNavigate } from "react-router"
import { Button, Form, Input } from "antd"
import { AntContext } from "../contexts/AntContext"
import bgLogin from "../assets/bg-login.png"
import { AXIOS } from "../services"

const Login = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { api } = useContext(AntContext)

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const res = await AXIOS.post("/login", values);
            if (res.status == 200 && res.data.token) {
                sessionStorage.setItem("token", res.data.token)
                sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario))
                api.success({
                    message: "Login efetuado com sucesso!"
                })
                navigate("/admin");
            } else {
                api.error({
                    message: res.data.description || res.data.message || "Email ou senha inválidos!"
                })
            }
        } catch (e) {
            api.error({
                message: "Erro ao conectar com o servidor!"
            })
            console.error(e)
        }
        setLoading(false)
    }
    return (
        <div className="flex justify-center items-center h-screen overflow-hidden">
            <div className="w-full lg:w-[400px] p-4 lg:px-[60px]">
                <Form
                    layout="vertical"
                    className=""
                    onFinish={onFinish}
                >
                    <h3 className="flex justify-center lg:block text-xl font-bold mb-4 text-bege">Seja bem-vindo</h3>
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
                        htmlType="submit"
                        loading={loading}
                    >
                        Entrar
                    </Button>
                </Form>
            </div>
            <div className="hidden lg:flex lg:flex-1">
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