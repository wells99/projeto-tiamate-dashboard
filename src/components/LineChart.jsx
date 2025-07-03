import { Line } from "react-chartjs-2"

function getLast30Days() {
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`)
  }
  return days
}

const LineChart = ({ leads }) => {
  const dias = getLast30Days()

  const contagem = dias.reduce((acc, dia) => {
    acc[dia] = 0
    return acc
  }, {})

  leads.forEach(lead => {
    if (lead.data) {
      const dataObj = new Date(lead.data)
      const dia = `${String(dataObj.getDate()).padStart(2, "0")}/${String(dataObj.getMonth() + 1).padStart(2, "0")}`
      if (contagem[dia] !== undefined) {
        contagem[dia] += 1
      }
    }
  })

  const valores = dias.map(dia => contagem[dia])
  const maxValor = Math.max(...valores, 1)

  const data = {
    labels: dias,
    datasets: [
      {
        label: "Leads por dia",
        data: valores,
        borderColor: "#A97744",
        backgroundColor: "#A9774450",
        tension: 0.3,
        fill: true,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { 
        beginAtZero: true,
        stepSize: 1,
        max: maxValor + 1,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center h-full p-12">
        <h1 className="text-lg text-cafe font-bold mb-4">Leads nos últimos 30 dias</h1>
        <Line data={data} options={options} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  )
}

export default LineChart