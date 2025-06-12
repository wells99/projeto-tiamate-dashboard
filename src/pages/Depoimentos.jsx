import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Rate, Table, Image, Upload } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"

const Depoimentos = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingDepoimento, setEditingDepoimento] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [depoimentos, setDepoimentos] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "imagem",
      key: "depoimento_imagem",
      width: "10%",
      align: "center",
      render: (imagem) => (
        <Image 
          src={imagem}
          alt="Depoimento"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nota",
      dataIndex: "nota",
      key: "depoimento_nota",
      width: "8%",
      align: "center",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "depoimento_nome",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Depoimento",
      dataIndex: "mensagem",
      key: "depoimento_mensagem",
      width: "53%",
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
    setEditingDepoimento(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    let imagemUrl = ""
    if (
      dados.depoimento_imagem &&
      Array.isArray(dados.depoimento_imagem) &&
      dados.depoimento_imagem.length > 0
    ) {
      const file = dados.depoimento_imagem[0].originFileObj
      imagemUrl = URL.createObjectURL(file)
    }

    setDepoimentos((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nota: String(dados.depoimento_nota),
        nome: dados.depoimento_nome,
        mensagem: dados.depoimento_mensagem,
        imagem: imagemUrl,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Depoimento criado com sucesso!",
      description: "Um depoimento foi adicionado a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingDepoimento(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      depoimento_nota: Number(record.nota),
      depoimento_nome: record.nome,
      depoimento_mensagem: record.mensagem,
      depoimento_imagem: record.imagem 
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: record.imagem,
            },
          ] 
        : [],
    })
  }

  // EDITAR
  function handleEdit(dados) {
    let imagemUrl = editingDepoimento.imagem;
    if (
      dados.depoimento_imagem &&
      Array.isArray(dados.depoimento_imagem) &&
      dados.depoimento_imagem.length > 0
    ) {
      const fileObj = dados.depoimento_imagem[0];
      if (fileObj.originFileObj) {
        imagemUrl = URL.createObjectURL(fileObj.originFileObj);
      } else if (fileObj.url) {
        imagemUrl = fileObj.url;
      }
    }
    
    setDepoimentos((prev) =>
      prev.map((item) => 
        item.key === editingDepoimento.key
          ? {
              ...item,
              nota: String(dados.depoimento_nota),
              nome: dados.depoimento_nome,
              mensagem: dados.depoimento_mensagem,
              imagem: imagemUrl,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingDepoimento(null)
    api.success({
      message: "Depoimento editado com sucesso!",
      description: "Um depoimento foi atualizado na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setDepoimentos((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Depoimento excluído com sucesso!",
      description: "Um depoimento foi removido da lista.",
    })
  }

  // BUSCAR DEPOIMENTOS
  useEffect(() => {
    fetch("http://localhost:3001/depoimentos")
    // fetch("https://projeto-tiamate-back.onrender.com/depoimentos")
      .then(res => res.json())
      .then(data => setDepoimentos(data))
  }, [])
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Depoimentos</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Depoimento
          </Button>
        </div>
        <Table
          dataSource={depoimentos}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Depoimento" : "Criar Depoimento"}
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
          initialValues={{ depoimento_nota: 5 }}
        >
          <Form.Item
            label="Nota"
            name={"depoimento_nota"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            label="Nome"
            name={"depoimento_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do usuário" />
          </Form.Item>
          <Form.Item
            label="Depoimento"
            name={"depoimento_mensagem"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Mensagem"
            />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name={"depoimento_imagem"}
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
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

export default Depoimentos;