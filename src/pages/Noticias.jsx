import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image, Upload } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"

const Noticias = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingNoticias, setEditingNoticias] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [noticias, setNoticias] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Titulo",
      dataIndex: "titulo",
      key: "noticia_titulo",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "noticia_link",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "noticia_descricao",
      width: "41%",
      ellipsis: true,
    },
    {
      title: "Imagem",
      dataIndex: "imagem",
      key: "noticia_imagem",
      width: "10%",
      align: "center",
      render: (imagem) => (
        <Image 
          src={imagem}
          alt="Noticia"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
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
    setEditingNoticias(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    let imagemUrl = ""
    if (
      dados.noticia_imagem &&
      Array.isArray(dados.noticia_imagem) &&
      dados.noticia_imagem.length > 0
    ) {
      const file = dados.noticia_imagem[0].originFileObj
      imagemUrl = URL.createObjectURL(file)
    }

    setNoticias((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        titulo: dados.noticia_titulo,
        link: dados.noticia_link,
        descricao: dados.noticia_descricao,
        imagem: imagemUrl,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Notícia criada com sucesso!",
      description: "Uma notícia foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingNoticias(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      noticia_titulo: record.titulo,
      noticia_link: record.link,
      noticia_descricao: record.descricao,
      noticia_imagem: record.imagem
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
    let imagemUrl = editingNoticias.imagem;
    if (
      dados.noticia_imagem &&
      Array.isArray(dados.noticia_imagem) &&
      dados.noticia_imagem.length > 0
    ) {
      const fileObj = dados.noticia_imagem[0];
      if (fileObj.originFileObj) {
        imagemUrl = URL.createObjectURL(fileObj.originFileObj);
      } else if (fileObj.url) {
        imagemUrl = fileObj.url;
      }
    }

    setNoticias((prev) =>
      prev.map((item) =>
        item.key === editingNoticias.key
          ? {
              ...item,
              titulo: dados.noticia_titulo,
              link: dados.noticia_link,
              descricao: dados.noticia_descricao,
              imagem: imagemUrl,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingNoticias(null)
    api.success({
      message: "Notícia editada com sucesso!",
      description: "Uma notícia foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setNoticias((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Notícia excluída com sucesso!",
      description: "Uma notícia foi removida da lista.",
    })
  }

  // BUSCAR NOTICIAS
  useEffect(() => {
    fetch("http://localhost:3001/noticias")
      .then(res => res.json())
      .then(data => setNoticias(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Notícias</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Notícia
          </Button>
        </div>
        <Table
          dataSource={noticias}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Notícia" : "Criar Notícia"}
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
        >
          <Form.Item
            label="Titulo"
            name={"noticia_titulo"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Título da notícia" />
          </Form.Item>
          <Form.Item
            label="Link"
            name={"noticia_link"}
            rules={[
              { required: true, message: "Campo obrigatório!" },
              { type: "url", message: "Digite um link válido!" }
            ]}
          >
            <Input placeholder="https://example.com" type="url" />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name={"noticia_descricao"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <TextArea 
              rows={4}
              placeholder="Descrição da notícia"
            />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name={"noticia_imagem"}
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
 
export default Noticias;