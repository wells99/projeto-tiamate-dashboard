import { useState, useContext } from "react"
import { Button, Drawer, Form, Table } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"

const Unidades = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  return ( 
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Unidades</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setVisibleCreate(true)}
          >
            Nova Unidade
          </Button>
        </div>
        <Table

        />
      </div>

      <Drawer
        title="Criar Unidade"
        onClose={() => setVisibleCreate(false)}
        open={visibleCreate}
      >
        <Form
          layout="vertical"
          onFinish={() => console.log("Criar")}
        >
          <Form.Item
            label=""
            name={""}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >

          </Form.Item>
        </Form>
      </Drawer>
    </>
   );
}
 
export default Unidades;