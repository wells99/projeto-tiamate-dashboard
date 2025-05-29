import { PlusCircleOutlined } from "@ant-design/icons"
import { Button, Drawer, Form, Input } from "antd"
import { useState } from "react"

const Usuarios = () => {
    const [visibleCreate, setVisibleCreate] = useState(false);

    function onSubmitCreate(dados){
        console.log(dados);
    }
    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-bege font-bold">Usuarios</h1>
                <Button
                    type="primary"
                    onClick={() => setVisibleCreate(true)}
                >
                    <PlusCircleOutlined />
                    Novo Usuário
                </Button>
            </div>

            <Drawer
                title="Criar Usuário"
                onClose={() => setVisibleCreate(false)}
                open={visibleCreate}
            >
                <Form
                    layout="vertical"
                    onFinish={onSubmitCreate}
                >
                    <Form.Item
                        label="Nome"
                        name={"usuario_nome"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Nome do usuário" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name={"usuario_email"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input type="email" placeholder="Email do usuário" />
                    </Form.Item>
                    <Form.Item
                        label="Senha"
                        name={"usuario_senha"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Digite a senha" />
                    </Form.Item>
                    <Button
                        type="primary"
                        className="w-full"
                        htmlType="submit"
                    >
                        Criar
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

export default Usuarios;