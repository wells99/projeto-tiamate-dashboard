import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import {
  Button, Drawer, Form, Input, InputNumber, Popconfirm, Table, Image,
  Select
} from "antd"
import {
  DeleteFilled, EditFilled, PlusCircleOutlined
} from "@ant-design/icons"
import { useBuscarCategorias } from './../hooks/categoriaHooks';
import {
  useBuscarProdutos,
  useCriarProduto,
  useEditarProduto,
  useDeletarProduto
} from "../hooks/produtoHooks"

const Produtos = () => {
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const { api } = useContext(AntContext);

  const { data: produtos } = useBuscarProdutos()
  const { data: categorias, isFetched: carregouCategorias } = useBuscarCategorias()
  const { mutateAsync: criar } = useCriarProduto()
  const { mutateAsync: editar } = useEditarProduto()
  const { mutateAsync: deletar } = useDeletarProduto()

  const colunas = [
    {
      title: "Imagem",
      dataIndex: "produto_imagem",
      key: "produto_imagem",
      width: "10%",
      align: "center",
      render: (url) => (
        <Image
          src={url}
          alt="Produto"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nome",
      dataIndex: "produto_nome",
      key: "produto_nome",
      render: (text) => text?.replaceAll('"', '')
    },
    {
      title: "Descrição",
      dataIndex: "produto_descricao",
      key: "produto_descricao",
      render: (text) => text?.replaceAll('"', '')
    },
    {
      title: "Preço (R$)",
      dataIndex: "produto_preco",
      key: "produto_preco",
      render: (valor) => valor.toFixed(2).replace('.', ',')
    },
    {
      title: "Opções",
      key: "opcoes",
      width: "12%",
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
            onConfirm={() => handleDelete(record.produto_id)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className="duration-150 !text-bege group-hover:!text-marrom" />
            </div>
          </Popconfirm>
        </div>
      )
    }
  ]

  const openDrawerCreate = () => {
    setVisibleDrawer(true)
    setIsEditing(false)
    form.resetFields()
  }

  const openDrawerEdit = (record) => {
    setVisibleDrawer(true)
    setIsEditing(true)
    form.setFieldsValue({
      ...record,
      produto_nome: record.produto_nome?.replaceAll('"', ''),
      produto_descricao: record.produto_descricao?.replaceAll('"', '')
    })
  }

  const handleCreate = (dados) => {
    const formData = new FormData()
    formData.append("produto_nome", dados.produto_nome)
    formData.append("produto_descricao", dados.produto_descricao)
    formData.append("produto_preco", dados.produto_preco)
    formData.append("categoria_id", dados.categoria_id)
    formData.append("produto_imagem", dados.produto_imagem)

    criar(formData, {
      onSuccess: (res) => {
        form.resetFields()
        setVisibleDrawer(false)
        api[res.type]?.({ description: res.description })
      }
    })
  }

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

  const handleDelete = (id) => {
    deletar(id, {
      onSuccess: (res) => {
        api[res.type]?.({ description: res.description })
      }
    })
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Produtos</h1>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={openDrawerCreate}>
            Novo Produto
          </Button>
        </div>
        <Table rowKey="produto_id" dataSource={produtos} columns={colunas} />
      </div>

      <Drawer
        title={isEditing ? "Editar Produto" : "Criar Produto"}
        onClose={() => setVisibleDrawer(false)}
        open={visibleDrawer}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
        >
          <Form.Item name="produto_id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Nome"
            name="produto_nome"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="produto_descricao"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Preço (R$)"
            name="produto_preco"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Imagem"
            name="produto_imagem"
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e
              return e?.target?.files?.[0]
            }}
            rules={[{ required: isEditing ? false : true, message: "Campo obrigatório!" }]}
          >
            <input type="file" accept="image/*" />
          </Form.Item>

          <Form.Item
            label="Categoria ID"
            name="categoria_id"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            {/* <InputNumber className="w-full" /> */}
            <Select
              showSearch
              options={carregouCategorias && categorias.map(categoria => {
                return {
                  label: categoria.categoria_nome,
                  value: categoria.categoria_id
                }
              }) || []}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full mt-2">
            {isEditing ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </Form>
      </Drawer>
    </>
  )
}

export default Produtos
