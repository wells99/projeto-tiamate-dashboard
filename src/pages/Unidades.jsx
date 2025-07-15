import { useContext, useEffect, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarUnidades, useCriarUnidade, useDeletarUnidade, useEditarUnidade } from "../hooks/unidadesHooks"

const Unidades = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { api } = useContext(AntContext)
  const [form] = Form.useForm()
  const [cep, setCep] = useState("")
  const { data: unidades, isLoading } = useBuscarUnidades();
  const { mutateAsync: criar } = useCriarUnidade();
  const { mutateAsync: editar } = useEditarUnidade();
  const { mutateAsync: deletar } = useDeletarUnidade();

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Endereço",
      dataIndex: "unidade_endereco",
      key: "unidade_endereco",
      width: "21%",
      ellipsis: true,
    },
    {
      title: "Cidade",
      dataIndex: "unidade_cidade",
      key: "unidade_cidade",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "unidade_estado",
      key: "unidade_estado",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "CEP",
      dataIndex: "unidade_cep",
      key: "unidade_cep",
      width: "10%",
      ellipsis: true,
      render: (text) => (
        <span>{text ? text.replace(/(\d{5})(\d{3})/, "$1-$2") : ""}</span>
      ),
    },
    {
      title: "Hr Semana",
      dataIndex: "unidade_horario_semana",
      key: "unidade_horario_semana",
      width: "11%",
      ellipsis: true,
    },
    {
      title: "Hr Fds",
      dataIndex: "unidade_horario_fds",
      key: "unidade_horario_fds",
      width: "11%",
      ellipsis: true,
    },
    {
      title: "Maps",
      dataIndex: "unidade_maps",
      key: "unidade_maps",
      width: "18%",
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
            onConfirm={() => handleDelete(record.unidade_id)}
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
    form.resetFields()
  }

  // CRIAR
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
      unidade_id: record.unidade_id,
      unidade_endereco: record.unidade_endereco,
      unidade_cidade: record.unidade_cidade,
      unidade_estado: record.unidade_estado,
      unidade_cep: record.unidade_cep,
      unidade_horario_semana: record.unidade_horario_semana,
      unidade_horario_fds: record.unidade_horario_fds,
      unidade_maps: record.unidade_maps

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

  // BUSCAR CEP
  useEffect(() => {
    if (cep.length == 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({
            unidade_endereco: data.logradouro,
            unidade_cidade: data.localidade,
            unidade_estado: data.uf,
          })
        })
        .catch(() => {
          api.error({
            message: "CEP inválido!",
            description: "Digite um CEP válido.",
          })
        })
    }
  }, [cep])


  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Unidades</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Unidade
          </Button>
        </div>
        <Table
          rowKey="unidade_id"
          dataSource={unidades}
          columns={colunas}
          loading={isLoading}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Unidade" : "Criar Unidade"}
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
            name={"unidade_id"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CEP"
            name={"unidade_cep"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input
              placeholder="Digite o CEP"
              maxLength={8}
              onChange={(e) => setCep(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Endereço"
            name={"unidade_endereco"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite um endereço" />
          </Form.Item>
          <Form.Item
            label="Cidade"
            name={"unidade_cidade"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite uma cidade" />
          </Form.Item>
          <Form.Item
            label="Estado"
            name={"unidade_estado"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Digite um estado" />
          </Form.Item>
          <Form.Item
            label="Horario semana"
            name={"unidade_horario_semana"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Ex: 08:00 - 18:00" />
          </Form.Item>
          <Form.Item
            label="Horario fim de semana"
            name={"unidade_horario_fds"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input placeholder="Ex: 08:00 - 17:00" />
          </Form.Item>
          <Form.Item
            label="Maps"
            name={"unidade_maps"}
            rules={[
              { required: true, message: "Campo obrigatório!" },
              { type: "url", message: "Digite um link válido!" }
            ]}
          >
            <Input placeholder="Digite um link maps" type="url" />
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

export default Unidades;