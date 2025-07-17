import { useState, useContext } from "react";
import { AntContext } from "../contexts/AntContext";
import { Button, Drawer, Form, Input, Popconfirm, Table, Image } from "antd";
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons";
import { useBuscarBanners, useCriarBanner, useDeletarBanner, useEditarBanner } from './../hooks/bannerHooks';

const Banners = () => {
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { api } = useContext(AntContext);
  const [form] = Form.useForm();
  const { data: banners, isLoading } = useBuscarBanners();
  const { mutateAsync: criar } = useCriarBanner();
  const { mutateAsync: editar } = useEditarBanner();
  const { mutateAsync: deletar } = useDeletarBanner();

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
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group"
            onClick={() => openDrawerEdit(record)}
          >
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
  ];

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
          message: "Banner criado com sucesso!",
          description: res?.description || "Banner adicionado à lista.",
        });
      },
    });
  }

  function openDrawerEdit(record) {
    setIsEditing(true);
    setVisibleCreate(true);
    form.setFieldsValue({
      banner_id: record.banner_id,
      banner_nome: record.banner_nome,
      banner_link: record.banner_link
    });
  }

  async function handleEdit(dados) {
    await editar(dados, {
      onSuccess: (res) => {
        form.resetFields();
        setVisibleCreate(false);
        setIsEditing(false);
        api.success({
          message: "Banner editado com sucesso!",
          description: res?.description || "Banner atualizado.",
        });
      },
    });
  }

  function handleDelete(id) {
    deletar(id, {
      onSuccess: () => {
        api.success({
          message: "Banner excluído com sucesso!",
          description: "Um depoimento foi removido da lista.",
        });
      },
    });
  }

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
          loading={isLoading}
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
            hidden
            name={"banner_id"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nome"
            name="banner_nome"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do Banner" />
          </Form.Item>
          <Form.Item
            label="Link"
            name="banner_link"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do Banner" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name="banner_imagem"
            valuePropName="fileList"
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
          <Button type="primary" className="w-full" htmlType="submit">
            {isEditing ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Banners;
