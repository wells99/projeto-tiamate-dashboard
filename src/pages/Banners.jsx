import { useState, useContext, useEffect } from "react";
import { AntContext } from "../contexts/AntContext";
import { Button, Drawer, Form, Input, Popconfirm, Table, Image, Upload } from "antd";
import { DeleteFilled, EditFilled, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";

const Banners = () => {
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const { api } = useContext(AntContext);
  const [form] = Form.useForm();
  const [banners, setBanners] = useState([]);

  const colunas = [
    {
      title: "Imagem",
      dataIndex: "imagem",
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
      dataIndex: "nome",
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
    setEditingBanner(null);
    form.resetFields();
  }

  function handleCreate(dados) {
    let imagemUrl = "";
    if (
      dados.banner_imagem &&
      Array.isArray(dados.banner_imagem) &&
      dados.banner_imagem.length > 0
    ) {
      const file = dados.banner_imagem[0].originFileObj;
      imagemUrl = URL.createObjectURL(file);
    }

    setBanners((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nome: dados.banner_nome,
        imagem: imagemUrl,
      },
    ]);
    form.resetFields();
    setVisibleCreate(false);

    api.success({
      message: "Banner criado com sucesso!",
      description: "Um banner foi adicionado à lista.",
    });
  }

  function openDrawerEdit(record) {
    setIsEditing(true);
    setEditingBanner(record);
    setVisibleCreate(true);
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
    });
  }

  function handleEdit(dados) {
    let imagemUrl = editingBanner.imagem;
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

    setBanners((prev) =>
      prev.map((item) =>
        item.key === editingBanner.key
          ? {
              ...item,
              nome: dados.banner_nome,
              imagem: imagemUrl,
            }
          : item
      )
    );
    form.resetFields();
    setVisibleCreate(false);
    setIsEditing(false);
    setEditingBanner(null);
    api.success({
      message: "Banner editado com sucesso!",
      description: "Um banner foi atualizado na lista.",
    });
  }

  function handleDelete(key) {
    setBanners((prev) => prev.filter((item) => item.key !== key));

    api.success({
      message: "Banner excluído com sucesso!",
      description: "Um banner foi removido da lista.",
    });
  }

  useEffect(() => {
    fetch("http://localhost:3001/banners")
      // ou: fetch("https://projeto-tiamate-back.onrender.com/banners")
      .then((res) => res.json())
      .then((data) => setBanners(data));
  }, []);

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
        <Table dataSource={banners} columns={colunas} />
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
        >
          <Form.Item
            label="Nome"
            name="banner_nome"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do Banner" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name="banner_imagem"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
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
