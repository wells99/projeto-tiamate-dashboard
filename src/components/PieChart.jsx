import { Pie } from "react-chartjs-2"

const COLORS = [
  "#A97744", "#64221D", "#F7AE1A", "#C7794A"
]

function groupBy(leads, title) {
  return leads.reduce((acc, lead) => {
    const key = lead[title]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

const PieChart = ({ leads, title }) => {
  const grouped = groupBy(leads, title)
  const data = {
    labels: Object.keys(grouped),
    datasets: [
      {
        data: Object.values(grouped),
        backgroundColor: COLORS,
      },
    ],
  }
  const options = {
    plugins: {
      legend: { position: "bottom" },
    },
  }
  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center rounded-2xl p-4 bg-creme/60">
        <h1 className="text-lg text-cafe font-bold mb-4">De que {title} veio?</h1>
        <Pie data={data} options={options} />
      </div>
    </>
  )
}

export default PieChart;