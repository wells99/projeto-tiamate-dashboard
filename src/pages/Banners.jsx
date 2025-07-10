import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarBanners, useCriarBanner } from './../hooks/bannerHooks';

const Banners = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingBanners, setEditingBanners] = useState(null)
  const [form] = Form.useForm()
  // const [banners, setBanners] = useState([])
  const { api } = useContext(AntContext)
  const { data: banners, isFetched } = useBuscarBanners();
  const { mutateAsync: criar } = useCriarBanner()


  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "banner_imagem",
      key: "banner_imagem",
      width: "10%",
      align: "center",
      render: (imagem) => (
        <Image
          src={imagem}
          alt="Banner"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nome",
      dataIndex: "banner_nome",
      key: "banner_nome",
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
    setEditingBanners(null)
    form.resetFields()
  }

  // CRIAR
  function handleCreate(dados) {
    // let imagemUrl = ""
    // if (
    //   dados.banner_imagem &&
    //   Array.isArray(dados.banner_imagem) &&
    //   dados.banner_imagem.length > 0
    // ) {
    //   const file = dados.banner_imagem[0].originFileObj
    //   imagemUrl = URL.createObjectURL(file)
    // }

    // setBanners((prev) => [
    //   ...prev,
    //   {
    //     key: prev.length + 1,
    //     nome: dados.banner_nome,
    //     imagem: imagemUrl,
    //   },
    // ])
    // form.resetFields()
    // setVisibleCreate(false)

    // api.success({
    //   message: "Banner criado com sucesso!",
    //   description: "Um banner foi adicionado a lista.",
    // })
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
    setEditingBanners(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      banner_nome: record.nome,
      banner_imagem: record.imagem
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
    let imagemUrl = editingBanners.imagem;
    if (
      dados.banner_imagem &&
      Array.isArray(dados.banner_imagem) &&
      dados.banner_imagem.length > 0
    ) {
      const fileObj = dados.banner_imagem[0];
      if (fileObj.originFileObj) {
        imagemUrl = URL.createObjectURL(fileObj.originFileObj);
      } else if (fileObj.url) {
        imagemUrl = fileObj.url;
      }
    }

    // setBanners((prev) =>
    //   prev.map((item) =>
    //     item.key === editingBanners.key
    //       ? {
    //         ...item,
    //         nome: dados.banner_nome,
    //         imagem: imagemUrl,
    //       }
    //       : item
    //   )
    // )
    form.resetFields()
    setVisibleCreate(false)
    setIsEditing(false)
    setEditingBanners(null)
    api.success({
      message: "Banner editado com sucesso!",
      description: "Um banner foi atualizado na lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    // setBanners((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Banner excluído com sucesso!",
      description: "Um banner foi removido da lista.",
    })
  }

  // BUSCAR BANNERS
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Banners</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Banner
          </Button>
        </div>
        <Table
          rowKey={"banner_id"}
          dataSource={banners}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Banner" : "Criar Banner"}
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
          encType="multipart/form-data"
        >
          <Form.Item
            label="Nome"
            name={"banner_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do Banner" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name={"banner_imagem"}
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.target?.files?.[0];
            }}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input type="file" />
          </Form.Item>
          <Form.Item
            label="Link"
            name={"banner_link"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Link do Banner" />
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

export default Banners;