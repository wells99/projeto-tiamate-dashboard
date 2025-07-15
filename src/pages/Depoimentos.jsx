import { useState, useContext } from "react";
import { AntContext } from "../contexts/AntContext";
import { Button, Drawer, Form, Input, Popconfirm, Rate, Table, Image } from "antd";
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useBuscarDepoimentos, useCriarDepoimento, useEditarDepoimento, useDeletarDepoimento } from "../hooks/depoimentosHooks";

const Depoimentos = () => {
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { api } = useContext(AntContext);
  const [form] = Form.useForm();
  const { data: depoimentos, isLoading } = useBuscarDepoimentos();
  const { mutateAsync: criar } = useCriarDepoimento();
  const { mutateAsync: editar } = useEditarDepoimento();
  const { mutateAsync: deletar } = useDeletarDepoimento();

  const colunas = [
    {
      title: "Imagem",
      dataIndex: "depoimento_imagem",
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
      ),
    },
    {
      title: "Nota",
      dataIndex: "depoimento_nota",
      key: "depoimento_nota",
      width: "8%",
      align: "center",
    },
    {
      title: "Nome",
      dataIndex: "depoimento_nome",
      key: "depoimento_nome",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Depoimento",
      dataIndex: "depoimento_descricao",
      key: "depoimento_descricao",
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
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group"
            onClick={() => openDrawerEdit(record)}
          >
            <EditFilled className="duration-150 !text-bege group-hover:!text-marrom" />
          </div>
          <Popconfirm
            title="Deseja excluir?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => handleDelete(record.depoimento_id)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className="duration-150 !text-bege group-hover:!text-marrom" />
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
          message: "Depoimento criado com sucesso!",
          description: res?.description || "Depoimento adicionado à lista.",
        });
      },
    });
  }

  function openDrawerEdit(record) {
    setIsEditing(true);
    setVisibleCreate(true);
    form.setFieldsValue({
      depoimento_nota: Number(record.depoimento_nota),
      depoimento_nome: record.depoimento_nome,
      depoimento_descricao: record.depoimento_descricao,
      depoimento_imagem: record.depoimento_imagem
        ? [
          {
            uid: "-1",
            name: "imagem.png",
            status: "done",
            url: record.depoimento_imagem,
          },
        ]
        : [],
    });
  }

  async function handleEdit(dados) {
    
    await editar(dados, {
      onSuccess: (res) => {
        form.resetFields();
        setVisibleCreate(false);
        setIsEditing(false);
        api.success({
          message: "Depoimento editado com sucesso!",
          description: res?.description || "Depoimento atualizado.",
        });
      },
    });
  }

  function handleDelete(id) {
    deletar(id, {
      onSuccess: () => {
        api.success({
          message: "Depoimento excluído com sucesso!",
          description: "Um depoimento foi removido da lista.",
        });
      },
    });
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Depoimentos</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={openDrawerCreate}
          >
            Novo Depoimento
          </Button>
        </div>
        <Table
          rowKey="depoimento_id"
          loading={isLoading}
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
          encType="multipart/form-data"
        >
          <Form.Item
            label="Nota"
            name="depoimento_nota"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            label="Nome"
            name="depoimento_nome"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do usuário" />
          </Form.Item>
          <Form.Item
            label="Depoimento"
            name="depoimento_descricao"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <TextArea rows={4} placeholder="Mensagem" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name="depoimento_imagem"
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
          <Button type="primary" className="w-full" htmlType="submit">
            {isEditing ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Depoimentos;