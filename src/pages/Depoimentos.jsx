import { useState, useContext } from "react"
import { AntContext } from "../contexts/AntContext"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Drawer, Form, Input, Popconfirm, Rate, Table } from "antd"
import TextArea from "antd/es/input/TextArea"

const Depoimentos = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [dadosDepoimento, setDadosDepoimentos] = useState([
    {
      key: 1,
      nota: "5",
      nome: "Kalil Sousa",
      mensagem: "O café é realmente bom, e os salgados também (pedi um croissant de 4 queijos). Já havia pedido antes via iFood mas resolvi fazer uma visita enquanto andava pelo Centro, o café fica mesmo ao lado da Praça do Ferreira. Vale a pena dar uma visitada quando quiser se refrescar com um café gelado deles ou tomar um café da manhã por lá.",
    },
    {
      key: 2,
      nota: "4",
      nome: "Eleonora Pereira",
      mensagem: "Excelente café no Centro da cidade. Vale a pena uma passará para quem estiver passando pela região.",
    },
    {
      key: 3,
      nota: "4,5",
      nome: "Alkaline Fernandes",
      mensagem: "Ótimo lugar para descansar tomando aquele café, cappuccino, matte, tiamatte...😍 meu refúgio de descanso em meio ao turbulento centro de Fortal City! rs",
    },
    {
      key: 4,
      nota: "5",
      nome: "Rochelly Beviláqua",
      mensagem: "Ambiente agradável, limpo, bem arrumado e com ótimas opções de lanche. Mesas organizadas, decoração bonita, atendimento rápido 😍😍😍",
    },
    {
      key: 5,
      nota: "4",
      nome: "Manoel Costa",
      mensagem: "Ambiente agradável e uma boa variedade de sabores e apresentações de café. Também os bolos e tortas merecem atenção por combinar muito bem com as bebidas quentes disponíveis na casa. A localização estratégica - bem perto da Praça do Ferreira - permite fácil acesso a pé para quem está no Centro de Fortaleza.",
    },
    {
      key: 6,
      nota: "4,5",
      nome: "Nágela Marques",
      mensagem: "Melhor local para tomar café no coração de Fortaleza, ambiente bem climatizado e ótimos atendentes, passo horas por lá sempre quando dá.Super indico ❤️❤️ aos amantes de café com estilo.",
    },
  ])
  const colunas = [
    {
      title: "Nota",
      dataIndex: "nota",
      key: "depoimento_nota",
      width: "8%",
      align: "center",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "depoimento_nome",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Depoimento",
      dataIndex: "mensagem",
      key: "depoimento_mensagem",
      width: "64%",
      ellipsis: true,
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "x",
      width: "110px",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-3">
          <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <EditFilled
                className=" duration-150 !text-bege group-hover:!text-marrom"
              />
            </div>
          <Popconfirm
            title="Deseja excluir?"
            onConfirm={() => handleDelete(record.key)}
            okText="Sim"
            cancelText="Não"
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled
                className=" duration-150 !text-bege group-hover:!text-marrom"
              />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // CRIAR
  function onSubmitCreate(dados) {
    setDadosDepoimentos((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        nota: String(dados.depoimento_nota),
        nome: dados.depoimento_nome,
        mensagem: dados.depoimento_mensagem,
      },
    ])
    form.resetFields()
    setVisibleCreate(false)

    api.success({
      message: "Depoimento criado com sucesso!",
      description: "Um depoimento foi adicionado a lista.",
    })
  }

  // DELETAR
  function handleDelete(key) {
    setDadosDepoimentos((prev) => prev.filter((item) => item.key !== key))

    api.success({
      message: "Depoimento excluído com sucesso!",
      description: "Um depoimento foi removido da lista.",
    })
  }
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Depoimentos</h1>
          <Button
            className="flex"
            type="primary"
            onClick={() => setVisibleCreate(true)}
          >
            <PlusCircleOutlined />
            Novo Depoimento
          </Button>
        </div>
        <Table
          dataSource={dadosDepoimento}
          columns={colunas}
          pagination={{ pageSize: 9 }}
        />
      </div>

      <Drawer
        title="Criar Depoimento"
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmitCreate}
          initialValues={{ depoimento_nota: 5 }}
        >
          <Form.Item
            label="Nota"
            name={"depoimento_nota"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            label="Nome"
            name={"depoimento_nome"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Nome do usuário" />
          </Form.Item>
          <Form.Item
            label="Depoimento"
            name={"depoimento_mensagem"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Mensagem"
            />
          </Form.Item>
          <Button
            type="primary"
            className="w-full"
            htmlType="submit"
          >
            Criar
          </Button>
        </Form>
      </Drawer>
    </>
  );
}

export default Depoimentos;