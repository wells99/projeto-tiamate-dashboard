import { useContext, useEffect, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"

const Categorias = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [categorias, setCategorias] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "categoria_nome",
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
    setEditingCategoria(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    setCategorias((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.categoria_nome,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Categoria criada com sucesso!",
      description: "Uma categoria foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingCategoria(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      categoria_nome: record.nome,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    setCategorias((prev) =>
      prev.map((item) =>
        item.key === editingCategoria.key
          ? {
              ...item,
              nome: dados.categoria_nome,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingCategoria(null)
    api.success({
      message: "Categoria editada com sucesso!",
      description: "Uma categoria foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setCategorias((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Categoria excluída com sucesso!",
      description: "Uma categoria foi removida da lista.",
    })
  }

  // BUSCAR CATEGORIAS
  useEffect(() => {
    fetch("http://localhost:3001/categorias")
    // fetch("https://projeto-tiamate-back.onrender.com/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Categorias</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Categoria
          </Button>
        </div>
        <Table
          dataSource={categorias}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Categoria" : "Criar Categoria"}
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
            name={"categoria_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome da categoria" />
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
 
export default Categorias;