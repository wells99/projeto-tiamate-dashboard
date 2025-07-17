import { useState, useContext } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarPictures, useCriarPicture, useDeletarPicture, useEditarPicture } from "../hooks/pictureHooks"

const Pictures = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm();
  const { data: pictures, isLoading } = useBuscarPictures();
  const { mutateAsync: criar } = useCriarPicture();
  const { mutateAsync: editar } = useEditarPicture();
  const { mutateAsync: deletar } = useDeletarPicture();

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "picture_imagem",
      key: "picture_imagem",
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
      dataIndex: "picture_nome",
      key: "picture_nome",
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
            onConfirm={() => handleDelete(record.picture_id)}
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
      picture_id: record.picture_id,
      picture_nome: record.picture_nome
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
      onSuccess: (res) => {
        api.success({
          description: res.description,
        });
      },
    });
  }

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
          rowKey={"picture_id"}
          dataSource={pictures}
          columns={colunas}
          loading={isLoading}
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
            hidden
            name={"picture_id"}
          >
            <Input />
          </Form.Item>
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

export default Pictures;