import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"

const Leads = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [leads, setLeads] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "lead_nome",
      width: "21%",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "lead_email",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      key: "lead_telefone",
      width: "15%",
      ellipsis: true,
      render: (text) => (
        <span>{text ? text.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : ""}</span>
      ),
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "lead_cidade",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "lead_estado",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Mídia",
      dataIndex: "midia",
      key: "lead_midia",
      width: "10%",
      ellipsis: true,
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
    setEditingLead(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    setLeads((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.lead_nome,
        email: dados.lead_email,
        telefone: dados.lead_telefone,
        cidade: dados.lead_cidade,
        estado: dados.lead_estado,
        midia: dados.lead_midia,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Lead criada com sucesso!",
      description: "Uma lead foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingLead(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      lead_nome: record.nome,
      lead_email: record.email,
      lead_telefone: record.telefone,
      lead_cidade: record.cidade,
      lead_estado: record.estado,
      lead_midia: record.midia,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    setLeads((prev) =>
      prev.map((item) =>
        item.key === editingLead.key
          ? {
              ...item,
              nome: dados.lead_nome,
              email: dados.lead_email,
              telefone: dados.lead_telefone,
              cidade: dados.lead_cidade,
              estado: dados.lead_estado,
              midia: dados.lead_midia,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingLead(null)
    api.success({
      message: "Lead editada com sucesso!",
      description: "Uma lead foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setLeads((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Lead excluída com sucesso!",
      description: "Uma lead foi removida da lista.",
    })
  }

  // BUSCAR LEADS
  useEffect(() => {
    fetch("http://localhost:3001/Leads")
      .then(res => res.json())
      .then(data => setLeads(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Leads</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Lead
          </Button>
        </div>
        <Table
          dataSource={leads}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Lead" : "Criar Lead"}
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
            name="lead_nome"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite o nome" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="lead_email"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite o email" />
          </Form.Item>
          <Form.Item
            label="Telefone"
            name="lead_telefone"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite o telefone" />
          </Form.Item>
          <Form.Item
            label="Cidade"
            name="lead_cidade"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione a cidade">
              <Select.Option value="Fortaleza">Fortaleza</Select.Option>
              <Select.Option value="Eusebio">Eusebio</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Estado"
            name="lead_estado"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione o estado">
              <Select.Option value="CE">CE</Select.Option>
              <Select.Option value="SP">SP</Select.Option>
              <Select.Option value="RJ">RJ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Mídia"
            name="lead_midia"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione a mídia">
              <Select.Option value="Instagram">Instagram</Select.Option>
              <Select.Option value="Linkedin">Linkedin</Select.Option>
              <Select.Option value="TV">TV</Select.Option>
            </Select>
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

export default Leads;