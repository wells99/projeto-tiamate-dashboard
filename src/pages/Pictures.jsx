import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image, Upload } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons"

const Pictures = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPictures, setEditingPictures] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [pictures, setPictures] = useState([])

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "imagem",
      key: "pictures_imagem",
      width: "10%",
      align: "center",
      render: (imagem) => (
        <Image 
          src={imagem}
          alt="Picture"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "pictures_nome",
      width: "81%",
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
    setEditingPictures(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    let imagemUrl = ""
    if (
      dados.picture_imagem &&
      Array.isArray(dados.picture_imagem) &&
      dados.picture_imagem.length > 0
    ) {
      const file = dados.picture_imagem[0].originFileObj
      imagemUrl = URL.createObjectURL(file)
    }

    setPictures((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.picture_nome,
        imagem: imagemUrl,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Picture criada com sucesso!",
      description: "Uma picture foi adicionada a lista.",
    })
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true)
    setEditingPictures(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      picture_nome: record.nome,
      picture_imagem: record.imagem
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
    let imagemUrl = editingPictures.imagem;
    if (
      dados.picture_imagem &&
      Array.isArray(dados.picture_imagem) &&
      dados.picture_imagem.length > 0
    ) {
      const fileObj = dados.picture_imagem[0];
      if (fileObj.originFileObj) {
        imagemUrl = URL.createObjectURL(fileObj.originFileObj);
      } else if (fileObj.url) {
        imagemUrl = fileObj.url;
      }
    }

    setPictures((prev) =>
      prev.map((item) =>
        item.key === editingPictures.key
          ? {
              ...item,
              nome: dados.picture_nome,
              imagem: imagemUrl,
            }
          : item
      )
    )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingPictures(null)
    api.success({
      message: "Picture editada com sucesso!",
      description: "Uma picture foi atualizada na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setPictures((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Picture excluída com sucesso!",
      description: "Uma picture foi removida da lista.",
    })
  }

  // BUSCAR PICTURES
  useEffect(() => {
    fetch("http://localhost:3001/pictures")
    // fetch("https://projeto-tiamate-back.onrender.com/pictures")
      .then(res => res.json())
      .then(data => setPictures(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Pictures</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Picture
          </Button>
        </div>
        <Table
          dataSource={pictures}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Picture" : "Criar Picture"}
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
            name={"picture_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome da Picture" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name={"picture_imagem"}
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
 
export default Pictures;