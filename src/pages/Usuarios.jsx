import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarUsuarios, useCriarUsuario, useDeletarUsuario, useEditarUsuario } from "../hooks/usuarioHooks"

const Usuarios = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const { api } = useContext(AntContext)
  const { data: usuarios, isFetching: carregandoUsuarios } = useBuscarUsuarios();
  const { mutateAsync: criar } = useCriarUsuario();
  const { mutateAsync: editar } = useEditarUsuario();
  const { mutateAsync: deletar } = useDeletarUsuario();

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
            onConfirm={() => handleDelete(record.usuario_id)}
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
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    criar(dados, {
      onSuccess: (resposta) => {
        form.resetFields()
        setVisibleCreate(false)
        api[resposta.type]({
          description: resposta.description,
        })
      }
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setVisibleCreate(true)
    form.setFieldsValue({
      usuario_id: record.usuario_id,
      usuario_nome: record.usuario_nome,
      usuario_email: record.usuario_email,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    editar(dados, {
      onSuccess: (resposta) => {
        form.resetFields()
        setVisibleCreate(false)
        setIsEditing(false)
        api[resposta.type]({
          description: resposta.description,
        })
      }
    })
  }

  // DELETAR
  function handleDelete(id) {
    deletar(id, {
      onSuccess: (resposta) => {
        api[resposta.type]({
          description: resposta.description,
        })
      }
    })
  }

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
          dataSource={usuarios}
          columns={colunas}
          loading={carregandoUsuarios}
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
            name={"usuario_id"}
            hidden
          >
            <Input />
          </Form.Item>
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
            <Input placeholder="Email do usuário" autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name={"usuario_senha"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.Password placeholder="Senha do usuário" autoComplete="new-password" />
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