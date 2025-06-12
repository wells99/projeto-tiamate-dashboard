import { useContext, useEffect, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"

const Unidades = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUnidade, setEditingUnidade] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [dadosUnidades, setDadosUnidades] = useState([])
  const [cep, setCep] = useState("")

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Endereço",
      dataIndex: "endereco",
      key: "unidade_endereco",
      width: "21%",
      ellipsis: true,
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "unidade_cidade",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "unidade_estado",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "CEP",
      dataIndex: "cep",
      key: "unidade_cep",
      width: "10%",
      ellipsis: true,
      render: (text) => (
        <span>{text ? text.replace(/(\d{5})(\d{3})/, "$1-$2") : ""}</span>
      ),
    },
    {
      title: "Hr Semana",
      dataIndex: "horario_semana",
      key: "unidade_horario_semana",
      width: "11%",
      ellipsis: true,
    },
    {
      title: "Hr Fds",
      dataIndex: "horario_fds",
      key: "unidade_horario_fds",
      width: "11%",
      ellipsis: true,
    },
    {
      title: "Maps",
      dataIndex: "maps",
      key: "unidade_maps",
      width: "18%",
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
    setEditingUnidade(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    setDadosUnidades((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        endereco: dados.unidade_endereco,
        cidade: dados.unidade_cidade,
        estado: dados.unidade_estado,
        cep: dados.unidade_cep,
        horario_semana: dados.unidade_horario_semana,
        horario_fds: dados.unidade_horario_fds,
        maps: dados.unidade_maps,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Unidade criada com sucesso!",
      description: "Uma unidade foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingUnidade(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      unidade_endereco: record.endereco,
      unidade_cidade: record.cidade,
      unidade_estado: record.estado,
      unidade_cep: record.cep,
      unidade_horario_semana: record.horario_semana,
      unidade_horario_fds: record.horario_fds,
      unidade_maps: record.maps,
    })
  }

  // EDITAR
  function handleEdit(dados) {
    setDadosUnidades((prev) =>
      prev.map((item) =>
        item.key === editingUnidade.key
          ? {
              ...item,
              endereco: dados.unidade_endereco,
              cidade: dados.unidade_cidade,
              estado: dados.unidade_estado,
              cep: dados.unidade_cep,
              horario_semana: dados.unidade_horario_semana,
              horario_fds: dados.unidade_horario_fds,
              maps: dados.unidade_maps,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingUnidade(null)
    api.success({
      message: "Unidade editada com sucesso!",
      description: "Uma unidade foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setDadosUnidades((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Unidade excluída com sucesso!",
      description: "Uma unidade foi removida da lista.",
    })
  }

  // BUSCAR CEP
  useEffect(() => {
    if(cep.length == 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({
            unidade_endereco: data.logradouro,
            unidade_cidade: data.localidade,
            unidade_estado: data.uf,
          })
        })
        .catch(() => {
          api.error({
            message: "CEP inválido!",
            description: "Digite um CEP válido.",
          })
        })
    }
  }, [cep])

  // BUSCAR UNIDADES
  useEffect(() => {
    fetch("http://localhost:3001/unidades")
    // fetch("https://projeto-tiamate-back.onrender.com/unidades")
      .then(res => res.json())
      .then(data => setDadosUnidades(data))
  }, [])

  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Unidades</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Unidade
          </Button>
        </div>
        <Table
          dataSource={dadosUnidades}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Unidade" : "Criar Unidade"}
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
        >
          <Form.Item
            label="CEP"
            name={"unidade_cep"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input 
              placeholder="Digite o CEP" 
              maxLength={8}
              onChange={(e) => setCep(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Endereço"
            name={"unidade_endereco"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite um endereço" />
          </Form.Item>
          <Form.Item
            label="Cidade"
            name={"unidade_cidade"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite uma cidade" />
          </Form.Item>
          <Form.Item
            label="Estado"
            name={"unidade_estado"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite um estado" />
          </Form.Item>
          <Form.Item
            label="Horario semana"
            name={"unidade_horario_semana"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Ex: 08:00 - 18:00" />
          </Form.Item>
          <Form.Item
            label="Horario fim de semana"
            name={"unidade_horario_fds"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Ex: 08:00 - 17:00" />
          </Form.Item>
          <Form.Item
            label="Maps"
            name={"unidade_maps"}
            rules={[
              { required: true, message: "Campo obrigatório!" },
              { type: "url", message: "Digite um link válido!" }
            ]}
          >
            <Input placeholder="Digite um link maps" type="url" />
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
 
export default Unidades;