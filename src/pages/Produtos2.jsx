import { useState, useContext, useEffect } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table, Image, Upload, InputNumber, Select } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { useBuscarProdutos, useCriarProduto, useDeletarProduto,  } from "../hooks/produtoHooks"

const Produtos = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])

    const { data: produtoss } = useBuscarProdutos();
    const { mutateAsync: criar } = useCriarProduto();
    const { mutateAsync: editar } = useEditarProduto();
    const { mutateAsync: deletar } = useDeletarProduto();

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Imagem",
      dataIndex: "imagem",
      key: "produto_imagem",
      width: "10%",
      align: "center",
      render: (imagem) => (
        <Image 
          src={imagem}
          alt="Produto"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "produto_nome",
      width: "20%",
    },
    {
      title: "Categoria",
      dataIndex: "categoria_id",
      key: "produto_categoria",
      width: "10%",
      render: (id) => categorias.find(cat => cat.key === id)?.nome || "Não definida",
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "produto_descricao",
      width: "41%",
    },
    {
      title: "Preço",
      dataIndex: "preco",
      key: "produto_preco",
      width: "10%",
      render: (preco) => `R$ ${Number(preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
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
    setEditingProduto(null)
    form.resetFields()
  }
 // CRIAR
  function handleCreate(dados) {
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
    setEditingProduto(record)
    setVisibleCreate(true)
    form.setFieldsValue({
      produto_nome: record.nome,
      produto_descricao: record.descricao,
      produto_preco: record.preco,
      categoria_id: record.categoria_id,
      produto_imagem: record.imagem
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
    const handleEdit = (dados) => {
        editar(dados, {
            onSuccess: (res) => {
                form.resetFields()
                setVisibleDrawer(false)
                setIsEditing(false)
                api[res.type]?.({ description: res.description })
            }
        })
    }

  // DELETAR
  function handleDelete(key) {
    setProdutos((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Produto excluído com sucesso!",
      description: "Um produto foi removido da lista.",
    })
  }

  // BUSCAR PRODUTOS
  useEffect(() => {
    fetch("http://localhost:3001/produtos")
    // fetch("https://projeto-tiamate-back.onrender.com/produtos")
      .then(res => res.json())
      .then(data => setProdutos(data))
  }, [])

  // BUSCAR CATEGORIAS
  useEffect(() => {
    fetch("http://localhost:3001/categorias")
    // fetch("https://projeto-tiamate-back.onrender.com/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
  }, [])
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">produtos</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Produto
          </Button>
        </div>
        <Table
          dataSource={produtos}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Produto" : "Criar Produto"}
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
            name={"produto_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do produto" />
          </Form.Item>
          <Form.Item
            label="Preço"
            name={"produto_preco"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              stringMode
              placeholder="Preço do produto"
              prefix="R$"
            />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name={"categoria_id"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione a categoria">
              {categorias.map(cat => (
                <Select.Option key={cat.key} value={cat.key}>
                  {cat.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Descrição"
            name={"produto_descricao"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Descrição do produto"
            />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name={"produto_imagem"}
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
 
export default Produtos;