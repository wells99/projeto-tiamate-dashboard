import { useContext, useEffect, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { AXIOS } from "../services"

const Usuarios = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [dadosUsuarios, setDadosUsuarios] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Nome",
      dataIndex: "usuario_nome",
      key: "usuario_nome",
      width: "31%",
    },
    {
      title: "Email",
      dataIndex: "usuario_email",
      key: "usuario_email",
      width: "60%",
    },
    {
      title: "Opções",
      key: "x",
      width: "9%",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-between">
          <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group" onClick={() => openDrawerEdit(record)}>
            <EditFilled className=" duration-150 !text-bege group-hover:!text-marrom" />
          </div>
          <Popconfirm
            title="Deseja excluir?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => handleDelete(record.key)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className=" duration-150 !text-bege group-hover:!text-marrom" />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // ABRIR CRIAR
  function openDrawerCreate() {
    setVisibleCreate(true)
    setIsEditing(false)
    setEditingUsuario(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    setDadosUsuarios((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.usuario_nome,
        email: dados.usuario_email,
        senha: dados.usuario_senha,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Usuario criado com sucesso!",
      description: "Um usuario foi adicionado a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingUsuario(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      usuario_nome: record.nome,
      usuario_email: record.email,
      usuario_senha: record.senha,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    setDadosUsuarios((prev) =>
      prev.map((item) =>
        item.key === editingUsuario.key
          ? {
            ...item,
            nome: dados.usuario_nome,
            email: dados.usuario_email,
            senha: dados.usuario_senha,
          }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingUsuario(null)
    api.success({
      message: "Usuario editado com sucesso!",
      description: "Um usuario foi atualizado na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setDadosUsuarios((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Usuario excluído com sucesso!",
      description: "Um usuario foi removido da lista.",
    })
  }

  async function buscarUsuarios() {
    const token = sessionStorage.getItem("token");
    if(token){
      const res = await AXIOS.get("/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status == 200) {
        setDadosUsuarios(res.data)
      }
    }
  }

  // BUSCAR USUARIOS
  useEffect(() => {
    buscarUsuarios()
  }, [])
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Usuários</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Usuário
          </Button>
        </div>
        <Table
          dataSource={dadosUsuarios}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Usuário" : "Criar Usuário"}
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
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
            <Input placeholder="Email do usuário" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name={"usuario_senha"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.Password placeholder="Senha do usuário" />
          </Form.Item>
          <Button
            type="primary"
            className="w-full"
            htmlType="submit"
          >
            {isEditing ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
}

export default Usuarios;