import { useState, useContext } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { useBuscarNoticias, useCriarNoticia, useDeletarNoticia, useEditarNoticia } from "../hooks/noticiaHooks"

const Noticias = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const { data: noticias, isLoading } = useBuscarNoticias();
  const { mutateAsync: criar } = useCriarNoticia();
  const { mutateAsync: editar } = useEditarNoticia();
  const { mutateAsync: deletar } = useDeletarNoticia();

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "noticia_imagem",
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
      title: "Titulo",
      dataIndex: "noticia_titulo",
      key: "noticia_titulo",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Link",
      dataIndex: "noticia_link",
      key: "noticia_link",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Descrição",
      dataIndex: "noticia_descricao",
      key: "noticia_descricao",
      width: "41%",
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
            onConfirm={() => handleDelete(record.noticia_id)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className=" duration-150 !text-bege group-hover:!text-marrom" />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ]

  function openDrawerCreate() {
    setVisibleCreate(true);
    setIsEditing(false);
    form.resetFields();
  }

  async function handleCreate(dados) {
    await criar(dados, {
      onSuccess: (res) => {
        form.resetFields();
        setVisibleCreate(false);
        api.success({
          description: res?.description
        });
      },
    });
  }

  function openDrawerEdit(record) {
    setIsEditing(true);
    setVisibleCreate(true);
    form.setFieldsValue({
      noticia_id: record.noticia_id,
      noticia_titulo: record.noticia_titulo,
      noticia_link: record.noticia_link,
      noticia_descricao: record.noticia_descricao,
    });
  }

  async function handleEdit(dados) {
    await editar(dados, {
      onSuccess: (res) => {
        form.resetFields();
        setVisibleCreate(false);
        setIsEditing(false);
        api.success({
          description: res?.description
        });
      },
    });
  }

  function handleDelete(id) {
    deletar(id, {
      onSuccess: () => {
        api.success({
          description: "Um depoimento foi removido da lista.",
        });
      },
    });
  }

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
          rowKey={"noticia_id"}
          dataSource={noticias}
          columns={colunas}
          loading={isLoading}
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
            hidden
            name={"noticia_id"}
          >
            <Input />
          </Form.Item>
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
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.target?.files?.[0];
            }}
            rules={[{ required: !isEditing, message: "Campo obrigatório!" }]}
          >
            <Input type="file" />
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