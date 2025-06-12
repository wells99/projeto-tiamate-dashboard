import { useContext, useEffect, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"

const Redes = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingRede, setEditingRede] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [dadosRedes, setDadosRedes] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "rede_nome",
      width: "31%",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "rede_link",
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
    setEditingRede(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    setDadosRedes((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.rede_nome,
        link: dados.rede_link,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Rede criada com sucesso!",
      description: "Uma rede foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingRede(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      rede_nome: record.nome,
      rede_link: record.link,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    setDadosRedes((prev) =>
      prev.map((item) =>
        item.key === editingRede.key
          ? {
              ...item,
              nome: dados.rede_nome,
              link: dados.rede_link,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingRede(null)
    api.success({
      message: "Rede editada com sucesso!",
      description: "Uma rede foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setDadosRedes((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Rede excluída com sucesso!",
      description: "Uma rede foi removida da lista.",
    })
  }

  // BUSCAR REDES
  useEffect(() => {
    fetch("http://localhost:3001/redes")
    // fetch("https://projeto-tiamate-back.onrender.com/redes")
      .then(res => res.json())
      .then(data => setDadosRedes(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Redes</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Rede
          </Button>
        </div>
        <Table
          dataSource={dadosRedes}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Rede" : "Criar Rede"}
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
            name={"rede_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome da rede" />
          </Form.Item>
          <Form.Item
            label="Link"
            name={"rede_link"}
            rules={[
              { required: true, message: "Campo obrigatório!" },
              { type: "url", message: "Digite um link válido!" }
            ]}
          >
            <Input placeholder="Link da rede" type="url" />
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
 
export default Redes;